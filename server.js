const mongoose = require('mongoose');
const dotenv = require('dotenv');
const socket_io = require('socket.io');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

const attackController = require('./controllers/attackController');
const bombController = require('./controllers/bombController');
const gameController = require('./controllers/gameController');
const planeController = require('./controllers/planeController');

dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful!'));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// clean DB
if (process.env.NODE_ENV === 'development') {
  attackController.clean();
  bombController.clean();
  gameController.clean();
  planeController.clean();
}

const io = socket_io(server, {
  transports: ['websocket', 'polling'],
  cors: {
    origin: '*',
  },
});

io.sockets.on('connection', (socket) => {
  console.log('connect ', socket.client.conn.id);

  socket.on('create-game', async (data) => {
    data = JSON.parse(data);
    const gameCode = await gameController.createGame(data);

    socket.join(gameCode);
    socket.emit('game-created', gameCode);
  });

  socket.on('join-lobby', async (data) => {
    data = JSON.parse(data);

    const game = await gameController.checkGame(data);

    if (!game) {
      socket.emit('client-error', `Cannot join game ${data.gameCode}`);
      return;
    }

    socket.join(data.gameCode);
    socket.emit('success-join-lobby', game.player1);
    socket.to(data.gameCode).emit('joined-lobby', data.playerName);

    const iterations = 5;
    const delay = 1000;
    let counter = 0;

    const intervalId = setInterval(function () {
      io.to(data.gameCode).emit(
        'update-counter',
        (iterations - counter).toString()
      );

      counter++;

      if (counter === iterations) {
        clearInterval(intervalId);

        const myPlanes = planeController.generatePlanes(game.level);
        const enemyPlanes = planeController.generatePlanes(game.level);

        socket.emit('start-game', JSON.stringify(myPlanes.planes));
        socket
          .to(data.gameCode)
          .emit('start-game', JSON.stringify(enemyPlanes.planes));

        planeController.createPlanes(myPlanes.group_planes, 2, data.gameCode);
        planeController.createPlanes(
          enemyPlanes.group_planes,
          1,
          data.gameCode
        );
      }
    }, delay);
  });

  socket.on('attack', async (data) => {
    data = JSON.parse(data);
    data.target = data.target.replace('enemy_', '');
    data.playerCode === 1 ? (data.playerCode = 2) : (data.playerCode = 1);

    const response = await planeController.handleAttack(data);
    let bomb = await bombController.checkBomb(data);
    if (bomb === -1) {
      bomb = 1;

      socket.emit(
        'load-hits',
        JSON.stringify(await attackController.getAttacks(data))
      );

      socket.to(data.gameCode).emit('load-bombs');
    }

    switch (response) {
      case 'already':
        socket.emit('client-error', `You already hit here!`);
        break;
      case 'air':
      case 'hit':
        socket.emit(
          'attack-response',
          JSON.stringify([response, data.target, bomb])
        );
        socket
          .to(data.gameCode)
          .emit('attacked', JSON.stringify([response, data.target]));
        break;
      case 'winner':
        socket.emit('winner');
        socket.to(data.gameCode).emit('defeated');
        break;
    }
  });

  socket.on('attackBomb', async (data) => {
    data = JSON.parse(data);
    await bombController.createBomb(data);
  });

  socket.on('disconnecting', async () => {
    const room = Array.from(socket.rooms)[1];
    if (room) {
      socket.to(room).emit('cancel-game');
    }
  });

  socket.on('disconnect', async () => {
    console.log('exit ', socket.client.conn.id);
  });
});

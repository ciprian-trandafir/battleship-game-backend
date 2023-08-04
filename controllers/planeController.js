const Plane = require('./../models/planeModel');
const Game = require('./../models/gameModel');
const attackController = require('./attackController');
const planeService = require('./../service/planeService');

exports.clean = async () => {
  await Plane.deleteMany();
};

exports.generatePlanes = (level) => {
  return planeService.generatePlanes(level);
};

exports.createPlanes = (planes, owner, gameCode) => {
  return new Promise(async (resolve) => {
    for (const plane of planes) {
      let body = [];

      for (const point of plane) {
        body.push({ point });
      }

      await Plane.create({ gameCode, owner, body });
    }

    resolve();
  });
};

exports.handleAttack = (data) => {
  return new Promise(async (resolve) => {
    let plane = await Plane.findOne({
      gameCode: data.gameCode,
      owner: data.playerCode,
      'body.point': data.target,
    });

    if (!plane) {
      data.status = 'air';
      await attackController.createAttack(data);

      return resolve('air');
    }

    const pointIndex = plane.body.findIndex(
      (item) => item.point === data.target
    );
    if (plane.body[`${pointIndex}`].hit) {
      return resolve('already');
    }

    plane.body[`${pointIndex}`].hit = true;
    plane.body[`${pointIndex}`].hitAt = Date.now();
    let finished = true;
    for (const point of plane.body) {
      if (!point.hit) {
        finished = false;
        break;
      }
    }

    plane.finished = finished;
    await plane.save();

    data.status = 'hit';
    await attackController.createAttack(data);

    // check winner
    const alivePlanes = await Plane.find({
      gameCode: data.gameCode,
      owner: data.playerCode,
      finished: false,
    });

    if (!alivePlanes.length) {
      let game = await Game.findOne({
        code: data.gameCode,
      });

      game.finishedAt = Date.now();
      game.winner = data.playerCode === 1 ? game.player2 : game.player1;
      await game.save();

      return resolve('winner');
    }

    return resolve('hit');
  });
};

# Battleship Game API with Node.js, Express, Socket.io, and MongoDB

## Features

- Classic Battleship gameplay with enhanced rules.
- Multiple difficulty levels (hard, medium, and easy).
- Strategic bombs for disrupting opponent visibility.
- Lobby system for private games with unique codes.
- Real-time gameplay with Socket.io.
- Data storage using MongoDB for games, ships, bombs, and attacks.

## Requirements

- Node.js (v16 or later).
- MongoDB server (local or remote).

## Installation

1. Clone this repository to your local machine: 
```bash
git clone https://github.com/ciprian-trandafir/battleship-game-backend.git
```
2. Navigate to cloned directory.
3. Install the dependencies:
```bash
npm install
```
4. Configure the database connection string and password in **config.env** file.
5. Start the application:
```bash
npm run dev
```

## Listened events

- `connection`: Triggered when a new client connects to the server.
- `create-game`: Triggered when a user wants to create a new game.
- `join-lobby`: Triggered when a user wants to join an existing private game lobby.
- `attack`: Triggered when a player attacks a target on the grid during the game.
- `attackBomb`: Triggered when a player uses a strategic bomb during the game.
- `disconnecting`: Triggered when a client is in the process of disconnecting from the server.
- `disconnect`: Triggered when a client disconnects completely from the server.

### Emitted Events

- `game-created`: Emitted when a new game is created, providing the unique game code.
- `client-error`: Emitted in case of an error, displaying an error message.
- `success-join-lobby`: Emitted when a player successfully joins a private lobby, providing the username of the first player.
- `joined-lobby`: Emitted when a new player joins a lobby, providing the username of the newly joined player.
- `update-counter`: Emitted to synchronize the start of the game, showing a countdown.
- `start-game`: Emitted when the game is ready to start, providing player's ship positions.
- `load-hits`: Emitted when loading previous hits on the grid during the game.
- `load-bombs`: Emitted to load available bombs during the game.
- `attack-response`: Emitted after an attack, providing the result, target, and information about the launched enemy bomb.
- `attacked`: Emitted when a player is attacked, providing the attack result and the target.
- `winner`: Emitted when a player wins the game.
- `defeated`: Emitted when a player is defeated.
- `cancel-game`: Emitted to cancel the game when a player disconnects.

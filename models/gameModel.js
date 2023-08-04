const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      maxLength: 10,
    },
    player1: {
      type: String,
      maxLength: 30,
    },
    player2: {
      type: String,
      maxLength: 30,
    },
    level: {
      type: String,
    },
    finishedAt: {
      type: Date,
    },
    winner: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;

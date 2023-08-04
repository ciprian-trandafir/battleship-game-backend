const Game = require('./../models/gameModel');
const Helper = require('./../utils/helper');

exports.clean = async () => {
  await Game.deleteMany();
};

exports.createGame = async (data) => {
  const game = await Game.create({
    code: Helper.generateRandomString(6),
    player1: data.playerName,
    level: data.level,
  });

  return game.code;
};

exports.checkGame = async (data) => {
  const game = await Game.findOne({ code: data.gameCode });

  if (game && !game.finishedAt && !game.player2) {
    game.player2 = data.playerName;
    await game.save();

    return game;
  }

  return false;
};

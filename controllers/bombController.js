const Bomb = require('./../models/bombModel');
const Plane = require("../models/planeModel");

exports.clean = async () => {
  await Bomb.deleteMany();
};

exports.createBomb = async (data) => {
  return await Bomb.create({
    code: data.gameCode,
    player: data.playerCode,
    bomb_index: data.bombName.replace('bomb', ''),
  });
};

exports.checkBomb = async (data) => {
  const bomb = await Bomb.findOne({
    code: data.gameCode,
    player: data.playerCode,
    attack_left: {
      $gt: 0,
    },
  });

  if (!bomb) {
    return 1;
  }

  bomb.attack_left--;
  await bomb.save();

  if (bomb.attack_left === 0) {
    return -1;
  }

  return 0;
};

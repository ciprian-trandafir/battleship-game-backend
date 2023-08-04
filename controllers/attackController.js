const Attack = require('./../models/attackModel');

exports.clean = async () => {
  await Attack.deleteMany();
};

exports.createAttack = async (data) => {
  await Attack.create({
    code: data.gameCode,
    player: data.playerCode,
    position: data.target,
    status: data.status,
  });
};

exports.getAttacks = async (data) => {
  const attacks = await Attack.find({
    code: data.gameCode,
    player: data.playerCode,
  });

  let result = [];
  for (const attack of attacks) {
    result.push(`${attack.position}?${attack.status}`);
  }

  return result;
};

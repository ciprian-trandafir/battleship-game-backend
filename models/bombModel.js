const mongoose = require('mongoose');

const bombSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      maxLength: 10,
    },
    player: {
      type: Number,
    },
    bomb_index: {
      type: Number,
    },
    attack_left: {
      type: Number,
      default: 3,
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

const Bomb = mongoose.model('Bomb', bombSchema);

module.exports = Bomb;

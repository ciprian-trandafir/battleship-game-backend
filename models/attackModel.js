const mongoose = require('mongoose');

const attackSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      maxLength: 10,
    },
    player: {
      type: Number,
    },
    position: {
      type: String,
      maxLength: 30,
    },
    status: {
      type: String,
      maxLength: 30,
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

const Attack = mongoose.model('Attack', attackSchema);

module.exports = Attack;

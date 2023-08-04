const mongoose = require('mongoose');

const planeSchema = new mongoose.Schema(
  {
    gameCode: {
      type: String,
      maxLength: 10,
    },
    owner: {
      type: Number,
    },
    body: [
      {
        point: {
          type: String,
        },
        hit: {
          type: Boolean,
          default: false,
        },
        hitAt: {
          type: Date,
        }
      },
    ],
    finished: {
      type: Boolean,
      default: false,
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

const Plane = mongoose.model('Plane', planeSchema);

module.exports = Plane;

const mongoose = require("mongoose");

const Cooldowns = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unqiue: true,
  },
  racing: {
    type: Number,
    required: false,
    default: 0,
  },
  energydrink: {
    type: Number,
    required: false,
    default: 0,
  },
  daily: {
    type: Number,
    required: false,
    default: 0,
  },
  weekly: {
    type: Number,
    required: false,
    default: 0,
  },
  barn: {
    type: Number,
    required: false,
    default: 0,
  },
  betracing: {
    type: Number,
    required: false,
    default: 0,
  },
  cashcup: {
    type: Number,
    required: false,
    default: 0,
  },
  voted: {
    type: Number,
    required: false,
    default: 0,
  },
  drift: {
    type: Number,
    required: false,
    default: 0,
  },
  hm: {
    type: Number,
    required: false,
    default: 0,
  },
  junk: {
    type: Number,
    required: false,
    default: 0,
  },
  sponsor: {
    type: Number,
    required: false,
    default: 0,
  },
  waterbottle: {
    type: Number,
    required: false,
    default: 0,
  },
  swheelspin: {
    type: Number,
    required: false,
    default: 0,
  },
  wheelspin: {
    type: Number,
    required: false,
    default: 0,
  },
  timetrial: {
    type: Number,
    required: false,
    default: 0,
  },
});

module.exports = mongoose.model("cooldowns", Cooldowns);

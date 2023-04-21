const mongoose = require("mongoose");

const Stats = new mongoose.Schema({
  users: {
    type: Number,
    required: false,
    default: 0
  }
});

module.exports = mongoose.model("stats", Stats);

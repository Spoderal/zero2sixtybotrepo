const mongoose = require("mongoose");

const Car = new mongoose.Schema({
  name: {
    type: String,
    required: false,
  },

  liveries: {
    type: Array,
    required: false,
    default: [],
  },
  awaiting: {
    type: Array,
    required: false,
    default: [],
  },

});

module.exports = mongoose.model("car", Car);

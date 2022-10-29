const mongoose = require("mongoose");

const Global = new mongoose.Schema({
  crews: {
    type: Array,
    required: false,
    default: [],
  },
  itemshop: {
    type: Array,
    required: false,
    default: [],
  },
  double: {
    type: Boolean,
    required: false,
    default: false,
  },
  itemshopcooldown: {
    type: Number,
    required: false,
    default: 0,
  },
  botcolor: {
    type: String,
    required: false,
    default: "#60b0f4",
  },
  zeroplus:{
    type:Array,
    required:false,
    default:[]
  }
});

module.exports = mongoose.model("global", Global);

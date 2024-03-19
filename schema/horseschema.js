const mongoose = require("mongoose");

const Horse = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unqiue: true,
  },
    cash: {
        type: Number,
        required: false,
        default: 0,
    },
    horses:{
        type: Array,
        required: false,
        default: [],
    },
  
});

module.exports = mongoose.model("horse", Horse);

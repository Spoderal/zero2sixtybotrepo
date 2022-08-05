const mongoose = require("mongoose");

const Job = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unqiue: true,
  },
  job: {
    type: String,
    required: false,
    default: "None",
  },
  salary: {
    type: Number,
    required: false,
    default: 0,
  },
  timeout: {
    type: Number,
    required: false,
    default: 0,
  },
});

module.exports = mongoose.model("job", Profile);

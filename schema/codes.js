const mongoose = require("mongoose");

const Codes = new mongoose.Schema({
    code: {
        type: String,
        required: true,
    },
    uses: {
        type: Number,
        required: true,
    },
    creator: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
    },
    usedBy: {
        type: Array,
        required: true,
    },
    
});

module.exports = mongoose.model("codes", Codes);

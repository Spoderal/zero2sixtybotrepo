const mongoose = require("mongoose");

const Tournament = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    prize: {
        type: Number,
        required: true,
    },
    maxhp: {
        type: Number,
        required: true,
    },
    players: {
        type: Array,
        required: true,
    },
    losers: {
        type: Array,
        required: true,
    },
    tournamentId:{
        type: String,
        required: true,
    
    },
    maxPlayers:{
        type: Number,
        required: true,
    },
    owner:{
        type: String,
        required: true,
    },
    started:{
        type: Boolean,
        required: true,
    }

    
});

module.exports = mongoose.model("tournament", Tournament);

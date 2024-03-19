const mongoose = require("mongoose");

const Carshow = new mongoose.Schema({
    theme: {
        type: String,
        required: true,
    },
    prize: {
        type: Number,
        required: true,
    },

    players: {
        type: Array,
        required: true,
    },
    carshowId:{
        type: String,
        required: true,
    
    },
    maxPlayers:{
        type: Number,
        required: false,
    },
    owner:{
        type: String,
        required: true,
    },
    voted:{
        type: Array,
        required: true,
    }
    
    
});

module.exports = mongoose.model("carshows", Carshow);

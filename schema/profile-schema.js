const mongoose = require('mongoose')

const Profile = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unqiue: true
    },
    cash: {
        type: Number,
        required: false,
        default: 0
    },
    gold: {
        type: Number,
        required: false,
        default: 0
    },
    wheelspins: {
        type: Number,
        required: false,
        default: 0
    },
    swheelspins: {
        type: Number,
        required: false,
        default: 0
    },
    rkeys: {
        type: Number,
        required: false,
        default: 0
    },
    ckeys: {
        type: Number,
        required: false,
        default: 0
    },
    ekeys: {
        type: Number,
        required: false,
        default: 0
    },
    cmaps: {
        type: Number,
        required: false,
        default: 0
    },
    ucmaps: {
        type: Number,
        required: false,
        default: 0
    },
    rmaps: {
        type: Number,
        required: false,
        default: 0
    },
    lmaps: {
        type: Number,
        required: false,
        default: 0
    },
    cars: {
        type: Array,
        required: false,
        default: []
    },
    parts: {
        type: Array,
        required: false,
        default: []
    },
    rp: {
        type: Number,
        required: false,
        default: 0
    },
    noto: {
        type: Number,
        required: false,
        default: 0
    },
    dkeys: {
        type: Number,
        required: false,
        default: 0
    },
    fkeys: {
        type: Number,
        required: false,
        default: 0
    },
    bank: {
        type: Number,
        required: false,
        default: 0
    },
    banklimit: {
        type: Number,
        required: false,
        default: 10000
    }
})


module.exports = mongoose.model('profile', Profile)
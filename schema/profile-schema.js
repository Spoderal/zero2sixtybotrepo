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
    garageLimit: {
      type: Number,
      required: false,
      default: 10
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
    },
    items: {
        type: Array,
        required: false,
        default: []
    },
    racerank:{
        type: Number,
        required: false,
        default: 1
    },
    racexp:{
        type: Number,
        required: false,
        default: 0
    },
    driftrank:{
        type: Number,
        required: false,
        default: 1
    },
    driftxp:{
        type: Number,
        required: false,
        default: 0
    },
    racing:{
        type: Number,
        required: false,
        default: 0
    },
    prestige: {
        type: Number,
        required: false,
        default: 0
    },
    using: {
        type: Array,
        required: false,
        default: []
    },
    house:{
        type: Object,
        required: false
    },
    badges:{
        type: Array,
        required: false,
        default: []
    },
    xessence:{
        type: Number,
        required: false,
        default: 0
    },
    helmet:{
        type: String,
        required: false,
        default: 'Default'
    },
    description:{
        type: String,
        required: false,
        default: 'No Description'
    },
    background:{
        type:String,
        required: false,
        default: 'Default'
    },
    job:{
        type: Object,
        required: false
    },
    cashcuptier:{
        type: Number,
        required: false,
        default: 1
    },
    codes:{
        type: Array,
        required: false,
        default: []
    },
    pfps:{
        type: Array,
        required: false,
        default: []
    }
})


module.exports = mongoose.model('profile', Profile)
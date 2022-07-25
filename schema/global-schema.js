const mongoose = require('mongoose')

const Global = new mongoose.Schema({
    crews: {
        type: Array,
        required: false,
        default: []
    },
    itemshop:{
        type: Array,
        required: false,
        default: []
    },
    double:{
        type: Boolean,
        required: false,
        default: false
    }

})

module.exports = mongoose.model('global', Global)
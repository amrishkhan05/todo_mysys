const mongoose = require('mongoose');

var schema = new mongoose.Schema({
    name : {
        type : String,
        required: true
    },
    description : {
        type: String,
        required: true,
        unique: false
    },
    date : String,
    status : String
})

const Tododb = mongoose.model('tododb', schema);

module.exports = Tododb;
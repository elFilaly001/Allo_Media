const mongoose = require("mongoose");

const schema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true, 
        minlength: 3
    }
});

module.exports = mongoose.model('Role', schema);
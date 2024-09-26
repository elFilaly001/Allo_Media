const { default: mongoose } = require("mongoose");

// Function to get the current date and time
const currentDateTime = () => new Date();

const schema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true, 
        minlength: 3
    },
    email: {
        type: String,
        unique: true,
        required: true,
        minlength: 3
    },
    password: {
        type: String,
        required: true,
        minlength: 3
    },
    phone: {
        type: String,
        unique: true,
        required: true,
        minlength: 10,
        maxlength:10
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: currentDateTime 
    },
    lastLogin: { 
        type: Date,
        default: currentDateTime
    }
});

module.exports = mongoose.model('User', schema);

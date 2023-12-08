const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String, 
        required: true,
        unique: true
    },
    email: {
        type: String, 
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String, 
        required: true
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
}); 

module.exports = mongoose.model('User', userSchema);
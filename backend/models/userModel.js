const mongoose = require('mongoose');
const validator = require('validator');

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

// static method to signup user
userSchema.statics.signup = async function(name, email, password) {
    // check if all fields are provided
    if (!name || !email || !password) {
        throw new Error('All fields are required');
    }

    // check if email is valid
    if (!validator.isEmail(email)) {
        throw new Error('Email is invalid');
    }

    // check if email already exists
    const existingUser = await this.findOne({ email });

    if (existingUser) {
        throw new Error('Email already in use');
    }

    const user = await this.create({ name, email, password });

    return user;
}

module.exports = mongoose.model('User', userSchema);
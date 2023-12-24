const mongoose = require('mongoose');
const validator = require('validator');
const bcrpt = require('bcrypt');

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
    passwordHash: {
        type: String, 
        required: true
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
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


    // check if email/name already exists
    const existingUser = await this.findOne({ email });
    if (existingUser) {
        throw new Error('Email already in use');
    }

    const existingName = await this.findOne({ name });
    if (existingName) {
        throw new Error('Name already in use');
    }
    

    // hash password
    const passwordHash = await bcrpt.hash(password, 10);
    const user = await this.create({ name, email, passwordHash });

    return user;
}

// static method to login user
userSchema.statics.login = async function(nameOrEmail, password) {
    // check if all fields are provided
    if (!nameOrEmail || !password) {
        throw new Error('All fields are required');
    }

    // check if nameOrEmail exists
    const user = await this.findOne({ $or: [{ name: nameOrEmail }, { email: nameOrEmail }] });

    if (!user) {
        throw new Error('User Not Found');
    }

    // check if password is correct
    const isMatch = await bcrpt.compare(password, user.passwordHash);

    if (!isMatch) {
        throw new Error('Password is incorrect');
    }

    return user;
}

module.exports = mongoose.model('User', userSchema);
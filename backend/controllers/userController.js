const User = require('../models/userModel');

// login user
const loginUser = async (req, res) => {
    // const { email, password } = req.body;
    // try {
    //     const user = await User.login(email, password);
    //     res.status(200).json(user);
    // } catch (err) {
    //     res.status(400).json({ message: err.message });
    // }
    res.json({ message: 'login user' });
}

// signup user
const signupUser = async (req, res) => {
    // const { name, email, password } = req.body;
    // try {
    //     const user = await User.create({ name, email, password });
    //     res.status(201).json(user);
    // } catch (err) {
    //     res.status(400).json({ message: err.message });
    // }
    res.json({ message: 'signup user' });
}

// GET a user
const getUser = async (req, res) => {
    res.json({ message: 'get a user' });
}

// UPDATE a user
const updateUser = async (req, res) => {
    res.json({ message: 'update a user' });
}

// DELETE a user
const deleteUser = async (req, res) => {
    res.json({ message: 'delete a user' });
}

module.exports = {
    loginUser,
    signupUser,
    getUser,
    updateUser,
    deleteUser
}
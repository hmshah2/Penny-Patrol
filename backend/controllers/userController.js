const User = require('../models/userModel');
const Spending = require('../models/spendingModel');
const Income = require('../models/incomeModel');
const Budget = require('../models/budgetModel');

const validator = require('validator');

const mongoose = require('mongoose');

// login user
const loginUser = async (req, res) => {
    const { nameOrEmail, password } = req.body;

    try {
        const user = await User.login(nameOrEmail, password);
        res.status(200).json({
            message: "User Logged In Successfully",
            data: user
        })
    } catch (error) {
        res.status(400).json({
            message: "Bad Request",
            data: error.message
        })
    }
}

// signup user
const signupUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const user = await User.signup(name, email, password);
        res.status(201).json({
            message: "User Created Successfully",
            data: user
        })
    } catch (error) {
        res.status(400).json({
            message: "Bad Request",
            data: error.message
        })
    }
}

// GET all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({
            message: "Get All Users Successfully",
            data: users
        })
    } catch {
        res.status(500).json({
            message: "Internal Server Error",
            data: error.message
        })
    }
}

// GET a user
const getSingleUser = async (req, res) => {
    var { id } = req.params;

    // check valid id
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({
            message: "User Not Found",
            data: {}
        })
    }

    // select parameter
    var { select } = req.query;
    select = select ? JSON.parse(select) : {};

    try {
        var user = await User.findById(id).select(select);

        if (user) {
            res.status(200).json({
                message: "Get A Single User Successfully",
                data: user
            })
        } else {
            res.status(404).json({
                message: "User Not Found",
                data: {}
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            data: error.message
        })
    }

}

// UPDATE a user
const updateUser = async (req, res) => {
    var { id } = req.params;

    // check valid id
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({
            message: "User Not Found",
            data: {}
        })
    }

    var { name, email, password } = req.body;

    // check if all fields are provided
    if (!name || !email || !password) {
        return res.status(400).json({
            message: "All fields are required",
            data: {}
        })
    }

    // check if email is valid
    if (!validator.isEmail(email)) {
        return res.status(400).json({
            message: "Email is invalid",
            data: {name, email, password}
        })
    }

    try {
        // check if email already exists
        const existingUser = await User.findOne({ email, _id: { $ne: id } });

        if (existingUser) { 
            return res.status(400).json({
                message: "Email already in use",
                data: {}
            })
        }

        // update user
        var user = await User.findByIdAndUpdate(id, { name, email, password }, { new: true });

        if (user) {
            res.status(200).json({
                message: "User Updated Successfully",
                data: user
            })
        } else {
            res.status(404).json({
                message: "User Not Found",
                data: {}
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            data: error.message
        })
    }
}

// DELETE a user
const deleteUser = async (req, res) => {
    var { id } = req.params;

    // check valid id
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({
            message: "User Not Found",
            data: {}
        })
    }

    try {
        var user = await User.findByIdAndDelete(id);

        if (user) {
            // delete all spendings that belong to this user
            await Spending.deleteMany({ user: id });

            // delete all incomes that belong to this user
            await Income.deleteMany({ user: id });

            // delete all budgets that belong to this user
            await Budget.deleteMany({ user: id });

            res.status(200).json({
                message: "User Deleted Successfully",
                data: user
            })
        } else {
            res.status(404).json({
                message: "User Not Found",
                data: {}
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            data: error.message
        })
    }
}

module.exports = {
    loginUser,
    signupUser,
    getAllUsers,
    getSingleUser,
    updateUser,
    deleteUser
}
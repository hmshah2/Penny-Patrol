const Spending = require('../models/spendingModel');

const mongoose = require('mongoose');

// GET all spendings
const getAllSpendings = async (req, res) => {
    res.json({ message: 'get all spendings' });
}

// POST a spending
const createSpending = async (req, res) => {
    res.json({ message: 'create a spending' });
}

// GET a spending
const getSingleSpending = async (req, res) => {
    res.json({ message: 'get a spending' });
}

// PUT a spending
const updateSpending = async (req, res) => {
    res.json({ message: 'update a spending' });
}

// DELETE a spending
const deleteSpending = async (req, res) => {
    res.json({ message: 'delete a spending' });
}

module.exports = {
    getAllSpendings,
    createSpending,
    getSingleSpending,
    updateSpending,
    deleteSpending
}
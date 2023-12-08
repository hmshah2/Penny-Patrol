const Budget = require('../models/budgetModel');

const mongoose = require('mongoose');

// GET all budgets
const getAllBudgets = async (req, res) => {
    res.json({ message: 'get all budgets' });
}

// POST a budget
const createBudget = async (req, res) => {
    res.json({ message: 'create a budget' });
}

// GET a budget
const getSingleBudget = async (req, res) => {
    res.json({ message: 'get a budget' });
}

// PUT a budget
const updateBudget = async (req, res) => {
    res.json({ message: 'update a budget' });
}

// DELETE a budget
const deleteBudget = async (req, res) => {
    res.json({ message: 'delete a budget' });
}

module.exports = {
    getAllBudgets,
    createBudget,
    getSingleBudget,
    updateBudget,
    deleteBudget
}
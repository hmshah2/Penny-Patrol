const Income = require('../models/incomeModel');

const mongoose = require('mongoose');

// GET all incomes
const getAllIncomes = async (req, res) => {
    res.json({ message: 'get all incomes' });
}

// POST an income
const createIncome = async (req, res) => {
    res.json({ message: 'create an income' });
}

// GET an income
const getSingleIncome = async (req, res) => {
    res.json({ message: 'get an income' });
}

// PUT an income
const updateIncome = async (req, res) => {
    res.json({ message: 'update an income' });
}

// DELETE an income
const deleteIncome = async (req, res) => {
    res.json({ message: 'delete an income' });
}

module.exports = {
    getAllIncomes,
    createIncome,
    getSingleIncome,
    updateIncome,
    deleteIncome
}
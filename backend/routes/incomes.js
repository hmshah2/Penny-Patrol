const express = require('express');

// income controller
const { getAllIncomes, createIncome, getSingleIncome, updateIncome, deleteIncome } = require('../controllers/incomeController');

const router = express.Router();

// GET all incomes
router.get('/', getAllIncomes);

// POST an income
router.post('/', createIncome);

// GET an income
router.get('/:id', getSingleIncome);

// UPDATE an income
router.put('/:id', updateIncome);

// DELETE an income
router.delete('/:id', deleteIncome);

module.exports = router;
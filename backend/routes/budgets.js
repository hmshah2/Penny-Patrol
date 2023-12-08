const express = require('express');

// budget controller
const { getAllBudgets, createBudget, getSingleBudget, updateBudget, deleteBudget } = require('../controllers/budgetController');

const router = express.Router();

// GET all budgets
router.get('/', getAllBudgets);

// POST a budget
router.post('/', createBudget);

// GET a budget
router.get('/:id', getSingleBudget);

// UPDATE a budget
router.put('/:id', updateBudget);

// DELETE a budget
router.delete('/:id', deleteBudget);

module.exports = router;
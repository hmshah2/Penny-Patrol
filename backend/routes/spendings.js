const express = require('express');

// spending controller
const { getAllSpendings, createSpending, getSingleSpending, updateSpending, deleteSpending } = require('../controllers/spendingController');

const router = express.Router();

// GET all spendings
router.get('/', getAllSpendings);

// POST a spending
router.post('/', createSpending);

// GET a spending
router.get('/:id', getSingleSpending);

// UPDATE a spending
router.put('/:id', updateSpending);

// DELETE a spending
router.delete('/:id', deleteSpending);

module.exports = router;
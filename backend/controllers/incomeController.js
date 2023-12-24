const Income = require('../models/incomeModel');

const mongoose = require('mongoose');

// GET all incomes
const getAllIncomes = async (req, res) => {
    var { where, sort, select, skip, limit, count } = req.query;

    var where = where ? JSON.parse(where) : {};
    var sort = sort ? JSON.parse(sort) : {};
    var select = select ? JSON.parse(select) : {};
    var skip = parseInt(skip) || 0;
    var limit = parseInt(limit) || 0;
    var count = count === "true";

    try {
        var incomes = await Income.find(where).sort(sort).select(select).skip(skip).limit(limit);
        
        if (incomes.length > 0) {
            // return incomes document
            if (!count) {
                res.status(200).json({
                    message: 'Incomes Found',
                    data: incomes
                })
            } else {
                // return incomes count
                res.status(200).json({
                    message: 'Incomes Found',
                    data: incomes.length
                })
            }
        } else {
            res.status(404).json({ 
                message: 'Incomes Not found',
                data: {}
             });
        }
    } catch (error) {
        res.status(500).json({ 
            message: 'Internal Server Error',
            data: error.message
        });
    }
}

// POST an income
const createIncome = async (req, res) => {
    var { amount, category, description, date } = req.body;

    // check required fields
    if (!amount || !category || !date) {
        return res.status(400).json({
            message: "Required Fields Missing",
            data: {}
        })
    }

    description = description || "";

    // handle date in string
    if (typeof date === 'string') {
        // date in "mm/dd/yyyy"
        if (isNaN(date)) {
            date = new Date(date);
        } else {
            // deadline in milliseconds in string
            date = new Date(Number(date));
        }
    } else {
        // handle deadline in milliseconds in number
        date = new Date(date);
    }

    try {
        var income = await Income.create({ amount, category, description, date });

        res.status(201).json({
            message: 'Income Created',
            data: income
        })
    } catch (error) {
        res.status(500).json({ 
            message: 'Internal Server Error',
            data: error.message
        });
    }
}

// GET an income
const getSingleIncome = async (req, res) => {
    var { id } = req.params;

    // check valid id
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({
            message: "Income Not Found",
            data: {}
        })
    }

    // select parameter
    var { select } = req.query;
    select = select ? JSON.parse(select) : {};

    try {
        var income = await Income.findById(id).select(select);

        if (income) {
            res.status(200).json({
                message: 'Income Found',
                data: income
            })
        } else {
            res.status(404).json({ 
                message: 'Income Not found',
                data: {}
            });
        }
    } catch (error) {
        res.status(500).json({ 
            message: 'Internal Server Error',
            data: error.message
        });
    }
}

// PUT an income
const updateIncome = async (req, res) => {
    // check valid id
    var { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({
            message: "Income Not Found",
            data: {}
        })
    }

    // check required fields
    var { amount, category, description, date } = req.body;

    if (!amount || !category || !date) {
        return res.status(400).json({
            message: "Required Fields Missing",
            data: {}
        })
    }

    description = description || "";

    // handle date in string
    if (typeof date === 'string') {
        // date in "mm/dd/yyyy"
        if (isNaN(date)) {
            date = new Date(date);
        } else {
            // deadline in milliseconds in string
            date = new Date(Number(date));
        }
    } else {
        // handle deadline in milliseconds in number
        date = new Date(date);
    }

    try {
        var income = await Income.findByIdAndUpdate(id, { amount, category, description, date }, { new: true });

        if (income) {
            res.status(200).json({
                message: 'Income Updated',
                data: income
            })
        } else {
            res.status(404).json({ 
                message: 'Income Not found',
                data: {}
            });
        }

    } catch (error) {
        res.status(500).json({ 
            message: 'Internal Server Error',
            data: error.message
        });
    }
}

// DELETE an income
const deleteIncome = async (req, res) => {
    // check valid id
    var { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({
            message: "Income Not Found",
            data: {}
        })
    }

    try {
        var income = await Income.findByIdAndDelete(id);

        if (income) {
            res.status(200).json({
                message: 'Income Deleted',
                data: income
            })
        } else {
            res.status(404).json({ 
                message: 'Income Not found',
                data: {}
            });
        }

    } catch (error) {
        res.status(500).json({ 
            message: 'Internal Server Error',
            data: error.message
        });
    }
}

module.exports = {
    getAllIncomes,
    createIncome,
    getSingleIncome,
    updateIncome,
    deleteIncome
}
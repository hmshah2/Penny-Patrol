const Budget = require('../models/budgetModel');

const mongoose = require('mongoose');

// GET all budgets
const getAllBudgets = async (req, res) => {
    var { where, sort, select, skip, limit, count } = req.query;

    var where = where ? JSON.parse(where) : {};
    var sort = sort ? JSON.parse(sort) : {};
    var select = select ? JSON.parse(select) : {};
    var skip = parseInt(skip) || 0;
    var limit = parseInt(limit) || 0;
    var count = count === "true";

    try {
        var budgets = await Budget.find(where).sort(sort).select(select).skip(skip).limit(limit);
        
        if (budgets.length > 0) {
            // return budgets document
            if (!count) {
                res.status(200).json({
                    message: 'Budgets Found',
                    data: budgets
                })
            } else {
                // return budgets count
                res.status(200).json({
                    message: 'Budgets Found',
                    data: budgets.length
                })
            }
        } else {
            res.status(404).json({ 
                message: 'Budgets Not found',
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

// POST a budget
const createBudget = async (req, res) => {
    var { amount, startDate, endDate } = req.body;

    // check required fields
    if (!amount || !startDate || !endDate) {
        return res.status(400).json({
            message: "Required Fields Missing",
            data: {}
        })
    }

    // handle startDate in string
    if (typeof startDate === 'string') {
        // startdate in "mm/dd/yyyy"
        if (isNaN(startDate)) {
            startDate = new Date(startDate);
        } else {
            // deadline in milliseconds in string
            startDate = new Date(Number(startDate));
        }
    } else {
        // handle deadline in milliseconds in number
        startDate = new Date(startDate);
    }

    // handle endDate in string
    if (typeof endDate === 'string') {
        // enddate in "mm/dd/yyyy"
        if (isNaN(endDate)) {
            endDate = new Date(endDate);
        } else {
            // deadline in milliseconds in string
            endDate = new Date(Number(enDdate));
        }
    } else {
        // handle deadline in milliseconds in number
        endDate = new Date(endDate);
    }

    try {
        var budget = await Budget.create({ amount, startDate, endDate });

        res.status(201).json({
            message: 'Budget Created',
            data: budget
        })
    } catch (error) {
        res.status(500).json({ 
            message: 'Internal Server Error',
            data: error.message
        });
    }
}

// GET a budget
const getSingleBudget = async (req, res) => {
    var { id } = req.params;

    // check valid id
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({
            message: "Budget Not Found",
            data: {}
        })
    }

    // select parameter
    var { select } = req.query;
    select = select ? JSON.parse(select) : {};

    try {
        var budget = await Budget.findById(id).select(select);

        if (budget) {
            res.status(200).json({
                message: 'Budget Found',
                data: budget
            })
        } else {
            res.status(404).json({ 
                message: 'Budget Not found',
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

// PUT a budget
const updateBudget = async (req, res) => {
    var { id } = req.params;

    // check valid id
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({
            message: "Budget Not Found",
            data: {}
        })
    }

    var { amount, startDate, endDate } = req.body;

    // check required fields
    if (!amount || !startDate || !endDate) {
        return res.status(400).json({
            message: "Required Fields Missing",
            data: {}
        })
    }

    // handle startDate in string
    if (typeof startDate === 'string') {
        // startdate in "mm/dd/yyyy"
        if (isNaN(startDate)) {
            startDate = new Date(startDate);
        } else {
            // deadline in milliseconds in string
            startDate = new Date(Number(startDate));
        }
    } else {
        // handle deadline in milliseconds in number
        startDate = new Date(startDate);
    }

    // handle endDate in string
    if (typeof endDate === 'string') {
        // enddate in "mm/dd/yyyy"
        if (isNaN(endDate)) {
            endDate = new Date(endDate);
        } else {
            // deadline in milliseconds in string
            endDate = new Date(Number(enDdate));
        }
    } else {
        // handle deadline in milliseconds in number
        endDate = new Date(endDate);
    }

    try {
        var budget = await Budget.findByIdAndUpdate(id, { amount, startDate, endDate }, { new: true });

        if (budget) {
            res.status(200).json({
                message: 'Budget Updated',
                data: budget
            })
        } else {
            res.status(404).json({ 
                message: 'Budget Not found',
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

// DELETE a budget
const deleteBudget = async (req, res) => {
    var { id } = req.params;

    // check valid id
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({
            message: "Budget Not Found",
            data: {}
        })
    }

    try {
        var budget = await Budget.findByIdAndDelete(id);

        if (budget) {
            res.status(200).json({
                message: 'Budget Deleted',
                data: budget
            })
        } else {
            res.status(404).json({ 
                message: 'Budget Not found',
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
    getAllBudgets,
    createBudget,
    getSingleBudget,
    updateBudget,
    deleteBudget
}
const Spending = require('../models/spendingModel');

const mongoose = require('mongoose');

// GET all spendings
const getAllSpendings = async (req, res) => {
    var { where, sort, select, skip, limit, count } = req.query;

    var where = where ? JSON.parse(where) : {};
    var sort = sort ? JSON.parse(sort) : {};
    var select = select ? JSON.parse(select) : {};
    var skip = parseInt(skip) || 0;
    var limit = parseInt(limit) || 0;
    var count = count === "true";

    try {
        var spendings = await Spending.find(where).sort(sort).select(select).skip(skip).limit(limit);
        
        if (spendings.length > 0) {
            // return spendings document
            if (!count) {
                res.status(200).json({
                    message: 'Spendings Found',
                    data: spendings
                })
            } else {
                // return spendings count
                res.status(200).json({
                    message: 'Spendings Found',
                    data: spendings.length
                })
            }
        } else {
            res.status(404).json({ 
                message: 'Spendings Not found',
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

// POST a spending
const createSpending = async (req, res) => {
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
        var spending = await Spending.create({ amount, category, description, date });

        res.status(201).json({
            message: 'Spending Created',
            data: spending
        })
    } catch (error) {
        res.status(500).json({ 
            message: 'Internal Server Error',
            data: error.message
        });
    }
}

// GET a spending
const getSingleSpending = async (req, res) => {
    var { id } = req.params;

    // check valid id
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({
            message: "Spending Not Found",
            data: {}
        })
    }

    // select parameter
    var { select } = req.query;
    select = select ? JSON.parse(select) : {};

    try {
        var spending = await Spending.findById(id).select(select);

        if (spending) {
            res.status(200).json({
                message: 'Spending Found',
                data: spending
            })
        } else {
            res.status(404).json({ 
                message: 'Spending Not found',
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

// PUT a spending
const updateSpending = async (req, res) => {
    // check valid id
    var { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({
            message: "Spending Not Found",
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
        var spending = await Spending.findByIdAndUpdate(id, { amount, category, description, date }, { new: true });

        if (spending) {
            res.status(200).json({
                message: 'Spending Updated',
                data: spending
            })
        } else {
            res.status(404).json({ 
                message: 'Spending Not found',
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

// DELETE a spending
const deleteSpending = async (req, res) => {
    // check valid id
    var { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({
            message: "Spending Not Found",
            data: {}
        })
    }

    try {
        var spending = await Spending.findByIdAndDelete(id);

        if (spending) {
            res.status(200).json({
                message: 'Spending Deleted',
                data: spending
            })
        } else {
            res.status(404).json({ 
                message: 'Spending Not found',
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
    getAllSpendings,
    createSpending,
    getSingleSpending,
    updateSpending,
    deleteSpending
}
require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const spendingRoutes = require('./routes/spendings');
const userRoutes = require('./routes/user');
const incomeRoutes = require('./routes/incomes');
const budgetRoutes = require('./routes/budgets');

// express app
const app = express();

var port = process.env.PORT || 4000;

// connect to mongodb & listen for requests
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        // app listen for requests on port 4000
        app.listen(port, () => {
            console.log('connected to db & listening on port', port);
        })
    })
    .catch((err) => {
        console.log(err);
    });

// middleware & static files
app.use(express.json());
app.use(morgan('dev'));

// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// routes
app.use('/api/spendings', spendingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/incomes', incomeRoutes);
app.use('/api/budgets', budgetRoutes);
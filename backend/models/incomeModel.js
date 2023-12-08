const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const incomeSchema = new Schema({
    amount: {
        type: Number,
        required: true
    },
    category: {
        type: String, 
        required: true
    },
    description: {
        type: String
    },
    date: {
        type: Date,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
}); 

module.exports = mongoose.model('Income', incomeSchema);
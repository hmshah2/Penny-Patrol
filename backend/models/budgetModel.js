const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const budgetSchema = new Schema({
    amount: {
        type: Number,
        required: true
    },
    month: {
        type: String, 
        required: true
    },
    week: {
        type: String, 
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

module.exports = mongoose.model('Budget', budgetSchema);
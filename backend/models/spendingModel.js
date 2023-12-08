const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const spendingSchema = new Schema({
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
        required: true,
        default: Date.now
    },
    user_id: {
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    }
}); 

module.exports = mongoose.model('Spending', spendingSchema);
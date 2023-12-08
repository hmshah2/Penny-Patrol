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
    user_id: {
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    }
}); 

module.exports = mongoose.model('Budget', budgetSchema);
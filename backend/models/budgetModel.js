const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const budgetSchema = new Schema({
    amount: {
        type: Number,
        required: true
    },
    startDate: {
        type: Date, 
        required: true
    },
    endDate: {
        type: Date, 
        required: true
    },
    // user: {
    //     type: Schema.Types.ObjectId, 
    //     ref: 'User',
    //     required: true
    // },
    dateCreated: {
        type: Date,
        default: Date.now
    }
}); 

module.exports = mongoose.model('Budget', budgetSchema);
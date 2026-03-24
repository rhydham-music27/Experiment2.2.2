const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    accountNumber: {
        type: String,
        required: [true, 'Please add an account number'],
        unique: true,
    },
    balance: {
        type: Number,
        default: 0,
    },
    accountType: {
        type: String,
        enum: ['Savings', 'Checking'],
        default: 'Savings',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Account', AccountSchema);

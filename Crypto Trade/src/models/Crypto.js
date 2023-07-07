const mongoose = require('mongoose');

const cryptoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        minLength: [2, 'Name must be at least 2 characters'],
    },
    image: {
        type: String,
        required: [true, 'Image is required'],
        match: [/^https?:\/\//, 'Invalid URL'],
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
         min: [0, 'Price must be a positive number']
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        minLength: [10, 'Description must be at least 10 characters'],
    },
    payment: {
        type: String,
        enum: ['crypto-wallet', 'credit-card', 'debit-card', 'paypal']
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
    boughtBy: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User',
        }
    ],

});


const Crypto = mongoose.model('Crypto', cryptoSchema);

module.exports = Crypto;
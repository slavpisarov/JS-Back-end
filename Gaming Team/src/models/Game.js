const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        minLength: [4, 'Name must be at least 4 characters'],
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
    genre: {
        type: String,
        required: [true, 'Description is required'],
        minLength: [2, 'Genre must be at least 2 characters'],
    },
    platform: {
        type: String,
        enum: ["PC", "Nintendo", "PS4", "PS5", "XBOX"]
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


const Game = mongoose.model('Game', gameSchema);

module.exports = Game;
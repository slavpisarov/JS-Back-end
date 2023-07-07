const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        minLength: [ 2 , 'Title must be at least 2 characters'],
    },
    author: {
        type: String,
        required: [true, 'Author is required'],
        minLength: [ 5 , 'Author must be at least 5 characters'],
    },
    image: {
        type: String,
        required: [true, 'Image is required'],
        match: [ /^https?:\/\// , 'Invalid URL'],
    },
    review: {
        type: String,
        required: [true, 'Review is required'],
        minLength: [ 10 , 'Review must be at least 10 characters'],
    },    
    genre: {
        type: String,
        required: [true, 'Genre is required'],
        minLength: [ 3 , 'Genre must be at least 3 characters'],
    },
    stars: {
        type: Number,
        required: [true, 'Stars are required'],
        min: [1, 'Stars must be between 1 and 5'],
        max: [5, 'Stars must be between 1 and 5'],
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
    wishlist: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User',
        }
    ],
});


const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
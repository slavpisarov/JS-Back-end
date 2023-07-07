const mongoose = require('mongoose');

const animalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
         minLength: [2, 'Name must be at least 2 characters'],
    },
    years: {
        type: [Number, 'Number is requred'],
        required: [true, 'Years is required'],
        min: [1, 'Years must be at least 1'],
        max: [1, 'Years must be maximum 100'],

    },
    kind: {
        type: String,
        required: [true, 'Kind is required'],
        minLength: [3, 'Kind must be at least 3 characters'],
    },
    image: {
        type: String,
        required: [true, 'Image is required'],
        match: [/^https?:\/\//, 'Invalid URL'],
    },
    need: {
        type: String,
        required: [true, 'Need is required'],
        minLength: [3, 'Need must be at least 3 characters'],
        maxLength: [20, 'Need must be maximum 20 characters'],
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
        minLength: [3, 'Location must be at least 5 characters'],
        maxLength: [20, 'Location must be maximum 15 characters'],
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        minLength: [3, 'Description must be at least 5 characters'],
        maxLength: [20, 'Description must be maximum 50 characters'],
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
    donations: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User',
        }
    ],

});


const Animal = mongoose.model('Animal', animalSchema);

module.exports = Animal;
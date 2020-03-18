const Joi = require('joi');
const mongoose = require('mongoose');

const Person = mongoose.model('personModel', new mongoose.Schema({
    UserName: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 50
    },
    FirstName: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 50
    },
    LastName: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 50
    },
    Age: {
        type: Number,
        required: true,
        minLength: 1,
        maxLength: 50
    }
}));



exports.Person = Person;
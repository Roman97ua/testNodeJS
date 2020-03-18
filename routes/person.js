const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const os = require('os');
const Joi = require('joi');
const filename = path.join(__dirname, '../data.csv');
const {Person, validate} = require('../models/persons.js');

const personArr = [];
read();

router.get('/', async (req, res) => {
    const person = await Person.find().sort("UserName");
    console.log(person);
    res.send(person)
});

router.post('/', async (req, res) => {
    const {error} = validatedPerson(req.body);
    if (error) return res.status(400).send(result.error.details[0].message);

    let person = new Person({
        UserName: req.body.UserName,
        FirstName: req.body.FirstName,
        LastName: req.body.LastName,
        Age: req.body.Age
    });

    person = await person.save();
    res.send(person);
    await write();
});

router.put('/:id', async (req, res) => {
    const {error} = validatedPerson(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const person = await Person.findByIdAndUpdate(req.params.id, {
        UserName: req.body.UserName,
        FirstName: req.body.FirstName,
        LastName: req.body.LastName,
        Age: req.body.Age
    }, {new: true});

    if (!person) return res.status(404).send('Not found id person');

    res.send(person);
    await write();
});

router.delete('/:id', async (req, res) => {
    const person = await Person.findByIdAndRemove(req.params.id);
    if (!person) return res.status(404).send('Not found id person');

    res.send(person);
    await write();
});


function read() {
    fs.createReadStream(filename)
        .pipe(csv())
        .on('data', (row) => {
            personArr.push(row);
        })
        .on('end', () => {
            console.log('CSV file successfully processed');
            createPersonDB();
        });
}

async function write() {
    let output = [];
    const person = await Person.find().sort("UserName");

    person.forEach((i) => {
        const row = [];
        row.push(i.UserName);
        row.push(i.FirstName);
        row.push(i.LastName);
        row.push(i.Age);

        output.push(row.join());
    });
    output.unshift("UserName,FirstName,LastName,Age");

    fs.writeFileSync(filename, output.join(os.EOL));
}

function validatedPerson(person) {
    const schema = {
        UserName: Joi.string().min(1).max(50).required(),
        FirstName: Joi.string().min(1).max(50).required(),
        LastName: Joi.string().min(1).max(50).required(),
        Age: Joi.number().min(1).max(50).required()
    };

    return Joi.validate(person, schema);
}

async function createPersonDB() {
    for (const i of personArr) {
        const person = new Person({
            UserName: i.UserName,
            FirstName: i.FirstName,
            LastName: i.LastName,
            Age: i.Age
        });
        await person.save();
    }
}

module.exports = router;
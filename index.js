const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/PersonDB')
    .then(console.log("Connected to MongoDB..."))
    .catch(err => console.error("Could not connected to MongoDB ", err));

const person = require('./routes/person.js');

app.use(express.json());
app.use('/api/person', person);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
const express = require('express');
const mongoose = require('mongoose');
//load routes
const auth = require('./routes/auth');

const app =  express();

const port =  process.env.PORT || 8080;

// load routes
app.use('/auth', auth);

app.get('/', (req, res) => {
    res.send('it works')
})

app.listen(port, () => {
    console.log(`server is listening on port ${port}`)
})
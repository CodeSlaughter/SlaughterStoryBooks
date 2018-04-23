const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

// Load User model
require('./models/User')

//passport config
require('./config/passport')(passport);

//load routes
const auth = require('./routes/auth');

//loud keys
const keys = require('./config/keys')

//mongoose connect
mongoose.connect(keys.mongoURI)
    .then(() => {
        console.log('MongoDB connected')
    })
    .catch((err) => {
        console.log(err)
    })

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
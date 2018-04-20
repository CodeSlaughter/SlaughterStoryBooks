const express = require('express');
const mongoose = require('mongoose');

const app =  express();

const port =  process.env.PORT || 8080;

app.get('/', (req, res) => {
    res.send('it works')
})

app.listen(port, () => {
    console.log(`server is listening on port ${port}`)
})
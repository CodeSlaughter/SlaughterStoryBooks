const express = require('express');
const router = express.Router();
const {ensureAuthenticated, ensureGuest} = require('../helpers/auth');

//stories index
router.get('/', (req, res) => {
    res.render('stories/index')
})

//add stories form
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('stories/add')
})

//edit stories
router.get('/edit', ensureAuthenticated, (req, res) => {
    res.render('stories/edit')
})


module.exports = router;

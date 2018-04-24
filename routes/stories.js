const express = require('express');
const router = express.Router();

//stories index
router.get('/', (req, res) => {
    res.render('stories/index')
})

//add stories form
router.get('/add', (req, res) => {
    res.render('stories/add')
})

//edit stories
router.get('/edit', (req, res) => {
    res.render('stories/edit')
})


module.exports = router;

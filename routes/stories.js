const express = require('express');
const router = express.Router();
const {ensureAuthenticated, ensureGuest} = require('../helpers/auth');
const mongoose = require('mongoose');
const Story  = mongoose.model('stories');

//stories index
router.get('/', (req, res) => {
    Story.find({
        status: 'public'
    })
    .populate('user')
    .then((stories) => {
        res.render('stories/index', {
            stories: stories
        });
    })
    .catch(err => console.log(err))
});

//add stories form
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('stories/add')
});

//edit stories
router.get('/edit', ensureAuthenticated, (req, res) => {
    res.render('stories/edit')
});

//process add stories
router.post('/', ensureAuthenticated, (req, res) => {
    let allowComments;
    if(req.body.allowComments){
        allowComments = true;
    } else {
        allowComments = false;
    }
    const newStory = {
        title: req.body.title,
        body: req.body.body,
        status: req.body.status,
        allowComments: allowComments,
        user: req.user.id
    }
    //create story
    new Story(newStory)
        .save()
        .then((story) => {
            res.redirect(`/stories/show/${story.id}`)
        })
        .catch(err => console.log(err));
});

module.exports = router;

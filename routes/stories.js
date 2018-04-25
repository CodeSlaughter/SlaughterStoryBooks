const express = require('express');
const router = express.Router();
const { ensureAuthenticated, ensureGuest } = require('../helpers/auth');
const mongoose = require('mongoose');
const Story = mongoose.model('stories');

//stories index
router.get('/', (req, res) => {
    Story.find({
        status: 'public'
    })
        .populate('user')
        .sort({
            date: 'desc'
        })
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
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Story.findOne({
        _id: req.params.id
    })
        .then((story) => {
            if (story.user !== req.user.id) {
                res.redirect('/')
            } else {
                res.render('stories/edit', {
                    story: story
                })
            }
        })
        .catch(err => console.log(err))
});

//list stories from a user
router.get('/user/:userId', (req, res) => {
    Story.find({
        user: req.params.userId, status: 'public'
    })
        .populate('user')
        .sort({
            date: 'desc'
        })
        .then((stories) => {
            res.render('stories/index', {
                stories: stories
            })
        })
        .catch(err => console.log(err))
})

//Logged in user story stories
router.get('/my', ensureAuthenticated, (req, res) => {
    Story.find({
        user: req.params.userId
    })
        .populate('user')
        .sort({
            date: 'desc'
        })
        .then((stories) => {
            res.render('stories/index', {
                stories: stories
            })
        })
        .catch(err => console.log(err))
})

//process add stories
router.post('/', ensureAuthenticated, (req, res) => {
    let allowComments;
    if (req.body.allowComments) {
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

//show single stories
router.get('/show/:id', (req, res) => {
    Story.findOne({
        _id: req.params.id
    })
        .populate('user')
        .populate('comments.commentUser')
        .then((story) => {
            if (story.status === 'public') {
                res.render('stories/show', {
                    story: story
                })
            } else {
                if (req.user) {
                    if (req.user.id === story.user.id) {
                        res.render('stories/show', {
                            story: story
                        });
                    } else {
                        res.redirect('/stories');
                    }
                } else {
                    res.redirect('/stories');
                }
            }

        })
        .catch(err => console.log(err))
});

//Edit form process
router.put('/:id', (req, res) => {
    Story.findOne({
        _id: req.params.id
    })
        .then((story) => {
            let allowComments;
            if (req.body.allowComments) {
                allowComments = true;
            } else {
                allowComments = false;
            }
            story.title = req.body.title;
            story.body = req.body.body;
            story.status = req.body.status;
            story.allowComments = allowComments;
            story.save()
                .then((story) => {
                    res.redirect('/dashboard')
                })
                .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
});

//Delete form process
router.delete('/:id', (req, res) => {
    Story.remove({
        _id: req.params.id
    })
        .then(() => {
            res.redirect('/dashboard')
        });
});

router.post('/comment/:id', (req, res) => {
    Story.findOne({
        _id: req.params.id
    })
        .then(story => {
            const newComment = {
                commentBody: req.body.commentBody,
                commentUser: req.user.id
            }
            //add to comments array
            story.comments.unshift(newComment);

            story.save()
                .then(story => {
                    res.redirect(`/stories/show/${story.id}`);
                })
                .catch(err => console.log(err))
        })
        .catch(err => console.log(err));
});

module.exports = router;

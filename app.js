const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const exhbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');

// Load User model
require('./models/User')
require('./models/Story')

//passport config
require('./config/passport')(passport);

//load routes
const auth = require('./routes/auth');
const index = require('./routes/index');
const stories = require('./routes/stories')

//loud keys
const keys = require('./config/keys')

// handlebars helpers
const {
    truncate,
    stripTags
} = require('./helpers/hbs');

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

app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Set global vars
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

//handlebars middleware
app.engine('handlebars', exhbs({
    helpers: {
        truncate: truncate,
        stripTags: stripTags
    },
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Set static folder
app.use(express.static(path.join(__dirname, 'public')))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Use routes
app.use('/auth', auth);
app.use('/stories', stories);
app.use('/', index);

app.listen(port, () => {
    console.log(`server is listening on port ${port}`)
})
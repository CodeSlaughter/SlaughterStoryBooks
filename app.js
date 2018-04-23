const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const exhbs = require('express-handlebars');

// Load User model
require('./models/User')

//passport config
require('./config/passport')(passport);

//load routes
const auth = require('./routes/auth');
const index = require('./routes/index')

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

app.engine('handlebars', exhbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Use routes
app.use('/auth', auth);
app.use('/', index);

app.listen(port, () => {
    console.log(`server is listening on port ${port}`)
})
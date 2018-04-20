const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');


module.exports = function(passport){
    passport.use(
        new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID || require('./keys').googleClientID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || require('./keys').googleClientSecret,
            callbackURL: process.env.GOOGLE_CALLBACK || '/auth/google/callback',
            proxy: true
        }, (accessToken, refreshToken, profile, done) => {
            console.log(accessToken);
            console.log(profile)
        })
    )
}


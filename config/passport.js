const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('./keys');

module.exports = function(passport){
    passport.use(
        new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID || keys.googleClientID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || keys.googleClientSecret,
            callbackURL: '/auth/google/callback',
            proxy: true
        }, (accessToken, refreshToken, profile, done) => {
            console.log(accessToken);
            console.log(profile)
        })
    )
}


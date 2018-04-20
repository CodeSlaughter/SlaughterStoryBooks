const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('./keys');

module.exports = function(passport){
    passport.use(
        new GoogleStrategy({
            clientID: process.env.GOOGLECLIENTID || keys.googleClienID,
            clientSecret: process.env.GOOGLECLIENTSECRET || keys.googleClientSecret,
            callbackURL: '/auth/google/callback',
            proxy: true
        }, (accessToken, refreshToken, profile, done) => {
            console.log(accessToken);
            console.log(profile)
        })
    )
}


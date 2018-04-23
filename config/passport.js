const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
//Load user model
const User = mongoose.model('users');


module.exports = function(passport){
    passport.use(
        new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID || require('./keys').googleClientID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || require('./keys').googleClientSecret,
            callbackURL: process.env.GOOGLE_CALLBACK || '/auth/google/callback',
            proxy: true
        }, (accessToken, refreshToken, profile, done) => {
            const image = profile.photos[0].value.substring(0, profile.photos[0].value.indexOf('?'));
            const newUser = {
                googleID: profile.id,
                firstName: profile.name.givenName,
                lastName: profile.name.lastName,
                email: profile.emails[0].value,
                image: image
            }

            //check for existing user
            User.findOne({
                googleID: profile.id
            })
            .then((user) => {
                if (user) {
                    //return user
                    done(null, user)
                } else {
                    //create user
                    new User(newUser)
                    .save()
                    .then((user) => {
                        done(null, user)
                    })
                    .catch(err => console.log(err));
                }
            })
            .catch(err => console.log(err))
        })
    )
}


const FacebookStrategy = require('passport-facebook').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy
const {OAuth2Client} = require('google-auth-library').AuthClient
const passport = require('passport')
const User = require('../models/User_model');

///////////login with facebook//////////
const facebookLogin = passport.use(new FacebookStrategy({
    clientID: '676458517361354',
    clientSecret: 'f162c05c48e4df168281689b5c349b0c',
    callbackURL: 'http://localhost:8080/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'photos', 'gender', 'email', 'name']
}, function (accessToken, refreshToken, profile, done) {
    console.log(profile._json);
    console.log(profile.photos[0].value);
    //console.log(profile.photos[0].value);
    return done(null, profile);
}
));

/////////////login with google ///////////

const googleLogin = passport.use(new GoogleStrategy({
    clientID: "938396630153-tgu5ukjk7glt9mvt5dukm0ghhqiti8r0.apps.googleusercontent.com",
    clientSecret: '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',
    callbackURL: "http://localhost:8080/auth/google/callback",
    profileFields: ['id', 'displayName', 'email']
},
    async (accessToken, refreshToken, profile, done, req, res) => {
        console.log(profile.photos[0].value);
        console.log(profile.emails[0].value)
        console.log(profile.id);
      
        try {
            let foundUser = await User.findOne({ googleId: profile.id });
            if (!foundUser) {
                let newUser = await User({
                    googleId: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    // avatar: profile.picture,
                    // emailVerified: profile.email_verified,
                    authType: "google",
                });
                let createdUser = await newUser.save();

                if (!createdUser) {
                    let err = new Error("Something went Wrong");
                    return done(err, false);
                }
                //  Creating our backend logic acces token not using googles access token
              
                return done(null, createdUser, accessToken);
            }
            //  Creating our backend logic acces token not using googles access token
            // let accessToken = accessTokenGenerator(foundUser);
            if (foundUser.status === "Suspended") {
                let err = new UnAuthorized("You are suspended Contact Admin");
                return next(err);
            }
            return done(null, foundUser);
        } catch (err) {
            return done(err, false);
        }

    }
));


module.exports = {
    facebookLogin, 
    googleLogin
}
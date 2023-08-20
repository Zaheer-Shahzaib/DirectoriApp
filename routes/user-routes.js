const express = require('express');
const { signup, login, verifyToken, getUser, loginWithGoogle } = require('../controllers/user-controlers');
const router = express.Router();
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require('../models/User_model');


router.post('/signup', signup)
router.post('/login', login)
router.get('/user', verifyToken, getUser)

////////////login google//////////////


passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:8080/auth/google/callback"
},
 function  (request, accessToken, refreshToken, profile, done,req, res) {
  console.log(profile.displayName)

    //     User.save({ name: profile.displayName, googleId: profile.id }, 
    // function (err, user) {
    //     return cb(err, user);
    // });
// console.log(profile.email);
//   let exitingUser;
//   try {
//       exitingUser = await User.findOne({ email: profile.emails })
//   } catch (error) {
//       console.log(error);
//   }
//   if (exitingUser) {
//       return ({ message: "User Alread Exist with this mail" })
//   }
//   const user = new User({
//     name:profile.displayName,
//     googleId:profile.id,
//     email:profile.email,
//     authType:'google'
//   })
//   try {
//       await user.save();
//   }
//   catch (err) {
//       console.log(err);
//   }

//   return (user)
  // console.log(profile.displayName);
  //   User.findOne({email:profile.email}).then((data)=>{
  //     if(data){
  //       res.status(200).send({message:'User Already exist'})
  //       return done(null, data)
  //     }
  //     else{
  //       const user = new User({
          
  //     })
  //     user.save()
  //     }
  //   })
  }
));

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});
passport.deserializeUser((id, cb) => {
  User.findById(id).then((user) => {
    cb(null, user);
  }).catch(err => { return cb(err) })
});



///////////

module.exports = router
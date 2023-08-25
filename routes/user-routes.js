const express = require('express');
const { signup, login, verifyToken, getUser, loginWithGoogle } = require('../controllers/user-controlers');
const router = express.Router();
const passport = require('passport')

const User=require('../models/User_model')
const config = require('../utils/config')
const jwt=require('jsonwebtoken')
const dotenv = require('dotenv');
const { facebookLogin, googleLogin } = require('../utils/auth');
dotenv.config();
router.post('/signup', signup)
router.post('/login', login)
router.get('/user', verifyToken, getUser)






/////////////////Facebook login////////////

router.get('/auth/facebook',  passport.authenticate('facebook',{
  session:false,
  scope: ['public_profile', 'email']
},facebookLogin));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/profile',
    failureRedirect: '/failed',
    session:true
  }));


////////////login google//////////////



router.get('/auth/google', passport.authenticate('google', {
  session:false,
  scope: ['profile', 'email']
}, googleLogin));

router.get('/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/profile',
    failureRedirect: '/failed',
    session:true
  }));


passport.serializeUser((user, cb) => {
  cb(null, user._id);
});
passport.deserializeUser((id, cb) => {
  User.findById(id).then((user)=>{
    cb(null, user);
  }).catch(err=>{ return cb(err)})
});



///////////

module.exports = router
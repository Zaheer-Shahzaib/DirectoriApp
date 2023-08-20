const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const app = express()
app.use(cookieParser())
const session = require('express-session')
const dotenv = require('dotenv')
dotenv.config();
const router = require('./routes/user-routes')

const passport = require('passport')
const Port = process.env.PORT || 8080
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//const {MONGODB_URI}=require('./utils/config')

//session for login 
 // trust first proxy
app.use(session({
    secret:"MyKey",
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true }
}))
app.use(passport.initialize());
app.use(passport.session())

app.use('/api/v1', router)
app.get('/',  (req,res)=>{
 res.send({message:"wellcome to the home"})
  
})
app.get('/auth/google',passport.authenticate('google',{
    scope:['/auth/userinfo.profile']
}));
app.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/',
  }),
  function (req, res){
    res.redirect('/')
  });

mongoose.connect(process.env.MONGODB_URI).then(() => {
    app.listen(Port, (req, res) => {
        console.log(`Database is connected! Listening to localhost ${Port}`);
    })
}).catch((err) => {
    console.log(err);
})



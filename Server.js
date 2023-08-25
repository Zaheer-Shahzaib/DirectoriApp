const express = require('express')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const app = express()

const bodyparser=require('body-parser')
const session = require('express-session')
const dotenv = require('dotenv')
dotenv.config();
const router = require('./routes/user-routes')

const passport = require('passport')
const Port = process.env.PORT || 8080
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(bodyparser.urlencoded({extended:true}))
//const {MONGODB_URI}=require('./utils/config')
app.use(cookieParser())
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

app.use(router)
app.get('/',  (req,res)=>{
 res.send({message:"wellcome to the home"})
  
})

////////fb
app.get('/facebook',passport.authenticate('facebook',{
  scope:['public_Profile','emails']
}))

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/'
  }));

///////////////////ggggoooggle/
;

  app.get('/profile', (req, res) => {
    res.send('valid user')
})

app.get('/failed', (req, res) => {
    res.send('failed')
})
mongoose.connect(process.env.MONGODB_URI).then(() => {
    app.listen(Port, (req, res) => {
        console.log(`Database is connected! Listening to localhost ${Port}`);
    })
}).catch((err) => {
    console.log(err);
})



const User = require('../models/User_model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')




const signup = async (req, res, next) => {
    //destructing 
    const { name, email, password } = req.body
    //validation for exiting user  
    let exitingUser;
    try {
        exitingUser = await User.findOne({ email: email })
    } catch (error) {
        console.log(error);
    }
    if (exitingUser) {
        return res.status(400).json({ message: "User Alread Exist with this mail" })
    }
   
    const hashPassword = bcrypt.hashSync(password)
    const user = new User({
        name,
        email,
        password: hashPassword,
        authType: "Local"
    })
    try {
        await user.save();
    }
    catch (err) {
        console.log(err);
    }
    return res.status(201).json({ message: user })
}



const login = async (req, res, next) => {
    const { email, password } = req.body;
    let exitingUser;
    try {
        exitingUser = await User.findOne({ email: email })
    } catch (error) {
        return new Error(error)
    }
    if (!exitingUser) {
        return res.status(401).json({ message: 'User will not found! Please Signup' })
    }
    const isPasswordCorrect = bcrypt.compareSync(password, exitingUser.password)

    if (!isPasswordCorrect) {
        return res.status(401).json({ message: 'Invalid Email / Password' })
    }

    const token = jwt.sign({ id: exitingUser._id }, process.env.JWT_SCERET_KEY, {
        expiresIn: "60sec",
    })
    res.cookie(String(exitingUser._id), token, {
        path: '/',
        expires: new Date(Date.now() + 1000 * 30),
        httpOnly: true,
        sameSite: 'lax'
    })

    return res.status(200).json({ message: 'Successfully Logged In', user: exitingUser, token })
}
const verifyToken = (req, res, next) => {
    // const headers = req.headers['authorization']
    const cookies = req.headers.cookie
    const token = cookies.split('=')[1];
    if (!token) {
        res.status(404).json({ message: 'No token found' })
    }
    jwt.verify(String(token), process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(400).json({ message: 'Invalid Token' })
        }
        console.log(user.id);
        req.id = user.id
    })
    next();
}

const getUser = async (req, res, next) => {
    const userId = req.id
    let user;
    try {
        user = await User.findById(userId, '-password',)
    } catch (error) {
        return new Error(err)
    }
    if (!user) {
        return res.status(404).json({ message: "User not Found" })
    }
    return res.status(200).json({ user })
}


///
   
    

exports.signup = signup
exports.login = login
exports.verifyToken = verifyToken
exports.getUser = getUser
// exports.loginWithGoogle=loginWithGoogle
const express = require('express')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user')
const dotenv = require('dotenv')
const passport = require('passport');

dotenv.config()


const JWT_SECRET = process.env.JWT_SECRET;

const router = express.Router()


// ****************  CREATE NEW USER **********************************************
router.post('/register', async (req, res) => {

    try {

        let user = await User.findOne({ email: req.body.email})
        // return error if user already exists with the same email
        if (user) {
            return res.status(400).json({ error: "Sorry a user with this email already exists" })
        }

        // else create new user

        // since we can't store passwords directly in the database, we need to create hash and then store it.
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        user = await User.create({
            ...req.body,
            password: hashedPassword
        });

        
        // generate auth token and send it to user for further authentication purposes
        const data = {
            user: {
                id : user._id
            }
        }

        const authToken = jwt.sign(data, JWT_SECRET);
        res.json({authToken, user});
        

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})



// ************* LOGIN EXISTING USER ***************************************************
router.post('/login', async (req, res) => {

    try {

        const {email, password} = req.body;

        let user = await User.findOne({ email})
        // return error if user doesn't exist
        if (!user) {
            return res.status(400).json({ error: "User doesn't exist" })
        }

        // check if password entered is correct or not.
        const isPasswordSame = await bcrypt.compare(password, user.password);

        if(!isPasswordSame) {
            return res.status(400).json({error: "Please try to login with correct credentials" });
        }

        // generate auth token if password matches.
        const data = {
            user: {
                id : user._id
            }
        }

        const authToken = jwt.sign(data, JWT_SECRET);
        res.json({authToken, user});


    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})


// ************** FETCH USER DETAILS *************************************
router.get('/getuser', passport.authenticate('jwt', {session: false}), async (req, res) => {    
    try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password")
    res.json({user})

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})


module.exports = router
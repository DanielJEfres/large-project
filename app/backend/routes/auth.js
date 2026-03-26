    /* USER DB SCHEMA REFERENCE
    { 
        firstName:  ,
        lastName: ,
        ucfEmail: ,
        passwordHash: ,
        role: ,
        interests: ,
        bio: ,
        profilePicture: ,
        isVerified: ,
        verificationToken: ,
        resetPasswordToken: ,
        resetPasswordExpires: ,
        isActive: ,
        createdAt: ,
    }
    */

import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import userModel from '../models/users.js'

dotenv.config();
const router = express.Router();
const db = mongoose.connection;


router.get('/', (req, res) => {
    res.status(200).json({
    message: 'SIGNUP API is online',
  })
})

//Sign up endpoint
router.post('/signup', async (req, res) => {
    //First, get the ucf email
    const ucfEmail = req.body["ucfEmail"];

    //Then check if the user already exists
    const existingUser = await userModel.findOne({ucfEmail});
    if (existingUser){
        return res.status(400).json({message: "User already exists with this email"});
    }
    
    //Get user signup information from the request body
    const {firstName, lastName, interests, bio, profilePicture} = req.body;
    
    //Create the user entry in the database
    const newUser = await userModel.create({
        firstName,
        lastName,
        ucfEmail,
        passwordHash:"hello",
        interests,
        bio,
        //verification token: generateToken()
    });

    //Save the newly created user
    await newUser.save();

    //success messages
    console.log(`Successfully created new user with the following info: ${JSON.stringify(req.body, null, 2)}`);

    res.status(201).json({
        message:`User registered successfully, ucfEmail = ${ucfEmail}`,
        userId: newUser._id
    });

});

export default router;
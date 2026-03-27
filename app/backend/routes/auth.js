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
import userModel from '../models/User.js'
import bcrypt from 'bcrypt'

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
    try
    {
        //First, get the ucf email
            const ucfEmail = req.body["ucfEmail"];

            //Then check if the user already exists
            const existingUser = await userModel.findOne({ucfEmail});
            if (existingUser){
                return res.status(400).json({message: "User already exists with this email"});
            }
            
            //Get user signup information from the request body
            const {firstName, lastName, password, interests, bio, profilePicture} = req.body;
            
            const tagIDs = [];

            if (interests && interests.length > 0)
            {
                for (const tagName of interests)
                {

                    const normalizedTagName = tagName.toLowerCase().trim();
                    //attempts to insert a new row into a table and, if a row with a matching unique key it updates the existing row
                    const tag = await Tag.findOneAndUpdate(
                        {name: normalizedTagName},
                        {
                            $setOnInsert:{
                                name: normalizedTagName,
                                isCustom: true,
                                isApproved: false,

                            }
                        },
                        {upsert: true, new: true}
                    );
                    tagIDs.push(tag._id);
                }

                
            }

            //Password hashing
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds)

            //Create the user entry in the database, then saves it to the database
            const newUser = await userModel.create({
                firstName,
                lastName,
                ucfEmail,
                passwordHash: hashedPassword,
                interests: tagIDs,
                bio,
                //verification token: generateToken()
            });


            //success messages
            console.log(`Successfully created new user with the following info: ${JSON.stringify(req.body, null, 2)}`);

            res.status(201).json({
                message:`User registered successfully, ucfEmail = ${ucfEmail}`,
                userId: newUser._id
            });
    }
    
    catch (error)
    {
        console.error("Signup Error:", error);
        res.status(500).json({ message: "Server error during signup", error: error.message });
    }
    

});

export default router;
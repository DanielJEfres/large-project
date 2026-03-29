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
import User from '../models/User.js';
import Tag from '../models/Tag.js';   
import jwt from 'jsonwebtoken';


dotenv.config();
const router = express.Router();
const db = mongoose.connection;


router.get('/', (req, res) => {
    res.status(200).json({
    message: 'SIGNUP & LOGIN API: ONLINE',
  })
})

//Sign up endpoint
router.post('/signup', async (req, res) => {
    try
    {
        //First, get the ucf email
            const ucfEmail = req.body["ucfEmail"];

            //Then check if the user already exists
            const existingUser = await User.findOne({ucfEmail});
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


            //Create the user entry in the database, then saves it to the database
            const newUser = await User.create({
                firstName,
                lastName,
                ucfEmail,
                passwordHash: password,
                interests: tagIDs,
                bio,
                //verification token: generateToken()
            });

    //Save the newly created user
    // await newUser.save(); <- redundant, create implicitly calls save()

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

// NOT SECURE METHOD OF STORING refreshTokens. FOR TESTING ONLY!
let refreshTokens = [] // use DB in future

function generateAccessToken(payload) {
    // serialize our payload (user id) using access token in ENV.
    // AccessToken expires in 15 seconds for testing, requires Refresh
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15s" })
}

router.post("/login", async (req, res) => {
    const { ucfEmail, password } = req.body;
    try {
        // Check validity
        if (!ucfEmail || !password){ // missing fields
            return res
                .status(400)
                .json({message: "Not all fields are filled."})
        }
        // Retrieve first user matching email
        const user = await User.findOne({ucfEmail});

        if (!user){ // user not found
            return res.status(400).json({message: "User does not exist with that email."})

        } else { // email exists in DB
            // match password
            if (await user.matchPassword(password)){
                // user has been validated! JWT below
                const payload = { sub: user._id.toString() } // sub is standard "subject" claim for identity (user._id)
                
                // generate AccessToken which serializes our payload (user id as subject)
                const accessToken = generateAccessToken(payload)
                const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET)
                
                //REMOVE IN FUTURE:
                refreshTokens.push(refreshToken)

                res.status(200).json({
                    message: `User with email ${ucfEmail} successfully logged in.`,
                    userId: user._id,
                    accessToken: accessToken,
                    refreshToken: refreshToken
                })


            } else { // password did not match
                return res.status(401).json({message: "Invalid user credentials.",})
            }
        }
    } catch (err){
        res.status(500).json({message:"Server error."})
    }
})

router.delete("/logout", (req, res) => {
    // UNSAFE, MUST DELETE FROM DB! TEMP FOR TESTING ONLY.
    refreshTokens = refreshTokens.filter(token => token != req.body.token)
    
    res.sendStatus(204)
})

router.post("/token", (req, res) => {
    const refreshToken = req.body.token
    if (refreshToken == null) return res.sendStatus(401)

    // REMOVE IN FUTURE:
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
    
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
        if (err) return res.sendStatus(403)
        
        // payload now contains irrelevant data, extract only sub
        const newPayload = ({ sub: payload.sub }) 

        // new AccessToken using newPayload
        const accessToken = generateAccessToken(newPayload)

        res.json({ accessToken: accessToken })
    })
})

export default router;
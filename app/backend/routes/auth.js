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
import RefreshTokens from '../models/RefreshTokens.js'
import Tag from '../models/Tag.js';   
import jwt from 'jsonwebtoken';
import crypto from 'crypto'

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
    //Get user signup information from the request body
    const {ucfEmail, firstName, lastName, password, interests, bio, profilePicture} = req.body;

    try
    {
        if (!ucfEmail){ // missing email
            return res.status(400).json({message: "Email field is missing."})
        }
        
        if (!firstName || !lastName || !password) {
            return res.status(400).json({ message: "firstName, lastName, and password are required." });
        }

        //Then check if the user already exists
        const existingUser = await User.findOne({ucfEmail});
        if (existingUser){
            return res.status(400).json({message: "User already exists with this email"});
        }
        
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

function generateAccessToken(payload) {
    // serialize our payload (user id) using access token in ENV.
    // AccessToken expires in 15 minutes, requires Refresh
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
        };
        // Retrieve first user matching email
        const user = await User.findOne({ ucfEmail });

        if (!user){ // user not found
            return res.status(400).json({message: "User does not exist with that email."});

        } else { // email exists in DB
            // match password
            if (await user.matchPassword(password)){
                // user has been validated! JWT below
                const user_id = user._id;

                // generate AccessToken which serializes our payload (user id as subject)
                const payload = { sub: user_id.toString() }; // sub is standard "subject" claim for identity (user._id)
                const accessToken = generateAccessToken(payload);
                
                // add identifier to refreshToken for lookup (refer to /logout)
                const id = crypto.randomUUID(); // 36 char string with negligible collision probability
                const refresh_payload = { // mutated payload now including tokenId
                    ...payload,
                    tokenId: id
                };
                const refreshToken = jwt.sign(refresh_payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" }); // refreshToken is hashed using schema middleware.
                
                // Extract expiry timestamp for aligned DB insert
                const decoded = jwt.decode(refreshToken);
                const expiry_date = new Date(decoded.exp * 1000); // JWT exp is in sec, Date expects ms
                
                // add token to DB
                await RefreshTokens.create({userId: user_id, tokenHash: refreshToken, tokenId: id, expiresAt: expiry_date}); // hashed using middleware

                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'Strict',
                    maxAge: 7 * 24 * 60 * 60 * 1000
                });

                res.status(200).json({
                    message: `User with email ${ucfEmail} successfully logged in.`,
                    // userId: user_id,
                    is_verified: user.isVerified,
                    accessToken: accessToken,
                    //refreshToken: refreshToken // send as HTTPOnly Cookie Soon
                });

            } else { // password did not match
                return res.status(401).json({message: "Invalid user credentials."});
            }
        }
    } catch (err){
        res.status(500).json({message:"Server error."});
    }
})

// Takes refreshToken and revokes it
router.delete("/logout", async (req, res) => {
    const token = req.cookies.refreshToken; // pull from cookies

    try {
        if (!token) {
            return res.status(401).json({ message: "Refresh token required." });
        }

        // Verify refresh token signature + expiration
        const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        const tokenId = payload.tokenId;

        if (!tokenId) {
            return res.status(403).json({ message: "Invalid refresh token payload." });
        } 
        
        // Find DB record by tokenId
        const tokenToDelete = await RefreshTokens.findOne({ tokenId });
        
        if (!tokenToDelete) {
            return res.status(403).json({ message: "Refresh token not found." });
        }
        
        // Confirm exact token matches stored hash
        const matches = await tokenToDelete.matchToken(token);
        if (!matches) {
            return res.status(403).json({ message: "Refresh token mismatch." });
        }
        
        // tokenToDelete.revoked = true; // Revocation logic (instead of delete)
        // await tokenToDelete.save();
        await RefreshTokens.deleteOne({ tokenId });
        return res.sendStatus(204);
    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired refresh token." });
    }
})

// Nuclear option. If logging in multiple times via postman,
// only the most recent session will be able to be logged out.
// This is the fix.
router.delete("/logout-all", async (req, res) => {
    const token = req.cookies.refreshToken;
    try {
        const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        await RefreshTokens.deleteMany({ userId: payload.sub });
        res.clearCookie('refreshToken');
        return res.sendStatus(204);
    } catch (err) {
        return res.status(403).json({ message: "Invalid or expired refresh token." });
    }
});

router.post("/token", async (req, res) => {
    const token = req.cookies.refreshToken; // pull from cookies

    try {
        // Token missing
        if (!token) {
            return res.status(401).json({ message: "Refresh token required." });
        }

        // Verify JWT (signature & expiration)
        const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

        const { sub, tokenId } = payload;

        if (!tokenId) {
            return res.status(403).json({ message: "Invalid token payload." });
        }

        // Find DB record
        const storedToken = await RefreshTokens.findOne({ tokenId });

        if (!storedToken) {
            return res.status(403).json({ message: "Refresh token not found." });
        }

        // Check revoked
        if (storedToken.revoked) {
            return res.status(403).json({ message: "Refresh token revoked." });
        }

        // Compare hash
        const matches = await storedToken.matchToken(token);

        if (!matches) {
            return res.status(403).json({ message: "Invalid refresh token." });
        }

        // Issue new access token
        const newPayload = { sub }; // only w/ subject (id)
        const accessToken = generateAccessToken(newPayload);

        res.json({ accessToken });

    } catch (err) {
        return res.status(403).json({ message: "Invalid or expired refresh token." });
    }
});

export default router;
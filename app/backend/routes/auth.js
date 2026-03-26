import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config();

mongoose.connect(process.env.MONGODB_URI);

const router = express.Router();
app.use(express.json());

//Sign up endpoint
app.post('/signup', (req, res) => {
    /*
    { 
        firstName: 
        lastName:
        ucfEmail:
        passwordHash:
        role:
        interests:
        bio:
        profilePicture:
        isVerified:
        verificationToken:
        resetPasswordToken:
        resetPasswordExpires:
        isActive:
        createdAt:
        updatedAt:
    }
    */
    const user_info = req.body;

    console.log(user_info['username']);

});


app.listen(8000, () => {console.log(`Example app listening on port ${8000}`)})

export default router
import express from 'express'
import nodemailer from 'nodemailer'
import User from '../models/User.js'
import crypto from 'node:crypto'
import dotenv from 'dotenv'


dotenv.config();
const router = express.Router();



const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});


router.post('/request-verification', async (req, res) => {
    const {ucfEmail} = req.body;

    try{
        const user = await User.findOne({email: ucfEmail});
        if(!user) return res.status(404).json({message: "Email verification: user with this email is not found"});

        //Generate verification token
        const token = crypto.randomBytes(32).toString('hex');

        //Save the token to the database
        user.verificationToken = token;
        await user.save();

        const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;

        await transporter.sendMail({
            from: `EventKnight <${process.env.FROM_EMAIL}>`,
            to: user.ucfEmail,
            subject: "Verify your email!",
            html: `<p>Click <a href="${verificationUrl}">here</a> to verify your account.</p>`
        });

        res.status(200).json({message: "Verification email sent"});
    }

    catch (error) {
        res.status(500).json({ message: "Error in request-verification", error });
    } 
});

//Verify the Token (Call this when user clicks the link)
router.get('/verify-email/:token', async (req, res) => {
  const { token } = req.params;

  try {
    // Find user with this token
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Update user status and clear the token
    user.isVerified = true; // Assuming you have this field
    user.verificationToken = undefined; // Remove the token so it can't be used again
    await user.save();

    res.status(200).json({ message: "Email verified successfully! You can now log in." });
  } catch (error) {
    res.status(500).json({ message: "Error verifying email", error });
  }
});

export default router;
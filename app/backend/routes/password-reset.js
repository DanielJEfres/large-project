import express from 'express'
import nodemailer from 'nodemailer'
import User from '../models/User.js'
import dotenv from 'dotenv'
import crypto from 'node:crypto'

const router = express.Router();
dotenv.config()

//Initialize transporter from nodemailer
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});

router.post("/request", async (req, res) =>{
    const {ucfEmail} = req.body;

    //DEBUG
    console.log(`Searching for: ${ucfEmail}`);
    console.log(`Sender email is: ${process.env.FROM_EMAIL}`);
    
    try
    {
        const user = await User.findOne({ucfEmail});

        //user with this email is not found
        if(!user) return res.status(404).json({message: "Password Reset: user with this email is not found"});
        
        //Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');

        //Save the token to the database
        user.resetPasswordToken = resetToken;

        //Reset password should expire after 5 minutes
        const resetPasswordExpires = new Date();
        resetPasswordExpires.setMinutes(resetPasswordExpires.getMinutes() + 5);
        user.resetPasswordExpires = resetPasswordExpires;

        //Save the new entries to the user
        await user.save();

        const recipient = user.ucfEmail;
        console.log(`Attempting to send mail to: ${recipient}`);

        const passwordResetURL = `${process.env.CLIENT_URL}/password-reset/${resetToken}`;
        
        const resetEmailTemplate = (url, name) => `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; }
                .button { 
                    display: inline-block; padding: 12px 24px; background-color: #d32f2f; color: #fff !important; 
                    text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0;
                }
                .footer { font-size: 11px; color: #999; text-align: center; margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px; }
                .warning { color: #d32f2f; font-weight: bold; }
            </style>
        </head>
        <body>
            <div class="container">
                <div style="text-align: center;"><h1>⚔️ EventKnight</h1></div>
                <h2>Password Reset Request</h2>
                <p>Hi ${name},</p>
                <p>We received a request to reset your password. Click the button below to choose a new one:</p>
                <div style="text-align: center;">
                    <a href="${url}" class="button">Reset My Password</a>
                </div>
                <p class="warning">Note: This link will expire in 5 minutes.</p>
                <p>Hi ${user.firstName}, you may reset your EventKnight password with the following link: ${passwordResetURL}</p>
                <p>If you did not request this, you can safely ignore this email.</p>
                <div class="footer">
                    <p>&copy; 2026 EventKnight Team | UCF</p>
                </div>
            </div>
        </body>
        </html>
        `;
        const htmlContent = resetEmailTemplate(passwordResetURL, user.firstName || 'Knight');


        await transporter.sendMail({
            from: `EventKnight <${process.env.FROM_EMAIL}>`,
            to: user.ucfEmail,
            replyTo: process.env.FROM_EMAIL,
            subject: "Reconnect with UCF: Reset your EventKnight Password",
            text: `Hi ${user.firstName}, you may reset your EventKnight password with the following link: ${passwordResetURL}`,
            html: htmlContent,
        });

        res.status(200).json({message: "Password reset email sent"})
    }

    catch (error)
    {
        res.status(500).json({message: "Error in password reset", error: error.message});
    }

});


router.get('/:token', async (req, res) => {
  const { token } = req.params;

  try 
  {
    // Find user with this token
    const user = await User.findOne({ resetPasswordToken: token }); //mongodb will handle checking expiration

    if (!user) {
      return res.status(400).json({ message: "Invalid token on this account" });
    }

    if (user.resetPasswordExpires < Date.now()){
        return res.status(400).json({message: "Expired Reset Password Token"});
    }

    res.status(200).json({ message: "Password reset: Token is Valid" });
  } 

  catch (error) 
  {
    res.status(500).json({ message: "Password reset: Error resetting password: ", error: error.message });
  }
});


router.patch('/update', async(req, res) => {
    const {token, newPassword} = req.body;
    try{
        const user = await User.findOne({
            resetPasswordToken: token
        });

        if (user.resetPasswordExpires < Date.now()){
        return res.status(400).json({message: "Expired Reset Password Token"});
        }


        if(!user){
            return res.status(404).json({message:"User does not have a valid Reset Password Token"});
        }

        user.passwordHash = newPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;

        await user.save();
        res.status(200).json({message:"Password successfully changed"});
    }
    catch (error){
        res.status(400).json({message:"Update password failed", error: error.message})
    }



});

export default router

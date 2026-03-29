import express from 'express'
import nodemailer from 'nodemailer'
import User from '../models/User.js'
import crypto from 'node:crypto'
import dotenv from 'dotenv'


const router = express.Router();
dotenv.config()


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
    console.log(`Searching for: ${ucfEmail}`);
    console.log(`Sender email is: ${process.env.FROM_EMAIL}`);
    

    try{
        const user = await User.findOne({ucfEmail});
        if(!user) return res.status(404).json({message: "Email verification: user with this email is not found"});

        //Generate verification token
        const token = crypto.randomBytes(32).toString('hex');

        //Save the token to the database
        user.verificationToken = token;
        await user.save();

        const recipient = user.email || user.ucfEmail;
        console.log(`Attempting to send mail to: ${recipient}`);

        const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${token}`;

        const emailTemplate = (verificationUrl, firstName) => `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verify Your EventKnight Account</title>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 8px; }
                .header { text-align: center; padding-bottom: 20px; border-bottom: 2px solid #ffca28; } /* UCF Gold-ish */
                .content { padding: 20px 0; text-align: center; }
                .button { 
                    display: inline-block; 
                    padding: 12px 24px; 
                    background-color: #000000; 
                    color: #ffffff !important; 
                    text-decoration: none; 
                    border-radius: 5px; 
                    font-weight: bold;
                    margin-top: 20px;
                }
                .footer { font-size: 12px; color: #888; text-align: center; margin-top: 30px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1 style="margin:0;">⚔️ EventKnight</h1>
                </div>
                <div class="content">
                    <h2>Verify your email address</h2>
                    <p>Hi ${firstName},</p>
                    <p>Thanks for joining EventKnight! We're excited to have you on board. To get started, please confirm your email address by clicking the button below.</p>
                    <a href="${verificationUrl}" class="button">Verify Email Account</a>
                    <p style="margin-top: 25px; font-size: 13px; color: #666;">
                        If the button doesn't work, copy and paste this link into your browser:<br>
                        <a href="${verificationUrl}">${verificationUrl}</a>
                    </p>
                </div>
                <div class="footer">
                    <p>This email was sent to you as part of your registration at EventKnight.</p>
                    <p>&copy; 2026 EventKnight Team | University of Central Florida</p>
                </div>
            </div>
        </body>
        </html>
        `;
        const htmlContent = emailTemplate(verificationUrl, user.firstName || 'Knight');

        await transporter.sendMail({
            from: `EventKnight <${process.env.FROM_EMAIL}>`,
            to: user.ucfEmail,
            replyTo: process.env.FROM_EMAIL,
            subject: "Explore the UCF Community: Email Verification",
            text: `Hi ${user.firstName}, please verify your EventKnight account by visiting this link: ${verificationUrl}`,
            html: htmlContent,
        });

        res.status(200).json({message: "Verification email sent"});
    }

    catch (error) {
        res.status(500).json({ message: "Error in request-verification", error });
    } 
});



//This is called when users click the verify email link, that is sent to their email
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
    
    await user.save();

    res.status(200).json({ message: "Email verified successfully! You can now log in." });
  } catch (error) {
    res.status(500).json({ message: "Error verifying email", error });
  }
});

export default router;
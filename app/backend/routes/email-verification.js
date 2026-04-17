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
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: true // Ensure the connection is verified
    }
});


router.post('/request', async (req, res) => {
    const {ucfEmail} = req.body;
    console.log(`Searching for: ${ucfEmail}`);
    console.log(`Sender email is: ${process.env.FROM_EMAIL}`);
    
    try
    {
        const user = await User.findOne({ucfEmail});
        if(!user) return res.status(404).json({message: "Email verification: user with this email is not found"});


        //Generate verification token
        const token = crypto.randomBytes(32).toString('hex');

        //Save the token to the database
        user.verificationToken = token;
        await user.save();

        const recipient = user.ucfEmail;
        console.log(`Attempting to send mail to: ${recipient}`);

        const verificationUrl = `${process.env.API_URL}/api/email-verification/${token}`;

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

        try{
            await transporter.sendMail(
            {
                from: `EventKnight <${process.env.FROM_EMAIL}>`,
                to: user.ucfEmail,
                replyTo: process.env.FROM_EMAIL,
                subject: "Explore the UCF Community: Email Verification",
                text: `Hi ${user.firstName}, please verify your EventKnight account by visiting this link: ${verificationUrl}`,
                html: htmlContent,
            });
        }
    
        catch (mailError) 
        {
            console.error("Mail failed:", mailError);
            return res.status(500).json({ message: "Failed to send email" });
        }

        res.status(200).json({message: "Verification email sent"});
    }

    catch (error) {
        res.status(500).json({ message: "Error in request-verification", error });
    } 
});



// Serves the confirmation page — safe for Outlook pre-fetching since it's a GET
router.get('/:token', (req, res) => {
  const { token } = req.params
  const postUrl = `${process.env.API_URL}/api/email-verification/${token}`
  const clientUrl = process.env.CLIENT_URL

  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify your EventKnight account</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', sans-serif; background: #f9f9f9; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
    .card { background: #fff; border: 1px solid #e1e1e1; border-radius: 12px; padding: 48px 40px; max-width: 420px; width: 100%; text-align: center; }
    h1 { font-size: 28px; font-weight: 700; margin-bottom: 12px; }
    p { color: #555; margin-bottom: 28px; line-height: 1.5; }
    button { width: 100%; padding: 14px; background: #000; color: #fff; border: none; border-radius: 8px; font-size: 15px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; cursor: pointer; }
    button:hover { background: #222; }
    button:disabled { opacity: 0.5; cursor: not-allowed; }
    .msg { margin-top: 16px; font-size: 14px; }
    .success { color: #16a34a; }
    .error { color: #dc2626; }
  </style>
</head>
<body>
  <div class="card">
    <h1>⚔️ EventKnight</h1>
    <p>Click the button below to confirm your email address and activate your account.</p>
    <button id="btn" onclick="verify()">Confirm Email</button>
    <p class="msg" id="msg"></p>
  </div>
  <script>
    async function verify() {
      const btn = document.getElementById('btn')
      const msg = document.getElementById('msg')
      btn.disabled = true
      btn.textContent = 'Verifying...'
      try {
        const res = await fetch('${postUrl}', { method: 'POST' })
        const data = await res.json()
        if (res.ok) {
          msg.className = 'msg success'
          msg.textContent = 'Email verified! Redirecting to login...'
          setTimeout(() => window.location.href = '${clientUrl}/login', 2000)
        } else {
          msg.className = 'msg error'
          msg.textContent = data.message || 'Verification failed. Please try again.'
          btn.disabled = false
          btn.textContent = 'Confirm Email'
        }
      } catch {
        msg.className = 'msg error'
        msg.textContent = 'Server error. Please try again later.'
        btn.disabled = false
        btn.textContent = 'Confirm Email'
      }
    }
  </script>
</body>
</html>`)
})

// Called when user clicks "Confirm Email" button on the verify-email frontend page
router.post('/:token', async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    return res.status(200).json({ message: "Email verified successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error verifying email", error });
  }
});

export default router;
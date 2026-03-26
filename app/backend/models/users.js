import mongoose from 'mongoose'
const { Schema, model } = mongoose;

const userSchema = new Schema({
        firstName: { type: String, required: true, trim: true },
        lastName: { type: String, required: true, trim: true },
        ucfEmail: { 
            type: String, 
            required: true, 
            unique: true, // Prevents duplicate accounts
            lowercase: true 
        },
        passwordHash: { type: String, required: true },
        role: { 
            type: String, 
            enum: ['student', 'admin', 'faculty'], // Limits input to these values
            default: 'student' 
        },
        interests: [String],
        bio: { type: String, maxlength: 500 },
        profilePicture: String,
        isVerified: { type: Boolean, default: false },
        verificationToken: String,
        resetPasswordToken: String,
        resetPasswordExpires: Date, // Better to use Date for time-based logic
        isActive: { type: Boolean, default: true },
    }, { 
        // This automatically handles createdAt and updatedAt for you!
        timestamps: true 
    });

const User = model('User', userSchema);

export default User; // {User, ...} for multiple models
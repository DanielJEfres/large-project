import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  firstName: { 
    type: String, 
    required: true, 
    trim: true 
  },
  lastName: { 
    type: String, 
    required: true, 
    trim: true 
  },
  ucfEmail: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@ucf\.edu$/, 'Must be a valid UCF email']
  },
  passwordHash: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['student', 'admin'], 
    default: 'student' 
  },
  interests: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Tag' 
  }],
  bio: { 
    type: String, 
    trim: true,
    default: null
  },
  profilePicture: { 
    type: String, 
    default: null 
  },
  isVerified: { 
    type: Boolean, 
    default: false 
  },
  verificationToken: { 
    type: String, 
    default: null 
  },
  resetPasswordToken: { 
    type: String, 
    default: null 
  },
  resetPasswordExpires: { 
    type: Date, 
    default: null 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, { timestamps: true })

userSchema.index({ verificationToken: 1 }) // quick lookup on if verified
userSchema.index({ resetPasswordToken: 1 }) // quick lookup for password reset

export default mongoose.model('User', userSchema)
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

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
  // interests: [{ // MORE COMPLEX-- Tags not yet implemented.
  //   type: mongoose.Schema.Types.ObjectId, 
  //   ref: 'Tag' 
  // }],
  interests: [String],
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
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })

// Before saving a user to DB, ensure to hash their plaintext password
userSchema.pre("save", async function () {
  if (!this.isModified("passwordHash")) return;

  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
})

// Custom method for matching plaintext input password to hashed DB password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.index({ verificationToken: 1 }) // quick lookup on if verified
userSchema.index({ resetPasswordToken: 1 }) // quick lookup for password reset

const User = mongoose.model('User', userSchema)
export default User;
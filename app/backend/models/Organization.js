import mongoose from 'mongoose'

const memberSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  orgRole: { 
    type: String, 
    enum: ['member', 'director', 'officer'], 
    default: 'member' 
  }
}, { _id: false })

const organizationSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  description: { 
    type: String, 
    trim: true,
    default: null
  },
  category: { 
    type: String, 
    trim: true,
    default: null
  },
  verificationStatus: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  knightConnectUrl: { 
    type: String, 
    default: null
  },
  contactEmail: { 
    type: String, 
    trim: true,
    default: null
  },
  logo: { 
    type: String, 
    default: null 
  },
  socialLinks: {
    instagram: { type: String, default: null },
    linkedin: { type: String, default: null },
    discord: { type: String, default: null },
    linktree: { type: String, default: null },
    website: { type: String, default: null }
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  president: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  members: [memberSchema],
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, { timestamps: true })

export default mongoose.model('Organization', organizationSchema)
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

const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/

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
    default: null,
    match: [urlRegex, 'Please fill a valid URL']
  },
  contactEmail: { 
    type: String, 
    trim: true,
    default: null
  },
  logo: { 
    type: String, 
    default: null,
    match: [urlRegex, 'Please fill a valid URL']
  },
  socialLinks: {
    instagram: { type: String, default: null, match: [urlRegex, 'Please fill a valid URL'] },
    linkedin: { type: String, default: null, match: [urlRegex, 'Please fill a valid URL'] },
    discord: { type: String, default: null, match: [urlRegex, 'Please fill a valid URL'] },
    linktree: { type: String, default: null, match: [urlRegex, 'Please fill a valid URL'] },
    website: { type: String, default: null, match: [urlRegex, 'Please fill a valid URL'] }
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

organizationSchema.index({ verificationStatus: 1 }) // quick lookup for verification status
organizationSchema.index({ name: 'text' }) // quick lookup for organization name

export default mongoose.model('Organization', organizationSchema)
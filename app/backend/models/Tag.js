import mongoose from 'mongoose'

const tagSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true,
    unique: true,
    lowercase: true
  },
  isCustom: { 
    type: Boolean, 
    default: false
  },
  isApproved: { 
    type: Boolean, 
    default: false
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Organization',
    default: null
  }
}, { timestamps: true })

tagSchema.index({ name: 'text' })
tagSchema.index({ isApproved: 1 })

export default mongoose.model('Tag', tagSchema)
import mongoose from 'mongoose'

const tagSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true,
    unique: true,
    lowercase: true
  },
}, { timestamps: true })

tagSchema.index({ name: 'text' })
tagSchema.index({ isApproved: 1 })

export default mongoose.model('Tag', tagSchema)
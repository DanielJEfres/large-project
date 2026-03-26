import mongoose from 'mongoose'

const rsvpSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  eventId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Event',
    required: true
  },
  status: { 
    type: String, 
    enum: ['going', 'maybe', 'cancelled'],
    default: 'going'
  },
  attended: { 
    type: Boolean, 
    default: false
  }
}, { timestamps: true })

rsvpSchema.index({ userId: 1 })
rsvpSchema.index({ eventId: 1 })
rsvpSchema.index({ userId: 1, eventId: 1 }, { unique: true })

export default mongoose.model('RSVP', rsvpSchema)
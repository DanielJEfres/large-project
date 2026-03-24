import mongoose from 'mongoose'

const eventSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true, 
    trim: true 
  },
  description: { 
    type: String, 
    trim: true,
    default: null
  },
  location: { 
    type: String, 
    trim: true,
    default: null
  },
  startDate: { 
    type: Date, 
    required: true 
  },
  endDate: { 
    type: Date, 
    default: null
  },
  organizationId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Organization',
    default: null
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  tags: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Tag' 
  }],
  isRSO: { 
    type: Boolean, 
    required: true,
    default: false
  },
  flyer: { 
    type: String, 
    default: null 
  },
  status: { 
    type: String, 
    enum: ['upcoming', 'ongoing', 'cancelled', 'completed'],
    default: 'upcoming'
  },
  isPublic: { 
    type: Boolean, 
    default: true 
  },
  rsvpEnabled: { 
    type: Boolean, 
    default: false 
  },
  rsvpLimit: { 
    type: Number, 
    default: null
  }
}, { timestamps: true })

export default mongoose.model('Event', eventSchema)
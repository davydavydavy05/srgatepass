import mongoose from 'mongoose'

const announcementSchema = new mongoose.Schema({
  id: {
    type: String,
    required: false
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Admin'
  },
  heading: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  images: [{
    type: Object,
    size: Number
  }],
  datePosted: {
    type: Date,
    required: true
  },
  isPin: {
    type: Boolean,
    required: true
  }
})

export default mongoose.model('Announcement', announcementSchema)
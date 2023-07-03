import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema({
  id: {
    type: String,
    required: false
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: 'User'
  },
  type: {
    type: String,
    required: true
  },
  heading: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  dateCreated: {
    type: Date,
    required: true
  },
  otherDetails: {
    type: Object,
    required: false
  }
})

export default mongoose.model('Notification', notificationSchema)
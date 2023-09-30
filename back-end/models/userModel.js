import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: false
  },
  type: {
    type: String,
    required: true
  },
  emailAddress: {
    type: String,
    required: true
  },
  password: [String],
  notifications: [{
    type: Object,
    required: false
  }],
  dateCreated: {
    type: Date,
    required: true
  },
  isRegistrationComplete: {
    type: Boolean,
    required: true
  },
  isApprove: {
    type: Boolean,
    required: true
  },
  fmcToken: {
    type: String,
    required: false
  }
})

export default mongoose.model('User', userSchema)
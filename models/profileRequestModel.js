import mongoose from 'mongoose'

const profileRequestSchema = new mongoose.Schema({
  id: {
    type: String,
    required: false
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: 'User'
  },
  firstName: {
    type: String,
    required: true
  },
  middleName: {
    type: String,
  },
  lastName: {
    type: String,
    required: true
  },
  birthdate: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  emailAddress: {
    type: String,
    required: true
  },
  dateRequested: {
    type: Date,
    required: true
  },
  landCertificate: [{
    type: Object,
    size: Number
  }],
  validId: [{
    type: Object,
    size: Number,
    required: true,
  }],
  picture: [{
    type: Object,
    size: Number,
    required: true,
  }],
  action: {
    type: String,
    required: true
  },
  isApprove: {
    type: Boolean,
    required: true
  },
  dateApproved: [{
    type: Object
  }]
})

export default mongoose.model('ProfileRequest', profileRequestSchema)
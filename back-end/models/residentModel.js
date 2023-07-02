import mongoose from 'mongoose'

const residentSchema = new mongoose.Schema({
  id: {
    type: String,
    required: false
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
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
  dateRegistered: {
    type: Date,
    required: true
  },
  dateEdited: [{
    type: String
  }],
  landCertificate: [{
    type: Object,
    size: Number
  }],
  validId: [{
    type: Object,
    size: Number,
    required: false,
  }],
  picture: [{
    type: Object,
    size: Number,
    required: true,
  }],
  qrCodeImage: {
    type: String,
    required: true
  }
})

export default mongoose.model('Resident', residentSchema)
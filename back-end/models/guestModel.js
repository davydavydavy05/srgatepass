import mongoose from 'mongoose'

const guestSchema = new mongoose.Schema({
  id: {
    type: String,
    required: false
  },
  bookingNumber: {
    type: String,
    required: true
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Resident'
  },
  name: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  dateBooked: [{
    type: Date
  }],
  timeArrived: [{
    type: Date
  }],
  qrCodeImage: {
    type: String,
    required: false
  },
  pin: {
    type: String,
    required: true
  },
  urlLink: {
    type: String,
    required: false
  }
})

export default mongoose.model('Guest', guestSchema)
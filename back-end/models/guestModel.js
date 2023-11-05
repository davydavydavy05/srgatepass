import mongoose from "mongoose";

const guestSchema = new mongoose.Schema({
  id: {
    type: String,
    required: false,
  },
  bookingNumber: {
    type: String,
    required: true,
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "Resident",
  },
  name: [
    {
      type: String,
      required: false,
    },
  ],
  phoneNumber: {
    type: String,
    required: false,
  },
  plateNumber: {
    type: String,
    required: false,
  },
  dateBooked: [
    {
      type: Date,
    },
  ],
  timeArrived: [
    {
      type: Object,
    },
  ],
  timeOut: [
    {
      type: Object,
    },
  ],
  qrCodeImage: {
    type: String,
    required: false,
  },
  pin: {
    type: String,
    required: false,
  },
  urlLink: {
    type: String,
    required: false,
  },
  isCanceled: {
    type: Boolean,
    default: false,
  },
  dateOfArrival: [
    {
      type: Date,
    },
  ],
  time: [
    {
      type: Object,
    },
  ],
  type: {
    type: String,
    required: false,
  },
  details: {
    type: String,
    required: false,
  },
  inOrOut: {
    type: String,
    required: false,
  }
});

export default mongoose.model("Guest", guestSchema);

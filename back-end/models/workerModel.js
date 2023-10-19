import mongoose from "mongoose";

const workerSchema = new mongoose.Schema({
  id: {
    type: String,
    required: false,
  },
  firstName: {
    type: String,
    required: true,
  },
  middleName: {
    type: String,
  },
  lastName: {
    type: String,
    required: true,
  },
  birthdate: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  dateRegistered: {
    type: Date,
    required: true,
  },
  picture: [
    {
      type: Object,
      size: Number,
      required: true,
    },
  ],
  qrCodeImage: {
    type: String,
    required: true,
  },
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
  type: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "Active",
    required: false,
  },
});

export default mongoose.model("Worker", workerSchema);

// import mongoose from 'mongoose'

// const workerSchema = new mongoose.Schema({
//   id: {
//     type: String,
//     required: false
//   },
//   firstName: {
//     type: String,
//     required: true
//   },
//   middleName: {
//     type: String,
//   },
//   lastName: {
//     type: String,
//     required: true
//   },
//   birthdate: {
//     type: String,
//     required: true
//   },
//   gender: {
//     type: String,
//     required: true
//   },
//   phoneNumber: {
//     type: String,
//     required: true
//   },
//   address: {
//     type: String,
//     required: true
//   },
//   username: {
//     type: String,
//     required: true
//   },
//   emailAddress: {
//     type: String,
//     required: true
//   },
//   dateRegistered: {
//     type: Date,
//     required: true
//   },
//   dateEdited: [{
//     type: String
//   }],
//   picture: [{
//     type: Object,
//     size: Number,
//     required: true,
//   }],
//   qrCodeImage: {
//     type: String,
//     required: true
//   }
// })

// export default mongoose.model('Worker', workerSchema)

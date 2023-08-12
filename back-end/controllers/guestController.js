import asyncHandler from 'express-async-handler'

import { 
  Guest,
  Notification,
  Resident,
  User 
} from '../models/index.js'

// @desc    Fetch guests
// @route   POST /api/guest/fetch-guests
// @access  Public
const fetchGuests = asyncHandler(async (req, res) => {
  const { userId } = req.body

  try {
    var guests

    // Return all the guests
    if (!userId) {
      guests = await Guest.find().populate('host')
    } else {
      guests = await Guest.find({ host: userId })
    }

    return res.status(200).json(guests)
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch guests' })
  }
})

// @desc    Fetch guest
// @route   POST /api/guest/fetch-guest
// @access  Public
const fetchGuest = asyncHandler(async (req, res) => {
  const { id } = req.body
  const guest = await Guest.findOne({ _id: id }).populate('host')
  return res.status(200).json(guest)
})

// @desc    Check if guest exists
// @route   POST /api/guest/check-if-guest-exists
// @access  Public
const checkIfGuestExists = asyncHandler(async (req, res) => {
  const { 
    name,
    phoneNumber,
    emailAddress
  } = req.body

  // Check if user exists
  const user = await User.findOne({ emailAddress })
  
  // Check if guest exists
  const guestExists = await Guest.findOne({ name, phoneNumber, host: user._id })

  if (!user) {
    res.status(400).json({ errorMessage: `User doesn't exist.` })
    throw new Error(`User doesn't exist.`)
  }

  if (guestExists) {
    return res.status(200).json(guestExists)
  }
  
  res.status(400).json({ message: 'Guest does not exist' })
})

// @desc    Book guest
// @route   POST /api/guest/book-guest
// @access  Public
const bookGuest = asyncHandler(async (req, res) => {
  const { 
    bookingNumber,
    name,
    phoneNumber,
    plateNumber,
    qrCodeImage,
    pin,
    emailAddress
  } = req.body
  const io = req.app.locals.io

  if (!name || !phoneNumber || !pin) {
    res.status(400)
    throw new Error('Input all the fields.')
  }

  // Check if user exists
  const user = await User.findOne({ emailAddress })
  const host = await Resident.findOne({ userId: user._id })

  if (!user) {
    res.status(400).json({ errorMessage: `User doesn't exist.` })
    throw new Error(`User doesn't exist.`)
  }

  // Check if guest exists
  const guestExists = await Guest.findOne({ name, phoneNumber, host: user._id })
  
  if (guestExists) {
    // Check if guest is already booked
    var inputDate = new Date(guestExists.dateBooked[guestExists.dateBooked.length - 1])
    var today = new Date()

    if (isNaN(inputDate)) {
      console.log('Invalid date format')
      return false
    }

    var isSameYear = inputDate.getFullYear() === today.getFullYear()
    var isSameMonth = inputDate.getMonth() === today.getMonth()
    var isSameDay = inputDate.getDate() === today.getDate()

    if (isSameYear && isSameMonth && isSameDay) {
      res.status(400).json({ errorMessage: 'The guest is already booked today.' })
      throw new Error('The guest is already booked today.')
    }

    // If not already booked
    const guest = await Guest.updateOne(
      { _id: guestExists._id }, 
      { 
        $set: { pin },
        $push: { ['dateBooked']: Date.now() } 
      }
    )
    const guestCount = await Guest.countDocuments()

    if (guest.modifiedCount > 0) {
      const guestRes = await Guest.findOne({ _id: guestExists._id })
      const notification = await Notification.create({
        type: 'guest',
        heading: 'Guest Booked!',
        body: 'Guest successfully booked.',
        dateCreated: Date.now(),
        otherDetails: {
          guestId: guestExists._id,
        }
      })
  
      await User.updateMany(
        { emailAddress },
        { $push: { notifications: {
          notificationId: notification._id,
          type: 'guest',
          heading: 'Your guest has been booked!',
          body: 'The gate pass of your guest is valid for 24 hours only.',
          dateCreated: Date.now(),
          isRead: false,
          otherDetails: {
            guestId: guestExists._id,
          }
        }}}
      )

      io.emit('guestCount', guestCount)
      io.emit('notification', notification)
      return res.status(200).json(guestRes)
    } else {
      res.status(400).json({ errorMessage: `Error. There's a problem encountered.` })
      throw new Error(`Error. There's a problem encountered.`)
    }
  }

  // If not exists
  const guest = await Guest.create({
    bookingNumber,
    host,
    name,
    phoneNumber,
    plateNumber,
    dateBooked: Date.now(),
    qrCodeImage,
    pin
  })
  const guestCount = await Guest.countDocuments()
  const result = await Guest.updateOne({ _id: guest._id }, { $set: { urlLink: `localhost:3000/${guest._id}` } })

  if (result) {
    const notification = await Notification.create({
      type: 'guest',
      heading: 'Guest Booked!',
      body: 'Guest successfully booked.',
      dateCreated: Date.now(),
      otherDetails: {
        guestId: guest._id,
      }
    })

    await User.updateMany(
      { emailAddress },
      { $push: { notifications: {
        notificationId: notification._id,
        type: 'guest',
        heading: 'Your guest has been booked!',
        body: 'The gate pass of your guest is valid for 24 hours only.',
        dateCreated: Date.now(),
        isRead: false,
        otherDetails: {
          guestId: guest._id,
        }
      }}}
    )

    io.emit('guestCount', guestCount)
    io.emit('notification', notification)

    res.status(200).json({ guest })
  } else {
    res.status(400).json({ errorMessage: `Error. There's a problem encountered.` })
    throw new Error(`Error. There's a problem encountered.`)
  }
})

// @desc    Unlock gate pass
// @route   POST /api/guest/unlock-gate-pass
// @access  Public
const unlockGatePass = asyncHandler(async (req, res) => {
  const { id, pin } = req.body
  const guest = await Guest.findOne({ _id: id })

  if (guest.pin === pin) {
    return res.status(200).json({ guest })
  } else {
    res.status(400).json({ errorMessage: 'Invalid pin. Try again.' })
    throw new Error('Invalid pin. Try again.')
  }
})

export {
  fetchGuests,
  fetchGuest,
  bookGuest,
  checkIfGuestExists,
  unlockGatePass
}
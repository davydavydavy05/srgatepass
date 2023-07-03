import asyncHandler from 'express-async-handler'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

import { 
  emailTemplate, 
  generateOtp, 
  mailer, 
  validatePassword 
} from '../utils/index.js'

import { 
  ProfileRequest,
  Resident, 
  User 
} from '../models/index.js'

dotenv.config()

var otpCode
var userEmailAddress

// @desc    Log in user
// @route   POST /api/user/login
// @access  Public
const signIn = asyncHandler(async (req, res) => {
  const { emailAddress, password } = req.body

  // Check if user exists and password matches
  const user = await User.findOne({ emailAddress })

  if (user && (await bcrypt.compare(password, user.password[user?.password?.length - 1]))) {
    userEmailAddress = emailAddress
    const token = generateToken(user._id)

    // res.cookie('token', token)

    res.cookie('token', token, {
      domain: 'https://sr-gate-pass.onrender.com',
      path: '/',
      secure: true,
      httpOnly: false,
      sameSite: 'none',
      maxAge: 3600000
    })

    if (user.isApprove) {
      const profileReq = await ProfileRequest.findOne({ userId: user._id })
      const profile = await Resident.findOne({ userId: user._id })

      return res.status(200).json({
        id: user._id,
        type: user.type,
        emailAddress: user.emailAddress,
        isRegistrationComplete: user.isRegistrationComplete,
        isApprove: user.isApprove,
        notifications: user.notifications,
        profile,
        isProfileRequestApprove: profileReq.isApprove,
        token
      })
    }

    return res.status(200).json({
      id: user._id,
      type: user.type,
      emailAddress: user.emailAddress,
      isRegistrationComplete: user.isRegistrationComplete,
      isApprove: user.isApprove,
      token
    })
  } else {
    res.status(400).json({ errorMessage: 'Invalid username or password.' })
    throw new Error('Invalid username or password.')
  }
})

// @desc    Register user
// @route   POST /api/user/registration
// @access  Public
const signUp = asyncHandler(async (req, res) => {
  const { type, emailAddress, password } = req.body

  // Check if one of the fields is empty
  if (!type || !emailAddress || !password) {
    res.status(400)
    throw new Error('Input all the fields.')
  }

  // Check if user exists
  const userExists = await User.findOne({ emailAddress })

  if (userExists) {
    res.status(400).json({ errorMessage: 'User already exists.' })
    throw new Error('User already exists.')
  }

  // If not exists
  const { isValidate, errorMessage } = validatePassword(password)

  // Validate password with NIST policy
  if (isValidate) {
     // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create user
    const user = await User.create({
      type: 'resident',
      emailAddress,
      password: hashedPassword,
      dateCreated: Date.now(),
      isRegistrationComplete: false,
      isApprove: false,
    })

    if (user) {
      userEmailAddress = emailAddress

      res.status(201).json({
        _id: user._id,
        emailAddress: user.emailAddress,
        token: generateToken(user._id)
      })
    } else {
      res.status(400).json({ errorMessage: 'Invalid user data.' })
      throw new Error('Invalid user data.')
    }
  } else {
    res.status(400).json({ errorMessage })
    throw new Error(errorMessage)
  }
})

// @desc    Forgot password
// @route   POST /api/user/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { emailAddress, password } = req.body

  if (!emailAddress || !password) {
    res.status(400)
    throw new Error('Input all the fields.')
  }
  
  // Check if user exists
  const userExists = await User.findOne({ emailAddress })

  if (!userExists) {
    res.status(400).json({ errorMessage: `User doesn't exist.` })
    throw new Error(`User doesn't exist.`)
  }

  // If not exists and check if the user used one of the old passwords
  for (let i = 0; i < userExists?.password?.length; i++) {
    if (await bcrypt.compare(password, userExists?.password[i])) {
      res.status(400).json({ errorMessage: 'Your new password cannot be the same as your current or old password.' })
      throw new Error('Your new password cannot be the same as your current or old password.')
    }
  }

  const { isValidate, errorMessage } = validatePassword(password)

  // Validate password with NIST policy
  if (isValidate) {
     // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await User.updateOne({ emailAddress }, { $push: { ['password']: hashedPassword } })

    if (user) {
      userEmailAddress = emailAddress

      res.status(200).json(user)
    } else {
      res.status(400).json({ errorMessage: 'Invalid user data.' })
      throw new Error('Invalid user data.')
    }
  } else {
    res.status(400).json({ errorMessage })
    throw new Error(errorMessage)
  }
})

// @desc    Generate OTP code
// @route   POST /api/user/generate-otp
// @access  Public
const requestOtp = asyncHandler(async (req, res) => {
  otpCode = generateOtp()

  var action = req.body.action
  var receiver = req.body.receiver
  var subject = 'Verify Email Address'
  var body = emailTemplate(action, otpCode)

  await mailer({ receiver, subject, body })
    .then(() => {
      res.status(200).json({ 
        status: 'success',
        otpCode: otpCode 
      })
    })
    .catch(error => {
      res.status(400)
      throw new Error(error)
    })
})

// @desc    Verify OTP code
// @route   POST /api/user/verification
// @access  Public
const verifyOtp = asyncHandler(async (req, res) => {
  const { emailAddressInput, otpCodeInput } = req.body

  if (otpCodeInput == otpCode && emailAddressInput == userEmailAddress) {
    res.status(200).json({ status: 'success' })
  } else {
    res.status(400).json({ errorMessage: 'Invalid code.' })
    throw new Error('Invalid code.')
  }
})

// @desc    Get user data
// @route   POST /api/user/validate-user
// @access  Public
const validateUser = asyncHandler(async (req, res) => {
  const { _id, username, emailAddress, isApprove, notifications } = await User.findById(req.user._id)

  // Check if user was approved
  if (isApprove) {
    const profileRequest = await ProfileRequest.findOne({ userId: _id })
    const profile = await Resident.findOne({ userId: _id })

    if (profile) {
      return res.status(200).json({
        profile,
        isProfileRequestApprove: profileRequest.isApprove,
        notifications
      })
    }
  }

  // If not
  res.status(200).json({
    _id,
    username,
    emailAddress
  })
})

// @desc    Check if user exists
// @route   POST /api/user/check-user
// @access  Public
const checkUser = asyncHandler(async (req, res) => {
  const { emailAddress } = req.body
  const user = await User.findOne({ emailAddress })
  userEmailAddress = req.body.emailAddress

  if (user) {
    res.status(200).json(user)
  } else {
    res.status(400).json({ errorMessage: `User doesn't exist.` })
    throw new Error(`User doesn't exist.`)
  }
})

// @desc    Check if resident's username already exists
// @route   POST /api/user/check-resident-username
// @access  Public
const checkResidentUsername = asyncHandler(async (req, res) => {
  const { username } = req.body
  const resident = await Resident.findOne({ username })

  if (!resident) {
    res.status(200).json({ message: 'Successfull' })
  } else {
    res.status(400).json({ errorMessage: `Username already exist.` })
    throw new Error(`Username already exist.`)
  }
})

// @desc    Register user (complete user registration)
// @route   POST /api/user/register-user
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { 
    firstName,
    lastName,
    birthdate,
    gender,
    address,
    phoneNumber,
    emailAddress,
    username,
    type
  } = req.body

  // Check if one of the fields is empty
  if (!firstName || !lastName || !birthdate || !gender || !phoneNumber || !address || !emailAddress || !username || !type) {
    res.status(400)
    throw new Error('Input all the fields.')
  }

  // Copy landCertificate values into an array
  const landCertificateArr = Object.keys(req.body)
  .reduce((arr, key) => {
    const match = key.match(/landCertificate\[(\d+)\]\[(\w+)\]/)

    if (match) {
      const index = Number(match[1])
      const property = match[2]

      if (!arr[index]) {
        arr[index] = {}
      }

      arr[index][property] = req.body[key]
    }

    return arr
  }, [])

  // Copy validId values into an array
  const validIdArr = Object.keys(req.body)
  .reduce((arr, key) => {
    const match = key.match(/validId\[(\d+)\]\[(\w+)\]/)

    if (match) {
      const index = Number(match[1])
      const property = match[2]

      if (!arr[index]) {
        arr[index] = {}
      }

      arr[index][property] = req.body[key]
    }

    return arr
  }, [])

  // Copy pictureArr values into an array
  const pictureArr = Object.keys(req.body)
  .reduce((arr, key) => {
    const match = key.match(/picture\[(\d+)\]\[(\w+)\]/)

    if (match) {
      const index = Number(match[1])
      const property = match[2]

      if (!arr[index]) {
        arr[index] = {}
      }

      arr[index][property] = req.body[key]
    }

    return arr
  }, [])

  // Check if resident profile and username already exists
  const user = await User.findOne({ emailAddress })
  const profileExists = await ProfileRequest.findOne({ username })

  if (user) {
    if (user.isApprove) {
      res.status(400).json({ errorMessage: 'User already has a profile.' })
      return
    }

    if (type !== 'homeowner' && type !== 'tenant') {
      res.status(400).json({ errorMessage: 'Invalid resident type.' })
      return
    }

    if (profileExists) {
      res.status(400).json({ errorMessage: 'Username already exists.' })
      return
    }

    const profile = await ProfileRequest.create({
      userId: user._id,
      firstName,
      middleName: '',
      lastName,
      birthdate,
      gender,
      address,
      phoneNumber,
      type,
      emailAddress,
      username,
      dateRequested: Date.now(),
      landCertificate: landCertificateArr,
      validId: validIdArr,
      picture: pictureArr,
      isApprove: false,
      action: 'register'
    })
    await User.updateOne({ emailAddress }, { $set: { isRegistrationComplete: true } })

    if (profile) {
      res.status(201).json(req.body)
    } else {
      res.status(400).json({ errorMessage: 'Error.' })
      throw new Error('Error.')
    }
  } else {
    res.status(400).json({ errorMessage: `User doesn't exist.` })
    throw new Error(`User doesn't exist.`)
  }
})

// @desc    Update user (update user profile)
// @route   POST /api/user/update-user
// @access  Public
const updateUser = asyncHandler(async (req, res) => {
  const { 
    id,
    firstName,
    middleName,
    lastName,
    birthdate,
    gender,
    address,
    phoneNumber,
    emailAddress,
    username
  } = req.body

  // Check if one of the fields is empty
  if (!firstName || !lastName || !birthdate || !gender || !phoneNumber || !address || !emailAddress || !username) {
    res.status(400)
    throw new Error('Input all the fields.')
  }

  // Copy landCertificate values into an array
  const landCertificateArr = Object.keys(req.body)
  .reduce((arr, key) => {
    const match = key.match(/landCertificate\[(\d+)\]\[(\w+)\]/)

    if (match) {
      const index = Number(match[1])
      const property = match[2]

      if (!arr[index]) {
        arr[index] = {}
      }

      arr[index][property] = req.body[key]
    }

    return arr
  }, [])

  // Copy validId values into an array
  const validIdArr = Object.keys(req.body)
  .reduce((arr, key) => {
    const match = key.match(/validId\[(\d+)\]\[(\w+)\]/)

    if (match) {
      const index = Number(match[1])
      const property = match[2]

      if (!arr[index]) {
        arr[index] = {}
      }

      arr[index][property] = req.body[key]
    }

    return arr
  }, [])

  // Copy pictureArr values into an array
  const pictureArr = Object.keys(req.body)
  .reduce((arr, key) => {
    const match = key.match(/picture\[(\d+)\]\[(\w+)\]/)

    if (match) {
      const index = Number(match[1])
      const property = match[2]

      if (!arr[index]) {
        arr[index] = {}
      }

      arr[index][property] = req.body[key]
    }

    return arr
  }, [])

  // Check if resident profile and username already exists
  const user = await User.findOne({ emailAddress })

  if (user) {
    const profile = await ProfileRequest.updateOne(
      { userId: user._id },
      {
        $set: {
          firstName,
          middleName,
          lastName,
          birthdate,
          gender,
          address,
          phoneNumber,
          emailAddress,
          username,
          dateRequested: Date.now(),
          landCertificate: landCertificateArr,
          validId: validIdArr,
          picture: pictureArr,
          isApprove: false,
          action: 'edit'
        }
      }
    )
    await Resident.updateOne(
      { userId: id}, 
      { 
        $push: { ['dateEdited']: Date.now() }
      }
    )

    if (profile) {
      const newProfile = await ProfileRequest.findOne({ userId: user._id })
      res.status(201).json(newProfile)
    } else {
      res.status(400).json({ errorMessage: 'Error.' })
      throw new Error('Error.')
    }
  } else {
    res.status(400).json({ errorMessage: `User doesn't exist.` })
    throw new Error(`User doesn't exist.`)
  }
})

// @desc    Approve user
// @route   POST /api/user/approve-user
// @access  Public
const approveUser = asyncHandler(async (req, res) => {
  const { 
    id, 
    action,
    qrCodeImage
  } = req.body

  // Check if profile exists
  const profileRequest = await ProfileRequest.findOne({ _id: id })

  if (profileRequest) {
    // If action is register
    if (action === 'register') {
      const residentProfile = await Resident.create({
        userId: profileRequest.userId,
        firstName: profileRequest.firstName,
        middleName: profileRequest.middleName,
        lastName: profileRequest.lastName,
        birthdate: profileRequest.birthdate,
        gender: profileRequest.gender,
        address: profileRequest.address,
        phoneNumber: profileRequest.phoneNumber,
        type: profileRequest.type,
        emailAddress: profileRequest.emailAddress,
        username: profileRequest.username,
        dateRegistered: Date.now(),
        landCertificate: profileRequest.landCertificate,
        validId: profileRequest.validId,
        picture: profileRequest.picture,
        qrCodeImage
      })

      if (residentProfile) {
        await ProfileRequest.updateOne(
          { _id: id }, 
          { 
            $set: { isApprove: true },
            $push: { ['dateApproved']: { date: Date.now(), action: 'register' } }
          }
        )
        await User.updateOne({ _id: profileRequest.userId }, { $set: { isApprove: true } })
        
        const notification = await Notification.create({
          type: 'profile',
          heading: 'New Profile Approved!',
          body: 'New profile has been approved.',
          dateCreated: Date.now(),
          otherDetails: {
            userId: profileRequest.userId
          }
        })

        await User.updatOne(
          { _id: profileRequest.userId },
          { $push: { notifications: {
            notificationId: notification._id,
            type: 'profile',
            heading: 'Welcome to SR Gate Pass!',
            body: 'Your profile registration has been approved by the admin. Welcome!',
            dateCreated: Date.now(),
            isRead: false,
            otherDetails: {
              userId: profileRequest.userId
            }
          }}}
        )
      }

      res.status(201).json({ message: 'Register resident profile successfully' })
    }

    // If action is edit
    if (action === 'edit') {
      await ProfileRequest.updateOne(
        { _id: id }, 
        { 
          $set: { isApprove: true },
          $push: { ['dateApproved']: { date: Date.now(), action: 'edit' } }
        }
      )
      await Resident.updateOne(
        { userId: profileRequest.userId }, 
        { 
          $set: { 
            firstName: profileRequest.firstName,
            middleName: profileRequest.middleName,
            lastName: profileRequest.lastName,
            birthdate: profileRequest.birthdate,
            gender: profileRequest.gender,
            address: profileRequest.address,
            phoneNumber: profileRequest.phoneNumber,
            username: profileRequest.username,
            landCertificate: profileRequest.landCertificate,
            validId: profileRequest.validId,
            picture: profileRequest.picture,
          }
        }
      )

      res.status(200).json({ message: 'Edit resident profile successfully.' })
    }

    res.status(400).json({ errorMessage: 'Invalid action.' })
    throw new Error('Invalid action.')
  }

  res.status(400).json({ errorMessage: 'Profile request not found.' })
  throw new Error('Profile request not found.')
})

// @desc    Get the user's application
// @route   POST /api/user/fetch-application
// @access  Public
const fetchApplication = asyncHandler(async (req, res) => {
  const { userId } = req.body
  const application = await ProfileRequest.findOne({ userId })

  if (!application) {
    res.status(400).json({ errorMessage: 'Error. No application found.' })
    throw new Error('Error. No application found.')
  } else {
    res.status(200).json(application)
  }
})

// @desc    Mark notificate as read
// @route   POST /api/user/mark-notification-as-read
// @access  Public
const markNotificationAsRead = asyncHandler(async (req, res) => {
  const { userId, notificationId } = req.body
  const user = await User.findOne({ _id: userId })

  // Check if user exists
  if (user) {
    user.notifications.map(notification => {
      if (notification.notificationId == notificationId) {
        notification.isRead = true
      }
    })

    const notifications = user.notifications
    await User.updateOne({ _id: userId }, { $set: { notifications: notifications } })

    return res.status(200).json({ message: 'Notification marked as read.' })
  } else {
    res.status(400).json({ errorMessage: `User doesn't exist.` })
    throw new Error(`User doesn't exist.`)
  }
})

// Generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '14d'
  })
}

export {
  signIn,
  signUp,
  forgotPassword,
  requestOtp,
  verifyOtp,
  validateUser,
  checkUser,
  checkResidentUsername,
  registerUser,
  updateUser,
  approveUser,
  fetchApplication,
  markNotificationAsRead
}
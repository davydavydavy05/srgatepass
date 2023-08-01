import asyncHandler from 'express-async-handler'

import { 
  emailTemplate, 
  mailer, 
} from '../utils/index.js'

import { 
  Notification,
  ProfileRequest,
  Resident, 
  User 
} from '../models/index.js'

// @desc    Fetch requests
// @route   POST /api/profile/fetch-requests
// @access  Public
const fetchRequests = asyncHandler(async (req, res) => {
  try {
    var requests

    // Return all the requests
      requests = await ProfileRequest.find()

    return res.status(200).json(requests)
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch requests' })
  }
})

// @desc    Fetch residents
// @route   POST /api/profile/fetch-residents
// @access  Public
const fetchResidents = asyncHandler(async (req, res) => {
  try {
    var residents

    // Return all the residents
      residents = await Resident.find()

    return res.status(200).json(residents)
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch residents' })
  }
})

// @desc    Fetch resident
// @route   POST /api/profile/fetch-resident
// @access  Public
const fetchResident = asyncHandler(async (req, res) => {
  const { id } = req.body
  const resident = await Resident.findOne({ _id: id })
  return res.status(200).json(resident)
})

export {
  fetchRequests,
  fetchResident,
  fetchResidents
}
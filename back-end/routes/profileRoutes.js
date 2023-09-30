import express from 'express'

import { 
  fetchRequests,
  fetchResident,
  fetchResidents,fetchRequest
} from '../controllers/profileController.js'

import { protect } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/fetch-requests', protect, fetchRequests)
router.post('/fetch-request', protect, fetchRequest)
router.post('/fetch-resident', protect, fetchResident)
router.post('/fetch-residents', protect, fetchResidents)

export default router
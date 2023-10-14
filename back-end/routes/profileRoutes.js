import express from 'express'

import { 
  fetchRequests,
  fetchResident,
  fetchResidents,fetchRequest
} from '../controllers/profileController.js'

import { protect } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/fetch-requests',  fetchRequests)
router.post('/fetch-request',  fetchRequest)
router.post('/fetch-resident',  fetchResident)
router.post('/fetch-residents',  fetchResidents)

export default router
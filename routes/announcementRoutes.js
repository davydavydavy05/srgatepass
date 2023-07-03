import express from 'express'

import { 
  fetchAnnouncements, 
  fetchAnnouncement, 
  postAnnouncement 
} from '../controllers/announcementController.js'

import { protect } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/fetch-announcements', protect, fetchAnnouncements)
router.post('/fetch-announcement', protect, fetchAnnouncement)
router.post('/post-announcement', protect, postAnnouncement)

export default router
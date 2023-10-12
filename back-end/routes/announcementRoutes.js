import express from 'express'

import { 
  fetchAnnouncements, 
  fetchAnnouncement, 
  postAnnouncement 
} from '../controllers/announcementController.js'

import { protect } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/fetch-announcements', fetchAnnouncements)
router.post('/fetch-announcement',  fetchAnnouncement)
router.post('/post-announcement',  postAnnouncement)

export default router
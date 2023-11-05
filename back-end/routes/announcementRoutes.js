import express from 'express'

import { 
  fetchAnnouncements, 
  fetchAnnouncement, 
  postAnnouncement,editAnnouncement,deleteAnnouncement
} from '../controllers/announcementController.js'

import { protect } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/fetch-announcements',  fetchAnnouncements)
router.post('/fetch-announcement',  fetchAnnouncement)
router.post('/post-announcement',  postAnnouncement)
router.post('/edit-announcement',  editAnnouncement)
router.post('/delete-announcement',  deleteAnnouncement)
export default router
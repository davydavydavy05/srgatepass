import express from 'express'

import { getResidentProfile,getResidentProfileQr } from '../controllers/securityController.js';


// import { protect } from '../middlewares/authMiddleware.js'


const router = express.Router()

router.post('/scan-rfid', getResidentProfile);
router.post('/scan-qr', getResidentProfileQr);
export default router

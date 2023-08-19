import express from 'express'

import { getResidentProfileRfid,getResidentProfileQr,getResidentProfileBookingNum,fetchResidentProfileOffline} from '../controllers/securityController.js';


// import { protect } from '../middlewares/authMiddleware.js'


const router = express.Router()

router.post('/scan-rfid', getResidentProfileRfid);
router.post('/scan-qr', getResidentProfileQr);
router.get('/scan-qr-offline', fetchResidentProfileOffline);
router.post('/scan-booking-number', getResidentProfileBookingNum);
export default router

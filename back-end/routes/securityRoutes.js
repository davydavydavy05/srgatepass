import express from "express";

import {
  getResidentProfileRfid,
  getResidentProfileQr,
  getResidentProfileBookingNum,
  fetchResidentProfileOffline,
  manageTimeIn,
  manageTimeOut,
  manageOfflineGuestRecords,
  manageTimeInResident,
  manageTimeOutResident,
  addVisitor,
  manageTimeInWorker,
  manageTimeOutWorker,
} from "../controllers/securityController.js";
import { editGuest } from "../controllers/guestController.js";

// import { protect } from '../middlewares/authMiddleware.js'

const router = express.Router();

router.post("/scan-rfid", getResidentProfileRfid);
router.post("/scan-qr", getResidentProfileQr);
router.get("/scan-qr-offline", fetchResidentProfileOffline);
router.post("/scan-booking-number", getResidentProfileBookingNum);
router.post("/edit-guest", editGuest);
router.post("/time-in", manageTimeIn);
router.post("/time-out", manageTimeOut);
router.post("/time-in-resident", manageTimeInResident);
router.post("/time-out-resident", manageTimeOutResident);
router.post("/time-in-worker", manageTimeInWorker);
router.post("/time-out-worker", manageTimeOutWorker);
router.post("/manage-offline-guest-record", manageOfflineGuestRecords);
router.post("/add-visitors", addVisitor);

export default router;

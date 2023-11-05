import express from "express";

import {
  bookGuest,
  checkIfGuestExists,
  fetchGuest,
  fetchGuests,
  unlockGatePass,
  updateUserCancelStatus,
  fetchGuestNameCount, reBookGuest,fetchHostGuests
} from "../controllers/guestController.js";

import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/fetch-guest", fetchGuest);
router.get("/fetch-guests",  fetchGuests);
router.get("/fetch-host-guests",  fetchHostGuests);
router.post("/book-guest",  bookGuest);
router.post("/check-if-guest-exists",  checkIfGuestExists);
router.post("/unlock-gate-pass", unlockGatePass);
router.post("/update-cancel-status",  updateUserCancelStatus);
router.post("/get-guest-count",  fetchGuestNameCount);
router.post("/rebook-guest",  reBookGuest);
export default router;

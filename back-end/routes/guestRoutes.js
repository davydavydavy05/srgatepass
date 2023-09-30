import express from "express";

import {
  bookGuest,
  checkIfGuestExists,
  fetchGuest,
  fetchGuests,
  unlockGatePass,
  updateUserCancelStatus,
  fetchGuestNameCount,
} from "../controllers/guestController.js";

import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/fetch-guest", fetchGuest);
router.get("/fetch-guests", protect, fetchGuests);
router.post("/book-guest", protect, bookGuest);
router.post("/check-if-guest-exists", protect, checkIfGuestExists);
router.post("/unlock-gate-pass", unlockGatePass);
router.post("/update-cancel-status", protect, updateUserCancelStatus);
router.post("/get-guest-count", protect, fetchGuestNameCount);

export default router;

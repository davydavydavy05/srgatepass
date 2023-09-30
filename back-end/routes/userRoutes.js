import express from 'express'

import { 
  approveUser,
  checkResidentUsername,
  checkUser,
  fetchApplication,
  forgotPassword,
  markNotificationAsRead,
  registerUser,
  requestOtp,
  signIn, 
  signUp, 
  updateUser,
  validateUser,
  verifyOtp,addWorkerAdmin,fetchWorkers,fetchWorker,updateUserFmcToken,editProfileResident,deactivateResident
} from '../controllers/userController.js'

import { protect } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/login', signIn)
router.post('/registration', signUp)
router.post('/forgot-password', forgotPassword)
router.post('/generate-otp', requestOtp)
router.post('/verification', verifyOtp)
router.post('/validate-user', protect, validateUser)
router.post('/check-user', checkUser)
router.post('/check-resident-username', checkResidentUsername)
router.post('/register-user', protect, registerUser)
router.post('/update-user', protect, updateUser)
router.post('/approve-user', protect, approveUser)
router.post('/fetch-application', protect, fetchApplication)
router.post('/mark-notification-as-read', protect, markNotificationAsRead)
router.post('/add-user-admin', protect, addWorkerAdmin)
router.post('/fetch-workers', protect,fetchWorkers )
router.post('/fetch-worker', protect,fetchWorker )
router.post('/updateToken', protect,updateUserFmcToken )
router.post('/edit-profile-resident', protect,editProfileResident);
router.post('/deactivate-resident',protect, deactivateResident);


export default router
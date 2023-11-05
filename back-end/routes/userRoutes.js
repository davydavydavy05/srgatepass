import express from 'express'

import { 
  approveUser,
  changePassword,
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
  verifyOtp,addWorkerAdmin,fetchWorkers,fetchWorker,updateUserFmcToken,editProfileResident,deactivateResident,deactivateWorker,editProfileWorker, fetchSecuritys,fetchSecurity
} from '../controllers/userController.js'

import { protect } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/login', signIn)
router.post('/registration', signUp)
router.post('/change-password', changePassword)
router.post('/forgot-password', forgotPassword)
router.post('/generate-otp', requestOtp)
router.post('/verification', verifyOtp)
router.post('/validate-user', protect, validateUser)
router.post('/check-user', checkUser)
router.post('/check-resident-username', checkResidentUsername)
router.post('/register-user',  registerUser)
router.post('/update-user',  updateUser)
router.post('/approve-user',  approveUser)
router.post('/fetch-application',  fetchApplication)
router.post('/mark-notification-as-read',  markNotificationAsRead)
router.post('/add-user-admin',  addWorkerAdmin)
router.post('/fetch-workers', fetchWorkers)
router.post('/fetch-worker', fetchWorker)
router.post('/updateToken', updateUserFmcToken)
router.post('/deactivate-resident', deactivateResident);
router.post('/edit-profile-resident', editProfileResident)
router.post('/edit-profile-worker', editProfileWorker)
router.post('/deactivate-worker', deactivateWorker);
router.post('/fetch-securitys', fetchSecuritys);
router.post('/fetch-security', fetchSecurity)

export default router
//NCFIN
// import express from 'express'

// import { 
//   approveUser,
//   checkResidentUsername,
//   checkUser,
//   fetchApplication,
//   forgotPassword,
//   markNotificationAsRead,
//   registerUser,
//   requestOtp,
//   signIn, 
//   signUp, 
//   updateUser,
//   validateUser,
//   verifyOtp,addWorkerAdmin,fetchWorkers,fetchWorker,updateUserFmcToken,editProfileResident,deactivateResident,deactivateWorker
// } from '../controllers/userController.js'

// import { protect } from '../middlewares/authMiddleware.js'

// const router = express.Router()

// router.post('/login', signIn)
// router.post('/registration', signUp)
// router.post('/forgot-password', forgotPassword)
// router.post('/generate-otp', requestOtp)
// router.post('/verification', verifyOtp)
// router.post('/validate-user', protect, validateUser)
// router.post('/check-user', checkUser)
// router.post('/check-resident-username', checkResidentUsername)
// router.post('/register-user', protect, registerUser)
// router.post('/update-user', protect, updateUser)
// router.post('/approve-user', protect, approveUser)
// router.post('/fetch-application', protect, fetchApplication)
// router.post('/mark-notification-as-read', protect, markNotificationAsRead)
// router.post('/add-user-admin', protect, addWorkerAdmin)
// router.post('/fetch-workers', protect,fetchWorkers )
// router.post('/fetch-worker', protect,fetchWorker )
// router.post('/updateToken', protect,updateUserFmcToken )
// router.post('/edit-profile-resident', protect,editProfileResident);
// router.post('/deactivate-resident',protect, deactivateResident);
// router.post('/deactivate-worker',protect, deactivateWorker);


// export default router


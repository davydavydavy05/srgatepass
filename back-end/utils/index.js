/**
 ** This file is where we export all the utilities
 ** We will usually do this to have cleaner import statements.
**/

import emailTemplate from './emailTemplate.js'
import generateOtp from './generateOtp.js'
import mailer from './mailer.js'
import validatePassword from './validatePassword.js'

export {
  emailTemplate,
  generateOtp,
  mailer,
  validatePassword
}
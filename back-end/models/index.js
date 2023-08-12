/**
 ** This file is where we export all the models
 ** We will usually do this to have cleaner import statements
**/

import Announcement from './announcementModel.js'
import Guest from './guestModel.js'
import Notification from './notificationModel.js'
import ProfileRequest from './profileRequestModel.js'
import Resident from './residentModel.js'
import User from './userModel.js'
import Worker from './workerModel.js'

export {
  Announcement,
  Guest,
  Notification,
  ProfileRequest,
  Resident,
  User,
  Worker
}
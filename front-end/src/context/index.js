/**
 ** This file is where we export all the contents of the context folder
 ** We will usually do this to have cleaner import statements
**/

import { useSrContext, SrProvider } from './context'

import {
  validateUser,
  logInUser,
  registerUser,
  fetchAnnouncements,
  bookGuest
} from './actions'

import {
  COUNTDOWN,
  VALIDATE_USER,
  LOG_IN_USER,
  REGISTER_USER,
  FORGOT_PASSWORD,
  UPDATE_PROFILE_DETAILS,
  FETCH_ANNOUNCEMENTS,
  BOOK_GUEST,
  UPDATE_GUESTS_COUNT,
  SET_ACTION,
  SET_COUNTDOWN_START,
  KEEP_ME_LOGGED_IN,
  INSERT_ROUTE,
  TOGGLE_NAV,
  SET_ACTIVE_PAGE,
  CHECK_IF_IOS_DEVICE,
  initialState,
  reducer
} from './reducer'

export {
  useSrContext,
  SrProvider,
  COUNTDOWN,
  VALIDATE_USER,
  LOG_IN_USER,
  REGISTER_USER,
  FORGOT_PASSWORD,
  UPDATE_PROFILE_DETAILS,
  FETCH_ANNOUNCEMENTS,
  BOOK_GUEST,
  UPDATE_GUESTS_COUNT,
  SET_ACTION,
  SET_COUNTDOWN_START,
  KEEP_ME_LOGGED_IN,
  INSERT_ROUTE,
  TOGGLE_NAV,
  SET_ACTIVE_PAGE,
  CHECK_IF_IOS_DEVICE,
  initialState,
  reducer,
  validateUser,
  logInUser,
  registerUser,
  fetchAnnouncements,
  bookGuest
}
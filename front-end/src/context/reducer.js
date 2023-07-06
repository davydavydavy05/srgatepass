// Global variables
export const COUNTDOWN = 60000

// Action types
export const VALIDATE_USER = 'VALIDATE_USER'
export const LOG_IN_USER = 'LOG_IN_USER'
export const REGISTER_USER = 'REGISTER_USER'
export const FORGOT_PASSWORD = 'FORGOT_PASSWORD'
export const UPDATE_PROFILE_DETAILS = 'UPDATE_PROFILE_DETAILS'
export const FETCH_ANNOUNCEMENTS = 'FETCH_ANNOUNCEMENTS'
export const BOOK_GUEST = 'BOOK_GUEST'
export const UPDATE_GUESTS_COUNT = 'UPDATE_GUESTS_COUNT'
export const SET_ACTION = 'SET_ACTION'
export const SET_COUNTDOWN_START = 'SET_COUNTDOWN_START'
export const KEEP_ME_LOGGED_IN = 'KEEP_ME_LOGGED_IN'
export const INSERT_ROUTE = 'INSERT_ROUTE'
export const TOGGLE_NAV = 'TOGGLE_NAV'
export const SET_ACTIVE_PAGE = 'SET_ACTIVE_PAGE'
export const CHECK_IF_IOS_DEVICE = 'CHECK_IF_IOS_DEVICE'

// Initial state
export const initialState = {
  user: {},
  userDetails: {},
  announcements: [],
  guests: [],
  guestsCount: 0,
  action: '',
  otpCountdown: '',
  countdownStart: false,
  keepMeLoggedIn: false,
  routeHistory: [],
  isMenuOpen: false,
  activePage: 'home',
  isiOSDevice: false
}

// Reducer
export const reducer = (initialState, action) => {
  switch (action.type) {
    case VALIDATE_USER:
      return {
        ...initialState,
        user: {
          ...initialState.user,
          ...action.payload
        }
      }
    case LOG_IN_USER:
      return {
        ...initialState,
        user: action.payload
      }
    case REGISTER_USER:
      return {
        ...initialState,
        user: action.payload
      }
    case FORGOT_PASSWORD:
      return {
        ...initialState,
        user: {
          ...initialState.user,
          emailAddress: action.payload
        }
      }
    case UPDATE_PROFILE_DETAILS:
      return {
        ...initialState,
        userDetails: {
          ...initialState.userDetails,
          ...action.payload
        }
      }
    case FETCH_ANNOUNCEMENTS:
      return {
        ...initialState,
        announcements: action.payload
      }
    case BOOK_GUEST:
      return {
        ...initialState,
        guests: [
          ...initialState.guests,
          action.payload
        ]
      }
    case UPDATE_GUESTS_COUNT:
      return {
        ...initialState,
        guestsCount: action.payload,
    }
    case SET_ACTION:
      return {
        ...initialState,
        action: action.payload
      }
    case SET_COUNTDOWN_START:
      return {
        ...initialState,
        countdownStart: action.payload
      }
    case KEEP_ME_LOGGED_IN:
      return {
        ...initialState,
        keepMeLoggedIn: true
      }
    case INSERT_ROUTE:
      return {
        ...initialState,
        routeHistory: action.payload
      }
    case TOGGLE_NAV:
      return {
        ...initialState,
        isMenuOpen: !initialState.isMenuOpen
      }
    case SET_ACTIVE_PAGE:
      return {
        ...initialState,
        activePage: action.payload
      }
    case CHECK_IF_IOS_DEVICE:
      return {
        ...initialState,
        isiOSDevice: action.payload
      }
    default:
      throw new Error(`Unhandled action type: ${action.type}`)
  }
}
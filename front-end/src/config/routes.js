/**
 ** Define all the routes we want to have.
 ** I created an array of objects that define what path is mapped to what component.
**/

import {
  AccountRegistrationPending,
  AccountRegistrationSuccessfully,
  Announcements,
  AnnouncementOverview,
  BookGuest,
  BookGuestSuccessfully,
  EditApplicationPending,
  EditApplicationStep1,
  EditApplicationStep2,
  EditApplicationStep3,
  EditProfilePending,
  EditProfileStep1,
  EditProfileStep2,
  EditProfileStep3,
  GuestHistory,
  GuestOverview,
  GuestsHistory,
  Home,
  Login,
  Map,
  MyGatePass,
  MyGuests,
  MyApplication,
  MyProfile,
  Notifications,
  OnBoardingStep1,
  OnBoardingStep2,
  OnBoardingStep3,
  OnBoardingSuccessfully,
  PageNotFound,
  Registration,
  RegistrationSuccessfully,
  ResetPasswordStep1,
  ResetPasswordStep2,
  ResetPasswordStep3,
  ResetPasswordSuccessfully,
  SearchGuest,
  Verification,
  ApproveUser
} from '../pages'

const routes = [
  {
    path: '/',
    component: <Login />
  },
  {
    path: '/login',
    component: <Login />
  },
  {
    path: '/registration',
    component: <Registration />
  },
  {
    path: '/registration-successfully',
    component: <RegistrationSuccessfully />
  },
  {
    path: '/verification',
    component: <Verification />
  },
  {
    path: '/forgot-password',
    component: <ResetPasswordStep1 />
  },
  {
    path: '/forgot-password-otp',
    component: <ResetPasswordStep2 />
  },
  {
    path: '/reset-password',
    component: <ResetPasswordStep3 />
  },
  {
    path: '/reset-password-successfully',
    component: <ResetPasswordSuccessfully />
  },
  {
    path: '/onboarding-step-1',
    component: <OnBoardingStep1 />
  },
  {
    path: '/onboarding-step-2',
    component: <OnBoardingStep2 />
  },
  {
    path: '/onboarding-step-3',
    component: <OnBoardingStep3 />
  },
  {
    path: '/onboarding-successfully',
    component: <OnBoardingSuccessfully />
  },
  {
    path: '/account-registration-pending',
    component: <AccountRegistrationPending />
  },
  {
    path: '/account-registration-successfully',
    component: <AccountRegistrationSuccessfully />
  },
  {
    path: '/my-application',
    component: <MyApplication />
  },
  {
    path: '/edit-application-step-1',
    component: <EditApplicationStep1 />
  },
  {
    path: '/edit-application-step-2',
    component: <EditApplicationStep2 />
  },
  {
    path: '/edit-application-step-3',
    component: <EditApplicationStep3 />
  },
  {
    path: '/edit-application-pending',
    component: <EditApplicationPending />
  },
  {
    path: '/home',
    component: <Home />
  },
  {
    path: '/notifications',
    component: <Notifications />
  },
  {
    path: '/my-profile',
    component: <MyProfile />
  },
  {
    path: '/edit-profile-step-1',
    component: <EditProfileStep1 />
  },
  {
    path: '/edit-profile-step-2',
    component: <EditProfileStep2 />
  },
  {
    path: '/edit-profile-step-3',
    component: <EditProfileStep3 />
  },
  {
    path: '/edit-profile-pending',
    component: <EditProfilePending />
  },
  {
    path: '/my-gate-pass',
    component: <MyGatePass />
  },
  {
    path: '/announcements',
    component: <Announcements />
  },
  {
    path: '/announcement-overview/:id',
    component: <AnnouncementOverview />
  },
  {
    path: '/my-guests',
    component: <MyGuests />
  },
  {
    path: '/guest-overview/:id',
    component: <GuestOverview />
  },
  {
    path: '/guest-history',
    component: <GuestHistory />
  },
  {
    path: '/search-guest',
    component: <SearchGuest />
  },
  {
    path: '/book-guest',
    component: <BookGuest />
  },
  {
    path: '/book-guest-successfully',
    component: <BookGuestSuccessfully />
  },
  {
    path: '/guests-history',
    component: <GuestsHistory />
  },
  {
    path: '/map',
    component: <Map />
  },
  {
    path: '/*',
    component: <PageNotFound />
  },
  {
    path: '/approve-user',
    component: <ApproveUser />
  }
]

export default routes
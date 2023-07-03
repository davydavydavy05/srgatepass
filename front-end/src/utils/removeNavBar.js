/**
 ** This function removes the navigation bar on specific pages
**/

export default function removeNavBar(location, routes) {
  return routes.some(route => 
    route.path === location.pathname 
      && 
    route.path !== '/login' 
      && 
    route.path !== '/registration' 
      && 
    route.path !== '/registration-successfully' 
      && 
    route.path !== '/verification' 
      && 
    route.path !== '/forgot-password' 
      && 
    route.path !== '/forgot-password-otp' 
      && 
    route.path !== '/reset-password'
      &&
    route.path !== '/reset-password-successfully'
      &&
    route.path !== '/onboarding-step-1'
      &&
    route.path !== '/onboarding-step-2'
      &&
    route.path !== '/onboarding-step-3'
      &&
    route.path !== '/onboarding-successfully'
      &&
    route.path !== '/account-registration-pending'
      &&
    route.path !== '/account-registration-successfully'
      &&
    route.path !== '/my-application'
      &&
    route.path !== '/edit-application-step-1'
      &&
    route.path !== '/edit-application-step-2'
      &&
    route.path !== '/edit-application-step-3'
      &&
    route.path !== '/edit-application-pending'
      &&
    route.path !== '/edit-profile-step-1'
      &&
    route.path !== '/edit-profile-step-2'
      &&
    route.path !== '/edit-profile-step-3'
      &&
    route.path !== '/edit-profile-pending'
      &&
    route.path !== '/my-gate-pass'
      &&
    route.path !== '/announcement'
      &&
    route.path !== '/guest-overview'
      &&
    route.path !== '/guest-history'
      &&
    route.path !== '/search-guest'
      &&
    route.path !== '/book-guest'
      &&
    route.path !== '/book-guest-successfully'
      &&
    route.path !== '/guests-history'
      &&
    route.path !== '/approve-user' 
      &&
    route.path !== '/'
  )
}
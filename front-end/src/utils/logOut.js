/**
 ** This function log outs the user
 ** We usually use this to reload the page and navigate to the given route
**/

export default async function logOut() {
  window.location.href = window.location.href
  window.location.assign('/login')
}
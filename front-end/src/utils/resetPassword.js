/**
 ** This function resets the user's password
**/

import { Axios } from '../config'

export default async function resetPassword(payload) {
  const { emailAddress, password } = payload

  try {
    const res = await Axios.post('/user/forgot-password', { emailAddress, password })

    if (res) {
      return res
    }
  } catch (error) {
    console.log(`Unhandled action type: ${error}`)

    return {
      status: error.response.status,
      errorMessage: error.response.data.errorMessage
    }
  }
}
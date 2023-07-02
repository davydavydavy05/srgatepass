/**
 ** This function requests OTP code from the server
**/

import { Axios } from '../config'

export default async function requestOtp(payload) {
  const { action, receiver } = payload

  try {
    const res = await Axios.post('/user/generate-otp', { action, receiver })

    if (res) {
      return res
    }
  } catch (error) {
    console.error(`Unhandled action type: ${error}`)

    return {
      status: error.response.status,
      errorMessage: error.response.data.errorMessage
    }
  }
}
/**
 ** This function verifies the OTP code sent to user's email address
**/

import { Axios } from '../config'

export default async function verifyOtp(payload) {
  const { emailAddress, otpCode } = payload

  try {
    const res = await Axios.post('/user/verification', { emailAddressInput: emailAddress, otpCodeInput: otpCode })

    if (res) {
      console.log(res)
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
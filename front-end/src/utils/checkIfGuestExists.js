/**
 ** This function checks if the guest exists on the database
**/

import { Axios } from '../config'

export default async function checkIfGuestExists(payload) {
  const { name, phoneNumber, emailAddress } = payload

  try {
    const res = await Axios.post('/guest/check-if-guest-exists', { name, phoneNumber, emailAddress })

    return res
  } catch (error) {
    console.log(`Unhandled action type: ${error}`)

    return {
      status: error.response.status
    }
  }
}
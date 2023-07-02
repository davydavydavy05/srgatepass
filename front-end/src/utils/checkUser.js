/**
 ** This function checks the user on the database
**/

import { Axios } from '../config'

export default async function checkUser(payload) {
  const { emailAddress } = payload
  
  try {
    const res = await Axios.post('/user/check-user', { emailAddress })

    return res
  } catch (error) {
    console.log(`Unhandled action type: ${error}`)

    return {
      status: error.response.status,
      errorMessage: error.response.data.errorMessage
    }
  }
}
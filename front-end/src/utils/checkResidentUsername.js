/**
 ** This function checks if the resident's username already exists
**/

import { Axios } from '../config'

export default async function checkResidentUsername(payload) {
  const { username } = payload

  try {
    const res = await Axios.post('/user/check-resident-username', { username })

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
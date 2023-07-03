/**
 ** This function fetch guests from the database
**/

import { Axios } from '../config'

export default async function fetchGuests(payload) {
  const { userId } = payload

  try {
    const res = await Axios.post('/guest/fetch-guests', { userId }).then(res => {
      return res
    })
  
    return res
  } catch (error) {
    console.error(`Unhandled action type: ${error}`)

    return {
      status: error.response.status,
      errorMessage: error.response.data.errorMessage
    }
  }
}
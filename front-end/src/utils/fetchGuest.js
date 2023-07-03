/**
 ** This function fetch guest from the database
**/

import { Axios } from '../config'

export default async function fetchGuest(payload) {
  const { id } = payload

  try {
    const res = await Axios.post('/guest/fetch-guest', { id }).then(res => {
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
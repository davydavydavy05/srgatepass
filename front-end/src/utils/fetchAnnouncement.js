/**
 ** This function fetch announcement from the database
**/

import { Axios } from '../config'

export default async function fetchAnnouncement(payload) {
  const { _id } = payload

  try {
    const res = await Axios.post('/announcement/fetch-announcement', { _id }).then(res => {
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
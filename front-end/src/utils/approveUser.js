/**
 ** This function approves user's request
**/

import { Axios } from '../config'

export default async function approveUser(payload) {
  const { id, action, token, qrCodeImage } = payload

  try {
    const res = await Axios.post('/user/approve-user', { id, action, token, qrCodeImage }).then(res => {
      console.log(res)
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
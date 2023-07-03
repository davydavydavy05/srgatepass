/**
 ** This function fetches user's application
**/

import { Axios } from '../config'

export default async function fetchApplication(payload) {
  const { userId } = payload

  try {
    const res = await Axios.post('/user/fetch-application', { userId })

    console.log(res)

    if (res) {
      return res
    }
  } catch (error) {
    console.error(`Unhandled action type: ${error}`)

    return { errorMessage: error.response.data.errorMessage }
  }
}
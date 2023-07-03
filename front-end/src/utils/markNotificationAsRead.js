/**
 ** This function marks the notification as read
**/

import { Axios } from '../config'

export default async function markNotificationAsRead(payload) {
  const { userId, notificationId } = payload

  try {
    const res = await Axios.post('/user/mark-notification-as-read', { userId, notificationId }).then(res => {
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
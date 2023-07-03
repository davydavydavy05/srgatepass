/**
 ** This function updates user profile
**/

import { Axios } from '../config'

export default async function updateUser(payload) {
  const { 
    id,
    firstName,
    middleName,
    lastName,
    birthdate,
    gender,
    address,
    phoneNumber,
    emailAddress,
    username,
    landCertificate,
    validId,
    picture
  } = payload
  
  try {
    const res = await Axios.post('/user/update-user', {
      id,
      firstName,
      middleName,
      lastName,
      birthdate,
      gender,
      address,
      phoneNumber,
      emailAddress,
      username,
      landCertificate,
      validId,
      picture
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
/**
 ** This function completes user registration
**/

import { Axios } from '../config'

export default async function registerUser(payload) {
  const { 
    firstName,
    lastName,
    birthdate,
    gender,
    address,
    phoneNumber,
    emailAddress,
    username,
    type,
    landCertificate,
    validId,
    picture
  } = payload
  
  console.log(payload)

  try {
    const res = await Axios.post('/user/register-user', {
      firstName,
      lastName,
      birthdate,
      gender,
      address,
      phoneNumber,
      emailAddress,
      username,
      type,
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
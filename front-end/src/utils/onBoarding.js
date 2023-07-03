/**
 ** This function creates resident profile
**/

import { Axios } from '../config'

export default async function onBoarding(payload) {
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

  try {
    let res = await Axios.post('/user/register-user', { 
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

    if (res) {
      return res
    }
  } catch (error) {
    console.error(`Unhandled action type: ${error}`)

    return {
      status: error.response.status,
      errorMessage: error.response.data.errorMessage
    }
  }
}
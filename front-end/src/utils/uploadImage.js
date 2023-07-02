/**
 ** This function uploads image to Cloudinary
**/

import { Axios } from '../config'

export default async function uploadImage(file) {
  const formData = new FormData()
  
  formData.append('file', file)
  formData.append('upload_preset', 'kfaije1j')
  
  const res = await Axios.post(
    'https://api.cloudinary.com/v1_1/dfc3s2kfc/image/upload',
    formData,
    { withCredentials: false }
  )

  return res
}
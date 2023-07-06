/**
 ** This function uploads file to Cloudinary
**/

import { Axios } from '../config'

export default async function uploadFile(file) {
  const formData = new FormData()
  
  formData.append('file', file)
  formData.append('upload_preset', 'etpandhu')

  const res = await Axios.post('https://api.cloudinary.com/v1_1/dkrpz20px/raw/upload', formData, { withCredentials: false }).then(res => {
    return res
  })

  return res
}
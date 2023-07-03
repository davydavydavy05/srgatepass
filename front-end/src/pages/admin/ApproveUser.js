// ##### *** FOR TEST PURPOSES ONLY *** ##### //

import React, { useEffect, useRef, useState } from 'react'
import Axios from 'axios'
import QRCodeStyling from 'qr-code-styling'
import html2canvas from 'html2canvas'
import { approveUser, uploadFile } from '../../utils'

function ApproveUser() {
  const [inputs, setInputs] = useState({
    id: '',
    token: '',
    action: '',
    userId: '',
    firstName: '',
    lastName: '',
    birthdate: '',
    address: '',
    phoneNumber: '',
    emailAddress: '',
    username: '',
  })
  const qrCodeCanvasRef = useRef(null)

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const canvas = await html2canvas(qrCodeCanvasRef.current)
      const qrCodeImage = canvas.toDataURL()

      const formData = new FormData()
      formData.append('file', qrCodeImage)
      formData.append('upload_preset', 'kfaije1j')

      const res = await Axios.post(
        'https://api.cloudinary.com/v1_1/dfc3s2kfc/image/upload',
        formData,
        { withCredentials: false }
      )
      
      await approveUser({ 
        id: inputs.id, 
        action: inputs.action, 
        token: inputs.token, 
        qrCodeImage: `${res.data?.public_id}.png` 
      })
    } catch (error) {
      console.log('An error occurred while approving the user.', error)
    }
  }

  // Use effect
  useEffect(() => {
    const qrCodeStyling = new QRCodeStyling({
      width: 1000,
      height: 1000,
      data: `${inputs.userId}`,
      qrOptions: {
        typeNumber: 0,
        mode: 'Byte',
        errorCorrectionLevel: 'H',
      },
      imageOptions: {
        hideBackgroundDots: false,
        imageSize: 0.4,
        crossOrigin: 'anonymous',
      },
      dotsOptions: {
        color: '#000000',
        type: 'extra-rounded', 
      },
      backgroundOptions: {
        color: '#FFFFFF',
      },
      cornersSquareOptions: {
        type: 'dot', 
      }
    })

    qrCodeStyling.append(qrCodeCanvasRef.current)
    qrCodeStyling.update()
  }, [inputs.userId])

  return (
    <section id='approve-user' style={{ display: 'grid', placeContent: 'center', placeItems: 'center', height: '100vh' }}>
      {/* QR Code */}
      <div ref={qrCodeCanvasRef} id='qr-code'></div>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
        <input 
          type='text'
          name='id'
          placeholder='ID here'
          value={inputs.id}
          onChange={e => setInputs({ ...inputs, id: e.target.value })}
          required
        />
        <input 
          type='text'
          name='token'
          placeholder='Token here'
          value={inputs.token}
          onChange={e => setInputs({ ...inputs, token: e.target.value })}
          required
        />
        <input 
          type='text'
          name='action'
          placeholder='Action here'
          value={inputs.action}
          onChange={e => setInputs({ ...inputs, action: e.target.value })}
          required
        />
        <input 
          type='text'
          name='userId'
          placeholder='User ID here'
          value={inputs.userId}
          onChange={e => setInputs({ ...inputs, userId: e.target.value })}
          required
        />

        <input type='submit' value='Approve' style={{ width: '100%', marginTop: '24px' }} className='solid btn' />
      </form>
    </section>
  )
}

export default ApproveUser
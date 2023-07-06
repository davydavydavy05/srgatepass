import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import QRCodeStyling from 'qr-code-styling'
import html2canvas from 'html2canvas'

import {
  useSrContext,
  validateUser,
  bookGuest
} from '../../context'

import { checkIfGuestExists, uploadImage } from '../../utils'

import { Back } from '../../assets/svg'

import '../../css/book_guest.css'

function BookGuest({ forwardRef }) {
  const qrCodeCanvasRef = useRef(null)
  const navigate = useNavigate()
  const [initialState, dispatch] = useSrContext()
  const [bookingNumber, setBookingNumber] = useState('123')
  const [inputs, setInputs] = useState({
    guestName: '',
    guestPhoneNumber: '',
    pin: ''
  })
  const [error, setError] = useState({ isError: false, errorMessage: '' })
  const profileDetails = JSON.parse(window.localStorage.getItem('profile'))

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault()

    const guestExists = await checkIfGuestExists({
      name: inputs.guestName,
      phoneNumber: inputs.guestPhoneNumber,
      emailAddress: profileDetails?.emailAddress
    })

    if (guestExists.status === 200) {
      const res = await bookGuest(dispatch, { 
        name: inputs.guestName,
        phoneNumber: inputs.guestPhoneNumber,
        pin: inputs.pin,
        emailAddress: profileDetails?.emailAddress
      })
  
      if (res.status === 200) {
        const bookingDetails = {
          ...res.data,
          action: 'book'
        }

        window.localStorage.setItem('bookingDetails', JSON.stringify(bookingDetails))
        return navigate('/book-guest-successfully')
      }
  
      if (res.status === 400) {
        console.log(res)
        setError( { isError: true, errorMessage: res.errorMessage })
        return
      }
    }
    
    const canvas = await html2canvas(qrCodeCanvasRef.current)
    const qrCodeImage = canvas.toDataURL()

    const fileRes = await uploadImage(qrCodeImage)

    const res = await bookGuest(dispatch, { 
      bookingNumber,
      name: inputs.guestName,
      phoneNumber: inputs.guestPhoneNumber,
      qrCodeImage: `${fileRes.data?.public_id}.png`,
      pin: inputs.pin,
      emailAddress: profileDetails?.emailAddress
    })

    if (res.status === 200) {
      const bookingDetails = {
        ...res.data.guest,
        action: 'book'
      }
      
      window.localStorage.setItem('bookingDetails', JSON.stringify(bookingDetails))
      navigate('/book-guest-successfully')
    }

    if (res.status === 400) {
      console.log(res)
    }
  }
  
  // Use effect
  useEffect(() => {
    function generateRandomNumericId() {
      const timestamp = Math.floor(Date.now() / 1000)
      const random = Math.floor(Math.random() * 1000000)
    
      return `${timestamp}${random}`
    }

    const id = generateRandomNumericId()

    setBookingNumber(id)
  }, [inputs])

  useEffect(() => {
    document.title = 'Book Guest'

    window.localStorage.removeItem('bookingDetails')

    // Validate user
    async function validate() {
      const token = window.localStorage.getItem('user')
      const res = await validateUser(dispatch, { token })

      if (res?.status === 401) {
        navigate('/login')
      }
    }

    validate()

    const qrCodeStyling = new QRCodeStyling({
      width: 1000,
      height: 1000,
      data: `${bookingNumber}`,
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

    console.log(profileDetails)
  }, [bookingNumber])

  return (
    <section ref={forwardRef} id='book_guest'>
      {/* QR Code */}
      <div ref={qrCodeCanvasRef} id='qr-code'></div>

      {/* Back Button */}
      <Link 
        to={`../${initialState.routeHistory[initialState.routeHistory.length - 1]}`} 
        className='text btn'
      >
        <Back />
        <span>Back</span>
      </Link>

      {/* Heading */}
      <h1 style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}>
        Book Guest
      </h1>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className='inputFields'>
          <div className='form-group'>
            <label style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}>
              Name of Guest
              <span className='required-symbol'>*</span>
              <span className='guide'>(full name)</span>
            </label>

            <input 
              type='text'
              name='guestName'
              placeholder='Name of guest here'
              value={inputs.guestName}
              onChange={e => setInputs({ ...inputs, guestName: e.target.value })}
              required
            />
          </div>

          <div className='form-group'>
            <label style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}>
              Phone Number of Guest
              <span className='required-symbol'>*</span>
            </label>

            <input 
              type='text'
              name='guestPhoneNumber'
              placeholder='Phone number of guest here'
              value={inputs.guestPhoneNumber}
              onChange={e => setInputs({ ...inputs, guestPhoneNumber: e.target.value })}
              required
            />
          </div>

          <div className='form-group'>
            <label style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}>
              Pin
              <span className='required-symbol'>*</span>
              <span className='guide'>(to be used by guest to view their gate pass)</span>
            </label>

            <input 
              type='text'
              name='pin'
              placeholder='Pin here'
              value={inputs.pin}
              maxLength='6'
              onChange={e => setInputs({ ...inputs, pin: e.target.value })}
              required
            />
          </div>
        </div>

        <div 
          id='error-message'
          style={{ display: `${error.isError ? 'block' : 'none'}` }}
        >
          <p>
            {error.errorMessage}
          </p>
        </div>

        <input 
          type='submit' 
          value='Book'
          className='solid btn' 
        />
      </form>
    </section>
  )
}

export default BookGuest
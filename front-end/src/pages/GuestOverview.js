import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { GuestHistory } from '../pages'

import {
  useSrContext,
  INSERT_ROUTE,
  validateUser,
  bookGuest
} from '../context'

import {
  fetchGuest,
  formatDate,
  formatTime
} from '../utils'

import { Back, Copy } from '../assets/svg'

import '../css/guest_overview.css'

function GuestOverview() {
  const guestOverviewContRef = useRef(null)
  const guestHistoryContRef = useRef(null)
  const navigate = useNavigate()
  const { id } = useParams()
  const currentDate = new Date()
  const [initialState, dispatch] = useSrContext()
  const details = JSON.parse(window.localStorage.getItem('profile'))
  const [guest, setGuest] = useState({
    _id: '',
    host: '',
    name: '',
    phoneNumber: '',
    dateBooked: [],
    timeArrived: [],
    qrCodeImage: '',
    pin: '',
    urlLink: ''
  })
  const [isBtnActive, setIsBtnActive] = useState(true)

  // Navigate to Guest History
  const navigateToGuestHistory = (e) => {
    e.preventDefault()

    guestOverviewContRef.current.style.transform = 'translateX(-150px)'
    guestOverviewContRef.current.style.transition = '300ms ease'
    guestHistoryContRef.current.style.visibility = 'visible'
    guestHistoryContRef.current.style.transform = 'translateX(0)'
    guestHistoryContRef.current.style.transition = '300ms ease'
    
    setTimeout(() => {
      navigate('/guest-history')
    }, 500)
  }

  // Copy link
  const copyLink = () => {
    navigator.clipboard.writeText(guest.urlLink);
  }

  // Download QR code image
  const downloadQRCodeImage = async (publicId) => {
    const fileUrl = `https://res.cloudinary.com/dfc3s2kfc/image/upload/v1687658461/${publicId}.png`

    try {
      const response = await fetch(fileUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')

      link.href = url
      link.download = fileUrl
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading image:', error)
    }
  }

  // Rebook guest
  const rebookGuest = async (e) => {
    e.preventDefault()

    const res = await bookGuest(dispatch, { 
      name: guest.name,
      phoneNumber: guest.phoneNumber,
      pin: guest.pin,
      emailAddress: details?.emailAddress
    })

    if (res.status === 200) {
      const bookingDetails = {
        ...res.data,
        action: 'rebook'
      }

      window.localStorage.setItem('bookingDetails', JSON.stringify(bookingDetails))
      navigate('/book-guest-successfully')
    }

    if (res.status === 400) {
      console.log(res)
      return
    }
  }

  // Use effect
  useEffect(() => {
    guestHistoryContRef.current.style.position = 'absolute'
    guestHistoryContRef.current.style.top = '0'
    guestHistoryContRef.current.style.bottom = '0'
    guestHistoryContRef.current.style.left = '0'
    guestHistoryContRef.current.style.right = '0'
    guestHistoryContRef.current.style.visibility = 'hidden'
    guestHistoryContRef.current.style.transform = 'translateX(100%)'
    guestHistoryContRef.current.style.zIndex = '100'
  }, [])

  useEffect(() => {
    document.title = 'Guest Overview'

    const cookie = document.cookie?.split('; ')?.find((row) => row.startsWith('routesHistory='))?.split('=')[1]
    const routeHistory = cookie?.split(',')

    dispatch({ type: INSERT_ROUTE, payload: routeHistory })

    // Validate user
    async function validate() {
      const token = window.localStorage.getItem('user')
      const res = await validateUser(dispatch, { token })

      if (res?.status === 401) {
        navigate('/login')
      }
    }

    // Fetch guest
    async function getGuest() {
      const res = await fetchGuest({ id })
      setGuest(res.data)
      window.localStorage.setItem('guest', JSON.stringify(res.data))

      // Check if guest can be rebooked today
      var inputDate = new Date(res.data.dateBooked[res.data.dateBooked.length - 1]);
      var today = new Date();
      
      if (isNaN(inputDate)) {
        console.log('Invalid date format');
        return false;
      }

      var isSameYear = inputDate.getFullYear() === today.getFullYear();
      var isSameMonth = inputDate.getMonth() === today.getMonth();
      var isSameDay = inputDate.getDate() === today.getDate();

      if (isSameYear && isSameMonth && isSameDay) {
        setIsBtnActive(false)
      }

      console.log(res.data)
    }

    validate()
    getGuest()
  }, [])

  return (
    <>
      {/* For Animation Purpose Only */}
      <GuestHistory forwardRef={guestHistoryContRef} />

      <section ref={guestOverviewContRef} id='guest_overview'>
        {/* Back Button */}
        <Link 
          to={`../${initialState.routeHistory[initialState.routeHistory.length - 1]}`} 
          className='text btn'
        >
          <Back />
          <span>Back</span>
        </Link>

        {/* Header */}
        <header>
          <h1 style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}>
            Guest Overview
          </h1>

          <Link 
            onClick={navigateToGuestHistory}
            style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}
            className='text btn'
          >
            View History
          </Link>
        </header>

        {/* Info */}
        <div className='info'>
          <div className='info-group'>
            <label>Booking ID</label>

            <p style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}>
              {guest._id}
            </p>
          </div>

          <div className='info-group'>
            <label>Name</label>

            <p style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}>
              {guest.name}
            </p>
          </div>

          <div className='info-group'>
            <label>Last Date of Booking</label>

            <p style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}>
              {`${formatDate(guest?.dateBooked[guest?.dateBooked?.length - 1])} at ${formatTime(guest?.dateBooked[guest?.dateBooked?.length - 1])}`}
            </p>
          </div>

          <div className='info-group'>
            <label>Date of Arrival</label>

            {guest.timeArrived[guest?.timeArrived?.length - 1] === currentDate ? 
              (
                <p style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}>
                  {
                    guest?.timeArrived[guest?.timeArrived?.length - 1] === currentDate ? 
                      `${formatDate(guest?.dateBooked[guest?.dateBooked?.length - 1])} at ${formatTime(guest?.dateBooked[guest?.dateBooked?.length - 1])}` 
                        : 
                      'Not yet arrived'
                  }
                </p>
              ) : (
                <p style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}>
                  Not arrived
                </p>
              )
            }
          </div>

          <div className='info-group'>
            <label>URL Link</label>

            <Link 
              to='#'
              style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }} 
            >
              {guest.urlLink.slice(0, 30)}

              <button onClick={copyLink}>
                <Copy color='#5CB950' />
              </button>
            </Link>
          </div>
        </div>

        {/* Actions */}
        <div className='actions'>
          <button 
            onClick={() => downloadQRCodeImage(guest.qrCodeImage.match(/^([^.]+)/)[1])} 
            className='outline btn'
          >
            Download QR
          </button>

          <button 
            style={{ display: `${isBtnActive ? 'block' : 'none'}` }} 
            onClick={rebookGuest} 
            className='solid btn'
          >
            Rebook
          </button>
        </div>
      </section>
    </>
  )
}

export default GuestOverview
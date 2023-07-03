import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { 
  useSrContext,
  INSERT_ROUTE,
  SET_ACTIVE_PAGE,
  validateUser
} from '../../context'

import { Back } from '../../assets/svg'

import '../../css/my_gate_pass.css'

function MyGatePass() {
  const navigate = useNavigate()
  const [initialState, dispatch] = useSrContext()
  const [greetText, setGreetText] = useState('')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [currentTime, setCurrentTime] = useState(new Date())

  // Format date
  const formattedDate = currentDate.toLocaleDateString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })

  // Use effect
  useEffect(() => {
    document.title = 'My Gate Pass'

    const routeHistory = initialState.routeHistory
    dispatch({ type: INSERT_ROUTE, payload: [...routeHistory, 'my-gate-pass'] })
    dispatch({ type: SET_ACTIVE_PAGE, payload: 'myGatePass' })

    // Validate user
    async function validate() {
      const token = window.localStorage.getItem('user')
      const res = await validateUser(dispatch, { token })

      if (res?.status === 401) {
        navigate('/login')
      }
    }

    const determineTimeOfDay = () => {
      const currentHour = new Date().getHours()
      var greetText

      if (currentHour >= 5 && currentHour < 12) {
        greetText = 'Good morning'
      } else if (currentHour >= 12 && currentHour < 18) {
        greetText = 'Good afternoon'
      } else {
        greetText = 'Good evening'
      }

      setGreetText(greetText)
    }

    validate()
    determineTimeOfDay()

    const interval = setInterval(() => {
      setCurrentDate(new Date())
      setCurrentTime(new Date())
    }, 1000);

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <section id='my_gate_pass'>
      {/* Back Button */}
      <Link to='/home' className='text btn'>
        <Back />
        <span>Back</span>
      </Link>

      <div className='container'>
        {/* Profile Picture */}
        <div  
          style={{ backgroundImage: `url('https://res.cloudinary.com/dfc3s2kfc/raw/upload/v1687096624/${initialState.user?.profile?.picture[0]?.name}')` }}
          className='profilePicture'
        >
        </div>

        {/* Name & Address */}
        <div className='nameAndAddress'>
          <h1 
            style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }} 
            className='name'
          >
            {`${initialState.user?.profile?.firstName} ${initialState.user?.profile?.lastName}`}
          </h1>
          
          <p className='address'>{initialState.user?.profile?.address}</p>
        </div>

        {/* QR Code */}
        <div 
          style={{ backgroundImage: `url('https://res.cloudinary.com/dfc3s2kfc/image/upload/v1687096624/${initialState.user?.profile?.qrCodeImage}')` }}
          className='qrCodeImage'
        >
        </div>

        {/* Greeting */}
        <div className='greetings'>
          <p className='greet'>{`${greetText}!`}</p>
          <p className='time'>{currentTime.toLocaleTimeString()}</p>
          <p className='date'>{formattedDate}</p>
        </div>
      </div>
    </section>
  )
}

export default MyGatePass
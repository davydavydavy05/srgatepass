import React, { useEffect, useState } from 'react'
import OtpInput from 'react-otp-input'
import { Link, useNavigate } from 'react-router-dom'

import { Timer } from '../../components'

import {
  useSrContext,
  COUNTDOWN,
  SET_COUNTDOWN_START,
  INSERT_ROUTE,
  fetchAnnouncements
} from '../../context'

import { 
  renderer, 
  requestOtp,
  verifyOtp 
} from '../../utils'

import {
  BrandLogo,
  Back
} from '../../assets/svg'

import '../../css/verification.css'

function Verification() {
  const navigate = useNavigate()
  const [initialState, dispatch] = useSrContext()
  const [otp, setOtp] = useState('');
  const [error, setError] = useState({ isError: false, errorMessage: '' })

  // Resend OTP code
  const resendOtpCode = async (e) => {
    e.preventDefault()
    dispatch({ type: SET_COUNTDOWN_START, payload: true })
    await requestOtp({ action: 'verification', receiver: initialState.user.emailAddress })
  }

  // Handle change
  const handleChange = (otp) => setOtp(otp)

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault()

    const res = await verifyOtp({ emailAddress: initialState.user?.emailAddress, otpCode: otp })
    
    console.log(initialState.user)

    if (res?.status === 200) {
      if (initialState.keepMeLoggedIn) {
        window.localStorage.setItem('loggedIn', true)
        window.localStorage.setItem('profile', JSON.stringify({ ...initialState.user?.profile, notifications: initialState.user?.notifications }))
      }

      if (initialState.action === 'Log in') {
        window.localStorage.setItem('user', initialState.user?.token)
        window.localStorage.setItem('onboarding', true)

        console.log(initialState.user)

        if (initialState.user?.isRegistrationComplete) {
          if (initialState.user?.isApprove) {
            window.localStorage.setItem('profile', JSON.stringify({ ...initialState.user?.profile, notifications: initialState.user?.notifications }))
            console.log(initialState.user)
            await fetchAnnouncements(dispatch, {})
            return navigate('/home')
          } else {
            return navigate('/account-registration-pending')
          }
        }

        return navigate('/onboarding-step-1')
      }

      if (initialState.action === 'Register') {
        window.localStorage.setItem('registration', true)
        return navigate('/registration-successfully')
      }
    }

    if (res?.status === 400) {
      setError( { isError: true, errorMessage: res.errorMessage + ' ' })
    }
  }

  // Use effect
  useEffect(() => {
    document.title = 'Verification'

    console.log(initialState)

    const cookie = document.cookie?.split('; ')?.find((row) => row.startsWith('routesHistory='))?.split('=')[1]
    const routeHistory = cookie?.split(',')

    dispatch({ type: INSERT_ROUTE, payload: routeHistory })
    
    if (!window.localStorage.getItem('verification')) {
      navigate('/login')
    }

    if (localStorage.getItem('otp_resend_countdown') != null) {
      dispatch({ type: SET_COUNTDOWN_START, payload: true })
    }
  }, [])
  
  return (
    <section id='verification'>
      {/* Brand Logo */}
      <img src={BrandLogo} alt='Brand Logo' />

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
          Verification
        </h1>
        
        <p>Check your email address and input the OTP code to login.</p>
      </header>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}>
            OTP Code
            <span className='required-symbol'>*</span>
          </label>

          <div>
            <OtpInput
              value={otp}
              onChange={handleChange}
              inputStyle={`${error.isError ? 'inputStyleError' : 'inputStyle'}`}
              numInputs={6}
              separator={<span></span>}
              renderInput={(props) => <input {...props} />}
            />
          </div>
        </div>

        <p 
          className='resendCodeLink'
          style={{ color: `${error.isError && '#C01F28'}` }}
        >
          {error.isError && error.errorMessage} 
          Didn't get the code? 
          
          {initialState.countdownStart
            ?
          <Timer 
            countdownName='otp_resend_countdown' 
            delay={COUNTDOWN} 
            renderer={renderer} 
            start={initialState.countdownStart} 
            dispatch={dispatch}
          /> 
            : 
          <a onClick={resendOtpCode} className='text btn'>Resend it now.</a>
          }
        </p>

        <input type='submit' value={initialState.action} className='solid btn' />
      </form>
    </section>
  )
}

export default Verification
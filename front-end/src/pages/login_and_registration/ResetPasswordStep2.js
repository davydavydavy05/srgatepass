import React, { useEffect, useState } from 'react'
import OtpInput from 'react-otp-input'
import { Link, useNavigate } from 'react-router-dom'

import { Timer } from '../../components/index'

import {
  useSrContext,
  COUNTDOWN,
  SET_COUNTDOWN_START
} from '../../context'

import { 
  renderer, 
  requestOtp, 
  verifyOtp 
} from '../../utils'

import {
  BrandLogo,
  ArrowRight,
  Back
} from '../../assets/svg'

import '../../css/reset_password.css'

function ResetPasswordStep2() {
  const [initialState, dispatch] = useSrContext()
  const [otp, setOtp] = useState('');
  const [error, setError] = useState({ isError: false, errorMessage: '' })

  const navigate = useNavigate()

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

    if (res?.status === 200) {
      navigate('/reset-password')
    }

    if (res?.status === 400) {
      setError( { isError: true, errorMessage: res.errorMessage + ' ' })
    }
  }

  // Use effect
  useEffect(() => {
    document.title = 'Reset Password'

    if (!window.localStorage.getItem('verification')) {
      navigate('/login')
    }

    if (!window.localStorage.getItem('forgotPassword')) {
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
      <Link to={'/forgot-password'} className='text btn'>
        <Back />
        <span>Back</span>
      </Link>

      {/* Header */}
      <header>
        <h1 style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}>
          Reset Password
        </h1>

        <p>Enter the OTP code we sent to <span>{initialState.user?.emailAddress}</span>.</p>
      </header>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label>
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

        <div className='btn-container'>
          <input type='submit' value='Continue' className='solid btn' />
          <ArrowRight color='#FFF' />
        </div>
      </form>
    </section>
  )
}

export default ResetPasswordStep2
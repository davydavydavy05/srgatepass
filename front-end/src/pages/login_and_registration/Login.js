import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import {
  useSrContext,
  SET_ACTION,
  KEEP_ME_LOGGED_IN,
  INSERT_ROUTE,
  validateUser,
  logInUser
} from '../../context'

import { requestOtp } from '../../utils'

import { 
  BrandLogo,
  ArrowRight,
  EyeOff,
  EyeOn
} from '../../assets/svg'

import '../../css/login_and_registration.css'
import '../../css/style.css'

function Login() {
  const navigate = useNavigate()
  const [initialState, dispatch] = useSrContext()
  const [credentials, setCredentials] = useState({ emailAddress: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState({ isError: false, errorMessage: '' })
  const [keepMeLoggedIn, setKeepMeLoggedIn] = useState(false)

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault()

    const res = await logInUser(dispatch, { emailAddress: credentials.emailAddress, password: credentials.password })
    dispatch({ type: SET_ACTION, payload: 'Log in' })

    if (res.status === 200) {
      if (keepMeLoggedIn) {
        dispatch({ type: KEEP_ME_LOGGED_IN })
      }

      console.log(res)
      window.localStorage.setItem('verification', true)

      await requestOtp({ action: 'log in', receiver: credentials.emailAddress })
      
      navigate('/verification')
    }

    if (res.status === 400) {
      setError( { isError: true, errorMessage: res.errorMessage })
      setCredentials({ ...credentials, password: '' })
    }
  }
  
  // Use effect
  useEffect(() => {
    document.title = 'Login'
    
    document.cookie = 'routesHistory=login'

    // Clear storage
    window.localStorage.removeItem('verification')
    window.localStorage.removeItem('registration')
    window.localStorage.removeItem('onboarding')
    window.localStorage.removeItem('forgotPassword')
    window.localStorage.removeItem('applicationId')
    window.localStorage.removeItem('application')
    window.localStorage.removeItem('guest')
    window.localStorage.removeItem('bookingDetails')

    const routeHistory = initialState.routeHistory
    
    dispatch({ type: INSERT_ROUTE, payload: [...routeHistory, 'login'] })

    // Validate user
    async function validate() {
      const loggedIn = window.localStorage.getItem('loggedIn')
      const token = window.localStorage.getItem('user')

      if (loggedIn) {
        const res = await validateUser(dispatch, { token })

        if (res?.status === 200) {
          document.cookie = `token=${token}; path=/`
          navigate('/home')
        }
      } else {
        document.cookie = 'token=; Max-Age=0; secure'
      }
    }

    validate()
  }, [])

  return (
    <section id='login_and_registration'>
      {/* Brand Logo */}
      <img src={BrandLogo} alt='Brand Logo' />

      {/* Header */}
      <header>
        <h1 style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}>
          Welcome
        </h1>
        
        <p>Get started by entering the email address you registered.</p>
      </header>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className='inputFields'>
          <div className='form-group'>
            <label style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}>
              Email Address
            </label>
            
            <input 
              type='email'
              name='emailAddress'
              placeholder='Your email address here'
              value={credentials.emailAddress}
              onChange={e => setCredentials({ ...credentials, emailAddress: e.target.value })}
              style={{ borderBottom: `${error.isError &&  '1px solid #C01F28'}` }}
            />
          </div>

          <div className='form-group'>
            <label style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}>
              Password
            </label>
            
            <div 
              className='input-field'
              style={{ borderBottom: `${error.isError && '1px solid #C01F28'}` }}
            >
              <input 
                type={showPassword ? 'text' : 'password'}
                name='password'
                placeholder='Your password here'
                value={credentials.password}
                onChange={e => setCredentials({ ...credentials, password: e.target.value })}
              />

              <a onClick={() => setShowPassword(!showPassword)} className='suffix'>
                {showPassword ? <EyeOff /> : <EyeOn />}
              </a>
            </div>
          </div>
        </div>

        <div>
          <div className='form-check'>
            <input 
              type='checkbox' 
              checked={keepMeLoggedIn}
              onChange={() => setKeepMeLoggedIn(!keepMeLoggedIn)}
            />
            <p>Keep me sign in</p>
          </div>

          <Link to='/forgot-password' style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}>
            Forgot Password
          </Link>
        </div>

        <div 
          id='error-message'
          style={{ display: `${error.isError ? 'block' : 'none'}` }}
        >
          <p>
            {error.errorMessage} If you don’t remember your credentials,
            <Link to='/forgot-password' className='text btn'>reset it now.</Link>
          </p>
        </div>

        <div className='btn-container'>
          <input type='submit' value='Continue' className='solid btn' />
          <ArrowRight color='#FFF' />
        </div>

        <div className='registrationLink'>
          <p>Don't have an account? <Link to='/registration'>Register for free!</Link></p>
        </div>
      </form>
    </section>
  )
}

export default Login
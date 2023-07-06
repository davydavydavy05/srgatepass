import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import {
  useSrContext,
  SET_ACTION,
  INSERT_ROUTE,
  validateUser,
  registerUser
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

function Registration() {
  const navigate = useNavigate()
  const [initialState, dispatch] = useSrContext()
  const [credentials, setCredentials] = useState({ emailAddress: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState({ isError: false, errorMessage: '' })

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault()

    const res = await registerUser(dispatch, { type: 'resident', emailAddress: credentials.emailAddress, password: credentials.password })
    dispatch({ type: SET_ACTION, payload: 'Register' })

    console.log(res)

    if (res.status === 201) {
      console.log(res)
      window.localStorage.setItem('verification', true)
      await requestOtp({ action: 'registration', receiver: credentials.emailAddress })
      navigate('/verification')
    }

    if (res.status === 400) {
      setError( { isError: true, errorMessage: res.errorMessage })
    }
  }

  // Use effect
  useEffect(() => {
    document.title = 'Registration'

    localStorage.removeItem('verification')

    const cookie = document.cookie?.split('; ')?.find((row) => row.startsWith('routesHistory='))?.split('=')[1]
    const routeHistory = cookie?.split(',')

    document.cookie = `routesHistory=${routeHistory}`
    routeHistory.push('registration')
    
    dispatch({ type: INSERT_ROUTE, payload: routeHistory })

    // Validate user
    async function validate() {
      const loggedIn = window.localStorage.getItem('loggedIn')

      if (loggedIn) {
        const res = await validateUser()

        if (res?.status === 200) {
          navigate('/home')
        }
      } else {
        document.cookie = 'token=; Max-Age=0;secure'
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
          Register
        </h1>
        
        <p>Start your journey with us! Create your account for free.</p>
      </header>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className='inputFields'>
          <div className='form-group'>
            <label style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}>
              Email Address
              <span className='required-symbol'>*</span>
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
              <span className='required-symbol'>*</span>
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

        <div 
          id='error-message'
          style={{ display: `${error.isError ? 'block' : 'none'}` }}
        >
          <p>{error.errorMessage}</p>
        </div>

        <div className='btn-container'>
          <input type='submit' value='Continue' className='solid btn' />
          <ArrowRight color='#FFF' />
        </div>

        <div className='loginLink'>
          <p>Already have an account? <Link to='/login'>Log in now!</Link></p>
        </div>
      </form>
    </section>
  )
}

export default Registration
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { 
  useSrContext, 
  UPDATE_PROFILE_DETAILS
} from '../../context'

import { checkResidentUsername, logOut } from '../../utils'

import {
  BrandLogo,
  ArrowRight,
  Calendar,
  ChevronDown
} from '../../assets/svg'

import '../../css/onboarding.css'
import '../../css/style.css'

function OnBoardingStep1() {
  const navigate = useNavigate()
  const [initialState, dispatch] = useSrContext()
  const today = new Date().toISOString().split('T')[0]
  const [inputs, setInputs] = useState({
    firstName: '',
    lastName: '',
    gender: 'male',
    birthdate: today,
    phoneNumber: '',
    username: ''
  })
  const [error, setError] = useState({ isError: false, errorMessage: '' })
  const [headingFontSize, setHeadingFontSize] = useState(40)
  const [paragraphFontSize, setParagraphFontSize] = useState(20)

  // Hande submit
  const handleSubmit = async (e) => {
    e.preventDefault()

    const res = await checkResidentUsername({ username: inputs.username })

    if (res.status === 200) {
      dispatch({ type: UPDATE_PROFILE_DETAILS, payload: inputs })
      navigate('/onboarding-step-2')
    }

    if (res.status === 400) {
      setError({ isError: true, errorMessage: res.errorMessage })
    }
  }

  // Handle scroll
  const handleScroll = () => {
    const ghostHeader = document.getElementById('ghostHeader')
    const brandLogo = document.getElementById('brandLogo')
    const header = document.getElementById('header')
    const progressBar = document.getElementById('progress-bar')
    const bars = document.querySelectorAll('.bar')

    if (window.scrollY > 64) {
      setHeadingFontSize(24)
      setParagraphFontSize(16)
      
      ghostHeader.style.visibility = 'visible'
      brandLogo.style.marginBottom = '41.15px'

      progressBar.style.position = 'fixed'
      progressBar.style.top = '30px'
      progressBar.style.marginTop = '0'

      header.style.marginTop = '0'
      
      bars.forEach(bar => {
        bar.style.width = '40px'
      })

      header.style.marginTop = '40px'
      header.style.marginBottom = '32px'
    }
    
    if (window.scrollY < 64) {
      setHeadingFontSize(40)
      setParagraphFontSize(20)

      ghostHeader.style.visibility = 'hidden'
      brandLogo.style.marginBottom = '80px'
      
      progressBar.style.position = 'relative'
      progressBar.style.top = '0'
      progressBar.style.left = '0'
      progressBar.style.marginTop = '64px'

      header.style.marginTop = '0'
      header.style.marginBottom = '0'
    }
  }
  
  // Use effect
  useEffect(() => {
    document.title = 'On Boarding'

    if (!window.localStorage.getItem('onboarding')) {
      navigate('/login')
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <section id='onboarding'>
      {/* Ghost Back And Progress Bar */}
      <div id='ghostHeader'></div>

      {/* Brand Logo */}
      <img src={BrandLogo} alt='Brand Logo' id='brandLogo' />

      {/* Header */}
      <header id='header'>
        <h1 style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold', fontSize: headingFontSize }}>
          You're almost there!
        </h1>

        <p style={{ fontSize: `${paragraphFontSize}px` }}>This won't take long so don't worry.</p>
      </header>

      {/* Progress Bar */}
      <div id='progress-bar' className='progress-bar'>
        <span className='bar active'></span>
        <span className='bar'></span>
        <span className='bar'></span>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <h2 style={{ fontFamily: initialState.isiOSDevice ? 'SFProDisplay-Medium' : 'SFProDisplay-Bold' }}>
          Personal Information
        </h2>

        <div className='inputFields'>
          <div className='form-group'>
            <label style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}>
              First Name 
              <span className='required-symbol'>*</span>
            </label>

            <input 
              type='text'
              name='forename'
              placeholder='Your first name here'
              value={inputs.firstName}
              onChange={e => setInputs({ ...inputs, firstName: e.target.value })}
              required
            />
          </div>

          <div className='form-group'>
            <label style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}>
              Last Name 
              <span className='required-symbol'>*</span>
            </label>

            <input 
              type='text'
              name='surname'
              placeholder='Your last name here'
              value={inputs.lastName}
              onChange={e => setInputs({ ...inputs, lastName: e.target.value })}
              required
            />
          </div>
          
          <div className='form-group'>
            <label style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}>
              Gender
              <span className='required-symbol'>*</span>
            </label>

            <div className='select input-field'>
              <select 
                name='gender'
                onChange={e => setInputs({ ...inputs, gender: e.target.value })}
              >
                <option value='Male'>Male</option>
                <option value='Female'>Female</option>
                <option value='Other'>Other</option>
              </select>

              <span className='suffix'>
                <ChevronDown color='#99A8BA' />
              </span>
            </div>
          </div>

          <div className='form-group'>
            <label style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}>
              Date of Birth 
              <span className='required-symbol'>*</span>
            </label>

            <div className='date input-field'>
              <input 
                type='date'
                name='birthdate'
                value={inputs.birthdate}
                onChange={e => setInputs({ ...inputs, birthdate: e.target.value })}
                required
              />

              <span className='suffix'>
                <Calendar />
              </span>
            </div>
          </div>

          <div className='form-group'>
            <label style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}>
              Phone Number 
              <span className='required-symbol'>*</span>
            </label>

            <input 
              type='text'
              name='phoneNumber'
              placeholder='Your phone number here'
              value={inputs.phoneNumber}
              maxLength='11'
              onChange={e => setInputs({ ...inputs, phoneNumber: e.target.value })}
              required
            />
          </div>

          <div className='form-group'>
            <label style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}>
              Username
              <span className='required-symbol'>*</span>
            </label>

            <input 
              type='text'
              name='username'
              placeholder='Your username here'
              value={inputs.username}
              onChange={e => setInputs({ ...inputs, username: e.target.value })}
              style={{ borderBottom: `${error.isError && '1px solid #C01F28'}` }}
              required
            />
          </div>
        </div>

        <div 
          id='error-message'
          style={{ display: `${error.isError ? 'block' : 'none'}` }}
        >
          <p>{error.errorMessage}</p>
        </div>

        <div className='actions'>
          <div className='btn-container'>
            <input type='submit' value='Continue' className='solid btn' />
            <ArrowRight color='#FFF' />
          </div>

          <Link onClick={logOut} className='outline btn'>Try it later and log out</Link>
        </div>
      </form>

      <p className='privacyPolicy'>
        Your information will remain confidential and will only be used for verification. To see how we store and use this data, check our <Link to='#'>Privacy Policy.</Link>
      </p>
    </section>
  )
}

export default OnBoardingStep1
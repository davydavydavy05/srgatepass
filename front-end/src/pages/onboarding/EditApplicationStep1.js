import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { 
  useSrContext,
  UPDATE_PROFILE_DETAILS,
  INSERT_ROUTE,
  validateUser
} from '../../context'

import { checkResidentUsername } from '../../utils'

import {
  ArrowRight,
  Back,
  Calendar,
  ChevronDown
} from '../../assets/svg'

import '../../css/edit_application.css'

function EditApplicationStep1({ forwardRef }) {
  const navigate = useNavigate()
  const [initialState, dispatch] = useSrContext()
  const details = JSON.parse(window.localStorage.getItem('application'))
  const [inputs, setInputs] = useState({
    firstName: details?.firstName,
    lastName: details?.lastName,
    gender: details?.gender,
    birthdate: details?.birthdate,
    phoneNumber: details?.phoneNumber,
    username: details?.username
  })
  const [error, setError] = useState({ isError: false, errorMessage: '' })

  // Hande submit
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (inputs.username !== initialState.user?.profile?.username) {
      const res = await checkResidentUsername({ username: inputs.username })

      if (res.status === 200) {
        dispatch({ type: UPDATE_PROFILE_DETAILS, payload: inputs })
        navigate('/edit-application-step-2')
      }

      if (res.status === 400) {
        setError({ isError: true, errorMessage: res.errorMessage })
      }
    }
    
    dispatch({ type: UPDATE_PROFILE_DETAILS, payload: inputs })
    navigate('/edit-application-step-2')
  }

  // Handle scroll
  const handleScroll = () => {
    const header = document.getElementById('header')

    if (window.scrollY > 64) {
      header.style.boxShadow = '0px 4px 16px rgba(139, 139, 139, 0.25)'
    }
    
    if (window.scrollY < 64) {
      header.style.boxShadow = 'none'
    }
  }

  // Use effect
  useEffect(() => {
    document.title = 'Edit Application'

    const routeHistory = initialState.routeHistory
    dispatch({ type: INSERT_ROUTE, payload: [...routeHistory, 'edit-application-step-1'] })

    // Validate user
    async function validate() {
      const token = window.localStorage.getItem('user')
      const res = await validateUser(dispatch, { token })

      if (res?.status === 401) {
        navigate('/login')
      }
    }

    validate()

    console.log(initialState)

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <section ref={forwardRef} id='edit_application'>
      {/* Header */}
      <header id='header'>
        <div>
          <Link to='/my-application' className='text btn'>
            <Back />
            <span>Back</span>
          </Link>

          <div id='progress-bar' className='progress-bar'>
            <span className='active bar'></span>
            <span className='bar'></span>
            <span className='bar'></span>
          </div>
        </div>
      </header>

      {/* Heading */}
      <h1 style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}>
        Edit Application
      </h1>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <h2 style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}>
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
              name='firstName'
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
              name='lastName'
              placeholder='Your last name here'
              value={inputs.lastName}
              onChange={e => setInputs({ ...inputs, lastName: e.target.value })}
              required
            />
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
              Gender 
              <span className='required-symbol'>*</span>
            </label>

            <div className='select input-field'>
              <select 
                name='gender'
                onChange={e => setInputs({ ...inputs, gender: e.target.value })}
              >
                <option value='male'>Male</option>
                <option value='female'>Female</option>
                <option value='other'>Other</option>
              </select>

              <span className='suffix'>
                <ChevronDown color='#99A8BA' />
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

          <Link to='/my-application' className='outline btn'>Cancel</Link>
        </div>
      </form>
    </section>
  )
}

export default EditApplicationStep1
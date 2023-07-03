import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { 
  useSrContext,
  UPDATE_PROFILE_DETAILS,
  INSERT_ROUTE,
  validateUser
} from '../../context'

import { ArrowRight, Back } from '../../assets/svg'

import '../../css/edit_application.css'

function EditApplicationStep2() {
  const navigate = useNavigate()
  const [initialState, dispatch] = useSrContext()
  const details = JSON.parse(window.localStorage.getItem('application'))
  const [inputs, setInputs] = useState({ address: details?.address })

  // Hande submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch({ type: UPDATE_PROFILE_DETAILS, payload: inputs })
    navigate('/edit-application-step-3')
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
    document.title = 'Edit Profile'

    console.log(initialState)

    const routeHistory = initialState.routeHistory
    dispatch({ type: INSERT_ROUTE, payload: [...routeHistory, 'edit-application-step-2'] })

    // Validate user
    async function validate() {
      const token = window.localStorage.getItem('user')
      const res = await validateUser(dispatch, { token })

      if (res?.status === 401) {
        navigate('/login')
      }
    }

    validate()

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <section id='edit_application'>
      {/* Header */}
      <header id='header'>
        <div>
          <Link to='/edit-application-step-1' className='text btn'>
            <Back />
            <span>Back</span>
          </Link>

          <div id='progress-bar' className='progress-bar'>
            <span className='active bar'></span>
            <span className='active bar'></span>
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
          Property Information
        </h2>

        <div className='inputFields'>
          <div className='form-group'>
            <label style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}>
              Home Address 
              <span className='required-symbol'>*</span>
            </label>

            <input 
              type='text'
              placeholder='Your home address here'
              value={inputs.address}
              onChange={e => setInputs({ ...inputs, address: e.target.value })}
              required
            />
          </div>
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

export default EditApplicationStep2
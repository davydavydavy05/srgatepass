import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import {
  useSrContext
} from '../../context'

import { 
  BadgeCheck
} from '../../assets/svg'

import '../../css/status.css'
import '../../css/style.css'

function OnBoardingSuccessfully() {
  const navigate = useNavigate()
  const [initialState] = useSrContext()
  
  // Use effect
  useEffect(() => {
    document.title = 'On Boarding Successfully'

    if (!window.localStorage.getItem('onboarding')) {
      navigate('/login')
    }
  }, [])

  return (
    <section id='status'>
      <img src={BadgeCheck} alt='Badge' />

      <div>
        <h1 style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}>
          Your request to register your profile has been sent!
        </h1>
        
        <p>Thank you! Your request will be reviewed by the admin. Just wait for a while and you will receive a text message and email for the response of your request.</p>
      </div>

      <div className='actions'>
        <Link to='#' className='solid btn'>Edit application</Link>
        <Link to='/login' className='outline btn'>Log out</Link>
      </div>
    </section>
  )
}

export default OnBoardingSuccessfully
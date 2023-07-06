import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import {
  useSrContext
} from '../../context'

import { 
  BadgeAmazed
} from '../../assets/svg'

import '../../css/status.css'

function AccountRegistrationSuccessfully() {
  const navigate = useNavigate()
  const [initialState] = useSrContext()

  // Use effect
  useEffect(() => {
    document.title = 'Account Registration Successfully'

    if (!window.localStorage.getItem('onboarding')) {
      navigate('/login')
    }
  }, [])
  
  return (
    <section id='status'>
      {/* Bage */}
      <img src={BadgeAmazed} alt='Badge' />

      {/* Heading & Paragraph */}
      <div>
        <h1 style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}>
          You’re ready to go!
        </h1>
        
        <p>Your request to register your account has been approved by the admin. Welcome!</p>
      </div>

      {/* Action */}
      <Link to='/home' className='solid btn'>Continue to homepage</Link>
    </section>
  )
}

export default AccountRegistrationSuccessfully
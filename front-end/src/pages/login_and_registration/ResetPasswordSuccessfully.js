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

function ResetPasswordSuccessfully() {
  const navigate = useNavigate()
  const [initialState] = useSrContext()

  // Use effect
  useEffect(() => {
    document.title = 'Reset Password Successfully'

    if (!window.localStorage.getItem('forgotPassword')) {
      navigate('/login')
    }
  }, [])

  return (
    <section id='status'>
      {/* Badge */}
      <img src={BadgeCheck} alt='Badge' />

      {/* Heading & Paragraph */}
      <div>
        <h1 style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}>
          Your password has been reset successfully
        </h1>
        
        <p>Click the button below to proceed to login.</p>
      </div>

      {/* Action */}
      <Link to='/login' className='solid btn'>Continue to login</Link>
    </section>
  )
}

export default ResetPasswordSuccessfully
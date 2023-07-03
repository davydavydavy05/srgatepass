import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useSrContext } from '../../context'

import { fetchApplication } from '../../utils'

import { 
  BadgeHappy
} from '../../assets/svg'

import '../../css/status.css'
import '../../css/style.css'

function AccountRegistrationPending() {
  const navigate = useNavigate()
  const [initialState] = useSrContext()

  // Use effect
  useEffect(() => {
    document.title = 'Account Registration Pending'

    if (!window.localStorage.getItem('onboarding')) {
      navigate('/login')
    }

    // Fetch application
    async function getApplication() {
      initialState.user?.id && window.localStorage.setItem('applicationId', JSON.stringify(initialState.user?.id))
      const res = await fetchApplication({ userId: initialState.user?.id || JSON.parse(window.localStorage.getItem('applicationId')) })
      window.localStorage.setItem('application', JSON.stringify(res.data))
    }

    getApplication()
    console.log(initialState.user?.id)
  }, [])

  return (
    <section id='status'>
      <img src={BadgeHappy} alt='Badge' />

      <div>
        <h1 style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}>
          Your request to register your profile is pending!
        </h1>
        
        <p>Thank you! We're in the process of creating your account. Just wait for a while and we will notify you for the response of your request.</p>
      </div>

      <div className='actions'>
        <Link to='/my-application' className='solid btn'>View application</Link>
        <Link to='/login' className='outline btn'>Log out</Link>
      </div>
    </section>
  )
}

export default AccountRegistrationPending
import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { 
  useSrContext,
  INSERT_ROUTE,
  validateUser
} from '../../context'

import { 
  BadgeHappy
} from '../../assets/svg'

import '../../css/status.css'

function EditApplicationPending() {
  const navigate = useNavigate()
  const [initialState, dispatch] = useSrContext()

  // Handle click
  const handleClick = () => {
    window.location.href = window.location.href
    window.location.assign('/my-application')
  }

  // Use effect
  useEffect(() => {
    document.title = 'Editing Application Pending'

    const routeHistory = initialState.routeHistory
    dispatch({ type: INSERT_ROUTE, payload: [...routeHistory, 'edit-application-step-pending'] })

    // Validate user
    async function validate() {
      const token = window.localStorage.getItem('user')
      const res = await validateUser(dispatch, { token })

      if (res?.status === 401) {
        navigate('/login')
      }
    }

    validate()
  }, [])

  return (
    <section id='status'>
      {/* Badge */}
      <img src={BadgeHappy} alt='Badge' />

      {/* Heading & Paragraph */}
      <div>
        <h1 style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}>
          Your request to edit your application has been sent!
        </h1>
        
        <p>Thank you! Your request will be reviewed by the admin. Just wait for a while and you will receive a text message and email for the response of your request.</p>
      </div>

      {/* Action */}
      <button onClick={handleClick} className='solid btn'>Finish</button>
    </section>
  )
}

export default EditApplicationPending
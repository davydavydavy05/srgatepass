import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

import { useSrContext } from '../context'

import { 
  BadgeSad
} from '../assets/svg'

import '../css/status.css'
import '../css/style.css'

function PageNotFound() {
  const [initialState, dispatch] = useSrContext()
  
  // Use effect
  useEffect(() => {
    document.title = 'Page Not Found'
  }, [])

  return (
    <section id='status'>
      <img src={BadgeSad} alt='Badge' />

      <div>
        <h1 style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}>
          Oops! Page not found
        </h1>
        
        <p>The page you are looking for doesn't exist or have been removed.</p>
      </div>

      <div className='actions'>
        <Link to='/login' className='solid btn'>Go back</Link>
      </div>
    </section>
  )
}

export default PageNotFound
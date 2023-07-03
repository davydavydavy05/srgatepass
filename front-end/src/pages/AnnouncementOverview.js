import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { 
  useSrContext, 
  INSERT_ROUTE,
  validateUser 
} from '../context'

import { 
  fetchAnnouncement,
  formatDate,
  formatTime
} from '../utils'

import {
  Back,
  Pin
} from '../assets/svg'

import '../css/announcement_overview.css'

function AnnouncementOverview() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [initialState, dispatch] = useSrContext()
  const [announcement, setAnnouncement] = useState({
    heading: '',
    body: '',
    datePosted: '',
    isPin: ''
  })
  
  // Use effect
  useEffect(() => {
    document.title = 'Announcement Overview'

    // Set the height of images
    // const imagesContainer = document.getElementsByClassName('imageContainer')
    // const width = parseInt(document.getElementById('images').offsetWidth) / 2
    
    // for (let i = 0; i < imagesContainer.length; i++) {
    //   imagesContainer[i].style.height = `${width}px`
    // }

    const cookie = document.cookie?.split('; ')?.find((row) => row.startsWith('routesHistory='))?.split('=')[1]
    const routeHistory = cookie?.split(',')

    console.log(routeHistory)

    document.cookie = `routesHistory=${routeHistory}`
    routeHistory[routeHistory.length - 1] !== `announcement-overview/${id}` && routeHistory.push(`announcement-overview/${id}`)
    document.cookie = `routesHistory=${routeHistory}`
    
    dispatch({ type: INSERT_ROUTE, payload: routeHistory })

    // Validate user
    async function validate() {
      let token = window.localStorage.getItem('user')
      let res = await validateUser(dispatch, { token })

      if (res?.status === 401) {
        navigate('/login')
      }
    }

    // Fetch announcement
    async function getAnnouncement() {
      const res = await fetchAnnouncement({ _id: id })
      setAnnouncement(res.data)
    }

    validate()
    getAnnouncement()
  }, [])

  return (
    <section id='announcement_overview'>
      <div className='container'>
        {/* Back Button */}
        <Link 
          to={`../${initialState.routeHistory[initialState.routeHistory.length - 2]}`} 
          className='text btn'
        >
          <Back />
          <span>Back</span>
        </Link>

        {/* Header */}
        <header>
          <h1 style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}>
            Announcement
          </h1>

          <div className='pin'>
            {announcement.isPin && <Pin />}
          </div>
        </header>

        {/* Content */}
        <div className='content'>
          <div className='titleAndDate'>
            <h2 
              style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}
              className='title'
            >
              {announcement.heading.length > 35 ? `${announcement.heading.substring(0, 35)}...` : announcement.heading}
            </h2>

            <p className='date'>
              {`${formatDate(announcement.datePosted)} at ${formatTime(announcement.datePosted)}`}
            </p>
          </div>

          <p>
            {announcement.body}
          </p>

          {/* <div id='images' className='images'>
            <div className='imageContainer'></div>
            <div className='imageContainer'></div>
          </div> */}
        </div>
      </div>
    </section>
  )
}

export default AnnouncementOverview
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import io from 'socket.io-client'

import { 
  useSrContext, 
  INSERT_ROUTE,
  SET_ACTIVE_PAGE,
  validateUser
} from '../context'

import { 
  formatDate, 
  formatTime,
  markNotificationAsRead 
} from '../utils'

import { domain } from '../constants'

import {
  Megaphone,
  Security,
  UserInfo,
  Users
} from '../assets/svg'

import '../css/notifications.css'

function Notifications({ forwardRef }) {
  const navigate = useNavigate()
  const [initialState, dispatch] = useSrContext()
  const [notifications, setNotifications] = useState([])

  // Handle click
  const handleClick = async (e, id, type, otherDetails) => {
    e.preventDefault()

    const user = JSON.parse(window.localStorage.getItem('profile'))
    await markNotificationAsRead({ userId: user.userId, notificationId: id })

    if (type === 'guest') {
      navigate(`/guest-overview/${otherDetails?.guestId}`)
    }

    if (type === 'announcement') {
      navigate(`/announcement-overview/${otherDetails?.announcementId}`)
    }
  }

  // Use effect
  useEffect(() => {
    setNotifications(initialState.user?.notifications)
  }, [initialState.user?.notifications])

  useEffect(() => {
    document.title = 'Notifications'
    
    const cookie = document.cookie?.split('; ')?.find((row) => row.startsWith('routesHistory='))?.split('=')[1]
    const routeHistory = cookie?.split(',')

    document.cookie = `routesHistory=${routeHistory}`
    routeHistory.push('notifications')
    document.cookie = `routesHistory=${routeHistory}`
    
    dispatch({ type: INSERT_ROUTE, payload: routeHistory })
    dispatch({ type: SET_ACTIVE_PAGE, payload: 'notifications' })

    // Validate user
    async function validate() {
      let token = window.localStorage.getItem('user')
      let res = await validateUser(dispatch, { token })

      if (res?.status === 401) {
        navigate('/login')
      }
    }

    validate()

    // Implement real time
    const socket = io(domain)

    socket.on('notification', (notification) => {
      setNotifications(prevNotifications => [...prevNotifications, notification])
    })

    return () => {
      socket.close()
    }
  }, [])

  return (
    <section ref={forwardRef} id='notifications'>
      <div className='container'>
        {/* Heading */}
        <h1 style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}>
          Notifications
        </h1>
      
        {/* List */}
        <div className='list'>
          {notifications?.slice(0)?.reverse()?.map(({ notificationId, type, heading, body, dateCreated, isRead, otherDetails }, i) => (
            <Link 
              onClick={(e) => handleClick(e, notificationId, type, otherDetails)}
              key={i} 
              className='item'>
              <span className='badge'>
                {type === 'account' && <Security color='#FFF' />}
                {type === 'announcement' && <Megaphone color='#FFF' />}
                {type === 'guest' && <Users color='#FFF' />}
                {type === 'profile' && <UserInfo color='#FFF' />}
              </span>

              <div>
                <div className='titleAndDate'>
                  <h3 
                    style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }} 
                    className='title'
                  >
                    {heading.length > 30 ? `${heading.substring(0, 30)}...` : heading.substring(0, 30)}
                  </h3>

                  <p className='date'>
                    {`${formatDate(dateCreated)} at ${formatTime(dateCreated)}`}
                  </p>
                </div>
                
                <p>{body?.length > 64 ? `${body?.substring(0, 64)}...` : body?.substring(0, 64)}</p>
              </div>

              {!isRead && <span className='mark'></span>}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Notifications
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import io from 'socket.io-client'

import { 
  useSrContext, 
  TOGGLE_NAV
} from '../context'

import {
  BrandLogo,
  Bell,
  Menu
} from '../assets/svg/index'

function NavigationBar() {
  const [initialState, dispatch] = useSrContext()
  const [notifications, setNotifications] = useState([])
  const [notificationCount, setNotificationCount] = useState(0)

  // Handle click
  const handleClick = () => {
    dispatch({ type: TOGGLE_NAV })
  }

  // Use effect
  useEffect(() => {
    setNotifications(initialState.user?.notifications)

    const unreadNotifications = notifications?.filter(notification => !notification.isRead)
    const unreadCount = unreadNotifications?.length

    setNotificationCount(unreadCount)
  }, [initialState.user?.notifications])

  useEffect(() => {
    // Implement real time
    const socket = io('http://localhost:8000')

    socket.on('notification', () => {
      setNotificationCount(prevCount => prevCount + 1)
    })

    return () => {
      socket.close()
    }
  }, [])

  return (
    <section id='navigation-bar'>
      {/* Menu Icon */}
      <a onClick={handleClick}>
        <Menu />
      </a>

      {/* Brand Logo */}
      <img src={BrandLogo} alt='Brand Logo' id='brand-logo' />
      
      {/* Bell Icon */}
      <div id='notification-container'>
        <Link to='/notifications'>
          <Bell color={`${initialState.activePage === 'notifications' ? '#5CB950' : '#B1B3B6'}`} />
        </Link>

        {notificationCount > 0 && (
          <span 
            style={{ 
              width: notificationCount > 9 ? 'fit-content' : '20px', 
              padding: notificationCount > 9 ? '6px' : '0', 
              borderRadius: notificationCount > 9 ? '12px' : '100%'
            }}
            className='badge'
          >
            {notificationCount}
          </span>
        )}
      </div>
    </section>
  )
}

export default NavigationBar
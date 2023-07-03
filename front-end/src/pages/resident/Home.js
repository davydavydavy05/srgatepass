import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import io from 'socket.io-client'

import { 
  Announcements, 
  BookGuest,
  Notifications 
} from '../../pages/index'

import { 
  useSrContext,
  UPDATE_GUESTS_COUNT,
  INSERT_ROUTE,
  SET_ACTIVE_PAGE,
  validateUser,
  fetchAnnouncements
} from '../../context'

import { 
  fetchGuests, 
  formatDate, 
  formatTime,
  markNotificationAsRead
} from '../../utils'

import { domain } from '../../constants'

import {
  Guest,
  MegaphoneEmoji,
  Add,
  ChevronUp,
  ChevronDown,
  Pin,
  Megaphone,
  Security,
  UserInfo,
  Users
} from '../../assets/svg'

import '../../css/home.css'

function Home() {
  const homeContRef = useRef(null)
  const announcementsContRef = useRef(null)
  const notificationsContRef = useRef(null)
  const bookGuestContRef = useRef(null)
  const headingRef = useRef(null)
  const actionRef = useRef(null)
  const guestsStackRef = useRef(null)
  const announcementsStackHeaderRef = useRef(null)
  const announcementsStackTitleRef = useRef(null)
  const announcementsStackBadgeRef = useRef(null)
  const announcementsStackButtonRef = useRef(null)
  const announcementsStack1Ref = useRef(null)
  const announcementsStack2Ref = useRef(null)
  const announcementsStack3Ref = useRef(null)
  const condenseBtnRef = useRef(null)
  const notificationsStackRef = useRef(null)
  const navigate = useNavigate()
  const [initialState, dispatch] = useSrContext()
  const today = new Date().toISOString().split('T')[0]
  const [selectedDate, setSelectedDate] = useState(today)
  const [guests, setGuests] = useState([])
  const guestsCount = initialState.guestsCount
  const bookingCount = window.localStorage.getItem('bookingCount')
  const [announcements, setAnnouncements] = useState(initialState.announcements)
  const details = JSON.parse(window.localStorage.getItem('profile'))
  const [notifications, setNotifications] = useState([])
  const [notificationsCount, setNotificationsCount] = useState(0)

  // Handle date change
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value)
  }

  // Get guests count
  const getGuestsCount = () => {
    const guestCount = guests?.reduce((count, guest) => {
      const dates = guest.dateBooked.map(date => date.split('T')[0])

      if (dates.includes(selectedDate)) {
        return count + 1
      }

      return count
    }, 0)

    return guestCount
  }

  // Handle notification click
  const handleNotificationClick = async (e, id, type, otherDetails) => {
    e.preventDefault()

    const user = JSON.parse(window.localStorage.getItem('profile'))
    await markNotificationAsRead({ userId: user.userId, notificationId: id })

    if (type === 'announcement') {
      navigate(`/announcement-overview/${otherDetails?.announcementId}`)
    }
  }

  // Navigate to Notifications
  const navigateToNotifications = (e) => {
    e.preventDefault()

    dispatch({ type: SET_ACTIVE_PAGE, payload: 'notifications' })

    homeContRef.current.style.transform = 'translateX(-150px)'
    homeContRef.current.style.transition = '300ms ease'
    notificationsContRef.current.style.visibility = 'visible'
    notificationsContRef.current.style.transform = 'translateX(0)'
    notificationsContRef.current.style.transition = '300ms ease'
    
    setTimeout(() => {
      navigate('/notifications')
    }, 500)
  }

  // Navigate to Announcements
  const navigateToAnnouncements = (e) => {
    e.preventDefault()

    dispatch({ type: SET_ACTIVE_PAGE, payload: 'announcements' })

    homeContRef.current.style.transform = 'translateX(-150px)'
    homeContRef.current.style.transition = '300ms ease'
    announcementsContRef.current.style.visibility = 'visible'
    announcementsContRef.current.style.transform = 'translateX(0)'
    announcementsContRef.current.style.transition = '300ms ease'
    
    setTimeout(() => {
      navigate('/announcements')
    }, 500)
  }

  // Navigate to Book Guest
  const navigateToBookGuest = (e) => {
    e.preventDefault()

    homeContRef.current.style.transform = 'translateX(-150px)'
    homeContRef.current.style.transition = '300ms ease'
    bookGuestContRef.current.style.visibility = 'visible'
    bookGuestContRef.current.style.transform = 'translateX(0)'
    bookGuestContRef.current.style.transition = '300ms ease'
    
    setTimeout(() => {
      navigate('/book-guest')
    }, 500)
  }

  // Expand announcements
  const expandAnnouncements = (e) => {
    e.preventDefault()
    
    headingRef.current.style.opacity = '0'
    announcementsStackButtonRef.current.style.display = 'none'

    setTimeout(() => {
      headingRef.current.style.transform = 'translateY(-500px)'
    }, 1000)

    setTimeout(() => {
      headingRef.current.innerText = 'Announcements'
      headingRef.current.style.transform = 'translateY(0)'
      headingRef.current.style.transition = '1000ms ease-out'
      headingRef.current.style.opacity = '1'
      headingRef.current.style.fontSize = '20px'

      if (window.innerWidth >= 390) {
        headingRef.current.style.fontSize = '24px'
      }
    }, 1200)

    guestsStackRef.current.style.top = '-500px'
    notificationsStackRef.current.style.top = `${(announcementsStack3Ref.current.getBoundingClientRect().top + window.pageYOffset) + 280}px`

    setTimeout(() => {
      announcementsStack1Ref.current.style.top = '-258px'
      announcementsStack1Ref.current.style.gap = '8px'

      announcementsStack2Ref.current.style.top = `-${258 - (194 + 16)}px`
      announcementsStack2Ref.current.style.width = '100%'
      announcementsStack2Ref.current.style.backgroundColor = '#FFF'

      announcementsStack3Ref.current.style.top = `${(announcementsStack3Ref.current.getBoundingClientRect().top + window.pageYOffset) - (194 + 141) + 48.5}px`
      announcementsStack3Ref.current.style.width = '100%'
      announcementsStack3Ref.current.style.backgroundColor = '#FFF'
      
      condenseBtnRef.current.style.top = `${(condenseBtnRef.current.getBoundingClientRect().top + window.pageYOffset) - (147)}px`

      if (window.innerWidth >= 390) {
        condenseBtnRef.current.style.top = `${(condenseBtnRef.current.getBoundingClientRect().top + window.pageYOffset) - (156)}px`
        announcementsStack3Ref.current.style.top = `${(announcementsStack3Ref.current.getBoundingClientRect().top + window.pageYOffset) - (194 + 141) + 52}px`
        notificationsStackRef.current.style.top = `${(announcementsStack3Ref.current.getBoundingClientRect().top + window.pageYOffset) + 300}px`
      }

      if (window.innerWidth >= 414) {
        condenseBtnRef.current.style.top = `${(condenseBtnRef.current.getBoundingClientRect().top + window.pageYOffset) - (162)}px`
        notificationsStackRef.current.style.top = `${(announcementsStack3Ref.current.getBoundingClientRect().top + window.pageYOffset) + 308}px`
      }
    }, 500)

    setTimeout(() => {
      const announcementsStack2ParentElem = announcementsStack2Ref.current
      const announcementsStack2ChildrentElem = announcementsStack2ParentElem.childNodes
      const announcementsStack3ParentElem = announcementsStack3Ref.current
      const announcementsStack3ChildrentElem = announcementsStack3ParentElem.childNodes

      announcementsStack2ChildrentElem.forEach(child => {
        child.style.opacity = '1'
      })

      announcementsStack3ChildrentElem.forEach(child => {
        child.style.opacity = '1'
      })
    }, 1000)

    setTimeout(() => {
      announcementsStackHeaderRef.current.style.justifyContent = 'flex-end'
      announcementsStackTitleRef.current.style.opacity = '0'
      announcementsStackBadgeRef.current.style.display = 'none'
    }, 1800)

    setTimeout(() => {
      actionRef.current.style.opacity = '1'
      condenseBtnRef.current.style.opacity = 1
    }, 2000)

    if (window.innerWidth >= 390) {
      headingRef.current.style.fontSize = '24px'
      announcementsStack1Ref.current.style.top = '-258px'
      announcementsStack3Ref.current.style.top = `${(announcementsStack3Ref.current.getBoundingClientRect().top + window.pageYOffset) - (194 + 141 + 89)}px`
      condenseBtnRef.current.style.top = 0
    }

    if (window.innerWidth >= 414) {
      announcementsStack1Ref.current.style.top = '-264px'
      announcementsStack3Ref.current.style.top = `${(announcementsStack3Ref.current.getBoundingClientRect().top + window.pageYOffset) - (194 + 141 + 99)}px`
    }
  }

  // Condense announcements
  const condenceAnnouncements = () => {
    headingRef.current.style.transform = 'translateY(-500px)'
    headingRef.current.style.transition = '1000ms ease-in'
    headingRef.current.style.opacity = '0'
    actionRef.current.style.opacity = '0'
    
    setTimeout(() => {
      headingRef.current.style.fontSize = '28px'
    }, 500)

    setTimeout(() => {
      headingRef.current.innerText = `Welcome, ${details?.firstName}!`
      headingRef.current.style.transform = 'translateY(0)'
      headingRef.current.style.transition = '1000ms ease-out'
      headingRef.current.style.opacity = '1'
    }, 1200)

    guestsStackRef.current.style.top = '141px'
    
    setTimeout(() => {
      headingRef.current.innerText = `Welcome, ${details?.firstName}!`
    }, 2000)

    guestsStackRef.current.style.left = '20px'
    guestsStackRef.current.style.right = '20px'

    notificationsStackRef.current.style.top = '626px'

    setTimeout(() => {
      announcementsStackHeaderRef.current.style.placeContent = 'space-between'
      announcementsStackTitleRef.current.style.opacity = '1'
      announcementsStackBadgeRef.current.style.display = 'grid'
      announcementsStackButtonRef.current.style.display = 'inline-flex'
    }, 300)

    setTimeout(() => {
      announcementsStack1Ref.current.style.top = '22px'
      announcementsStack1Ref.current.style.gap = '16px'

      announcementsStack2Ref.current.style.top = '10px'
      announcementsStack2Ref.current.style.width = '95%'
      announcementsStack2Ref.current.style.backgroundColor = '#E8E8E8'

      announcementsStack3Ref.current.style.top = '0'
      announcementsStack3Ref.current.style.width = '90%'
      announcementsStack3Ref.current.style.backgroundColor = '#D4D4D4'

      condenseBtnRef.current.style.opacity = 0
    }, 500)

    const announcementsStack2ParentElem = announcementsStack2Ref.current
    const announcementsStack2ChildrentElem = announcementsStack2ParentElem.childNodes
    const announcementsStack3ParentElem = announcementsStack3Ref.current
    const announcementsStack3ChildrentElem = announcementsStack3ParentElem.childNodes

    announcementsStack2ChildrentElem.forEach(child => {
      child.style.opacity = '0'
    })

    announcementsStack3ChildrentElem.forEach(child => {
      child.style.opacity = '0'
    })

    if (window.innerWidth >= 390) {
      guestsStackRef.current.style.top = '151px'
      notificationsStackRef.current.style.top = '642px'
    }

    if (window.innerWidth >= 414) {
      guestsStackRef.current.style.top = '155px'
      notificationsStackRef.current.style.top = '648px'
    }
  }

  // Use effect
  useEffect(() => {
    console.log(guests)
    notificationsContRef.current.style.position = 'absolute'
    notificationsContRef.current.style.top = '0'
    notificationsContRef.current.style.bottom = '0'
    notificationsContRef.current.style.left = '0'
    notificationsContRef.current.style.right = '0'
    notificationsContRef.current.style.visibility = 'hidden'
    notificationsContRef.current.style.transform = 'translateX(100%)'
    notificationsContRef.current.style.zIndex = '3'

    announcementsContRef.current.style.position = 'absolute'
    announcementsContRef.current.style.top = '0'
    announcementsContRef.current.style.bottom = '0'
    announcementsContRef.current.style.left = '0'
    announcementsContRef.current.style.right = '0'
    announcementsContRef.current.style.visibility = 'hidden'
    announcementsContRef.current.style.transform = 'translateX(100%)'
    announcementsContRef.current.style.zIndex = '3'

    const announcements2StackParentElem = announcementsStack2Ref.current
    const announcements2StackChildrentElem = announcements2StackParentElem.childNodes
    const announcements3StackParentElem = announcementsStack3Ref.current
    const announcements3StackChildrentElem = announcements3StackParentElem.childNodes

    announcements2StackChildrentElem.forEach(child => {
      child.style.transition = '350ms ease-in-out'
      child.style.opacity = '0'
    })

    announcements3StackChildrentElem.forEach(child => {
      child.style.transition = '350ms ease-in-out'
      child.style.opacity = '0'
    })

    bookGuestContRef.current.style.position = 'absolute'
    bookGuestContRef.current.style.top = '0'
    bookGuestContRef.current.style.bottom = '0'
    bookGuestContRef.current.style.left = '0'
    bookGuestContRef.current.style.right = '0'
    bookGuestContRef.current.style.visibility = 'hidden'
    bookGuestContRef.current.style.transform = 'translateX(100%)'
    bookGuestContRef.current.style.zIndex = '100'
  }, [])

  useEffect(() => {
    // Set notifications and count
    setNotifications(initialState.user?.notifications)

    const unreadNotifications = notifications?.filter(notification => !notification.isRead)
    const unreadCount = unreadNotifications?.length

    setNotificationsCount(unreadCount)
  }, [initialState.user?.notifications])

  useEffect(() => {
    document.title = 'Home'

    const cookie = document.cookie?.split('; ')?.find((row) => row.startsWith('routesHistory='))?.split('=')[1]
    const routeHistory = cookie?.split(',')

    document.cookie = `routesHistory=${routeHistory}`
    routeHistory.push('home')
    document.cookie = `routesHistory=${routeHistory}`
    
    dispatch({ type: INSERT_ROUTE, payload: routeHistory })
    dispatch({ type: SET_ACTIVE_PAGE, payload: 'home' })

    window.localStorage.removeItem('verification')

    // Validate user
    async function validate() {
      const token = window.localStorage.getItem('user')
      const res = await validateUser(dispatch, { token })

      console.log(res.data)

      if (res?.status === 401) {
        navigate('/login')
      }

    }

    // Fetch announcements
    async function getAnnouncements() {
      const updatedData = await fetchAnnouncements(dispatch, {})
      return updatedData
    }

    // Fetch guests
    async function getGuests() {
      const res = await fetchGuests({})

      const filteredData = res.data?.map(item => {
        return {
          dateBooked: item.dateBooked
        }
      })

      setGuests(filteredData)
    }

    validate()
    getGuests()
    getAnnouncements().then(fetchedAnnouncements => setAnnouncements(fetchedAnnouncements))
    
    // Implement real time
    const socket = io(domain)
    console.log(socket)

    socket.on('guestCount', () => {
      dispatch({ type: UPDATE_GUESTS_COUNT, payload: guestsCount + 1 })
      console.log('Updated')
    })
    
    socket.on('announcement', (announcement) => {
      setAnnouncements(prevAnnouncements => [...prevAnnouncements, announcement])
    })

    socket.on('notification', (notification) => {
      setNotifications(prevNotifications => [...prevNotifications, notification])
      setNotificationsCount(prevCount => prevCount + 1)
    })

    return () => {
      socket.close()
    }
  }, [guestsCount])

  return (
    <>
      {/* For Animation Purpose Only */}
      <Notifications forwardRef={notificationsContRef} />
      <Announcements forwardRef={announcementsContRef} />
      <BookGuest forwardRef={bookGuestContRef} />

      <section ref={homeContRef} id='home'>
        <div className='container'>
          {/* Heading & Button */}
          <div className='header'>
            <h1 ref={headingRef} style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}>
              Welcome, {details?.firstName}!
            </h1>

            <Link 
              // to='/announcements'
              ref={actionRef} 
              onClick={navigateToAnnouncements}
              style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }} 
              className='text btn'
            >
              See All
            </Link>
          </div>

          {/* Guests */}
          <div ref={guestsStackRef} className='guests stack'>
            <img src={Guest} alt='Vector' className='vector' />

            <div>
              <div className='form-group'>
                <div className='date input-field'>
                  <input 
                    type='date' 
                    value={selectedDate}
                    placeholder='Today' 
                    onChange={handleDateChange}
                    id='logDate'
                  />

                  <span className='suffix'>
                    <ChevronDown color='#1E1E1E' />
                  </span>
                </div>
              </div>

              {bookingCount < 3 && (
                <Link onClick={navigateToBookGuest} className='text btn'>
                  <Add color='#FFF' />

                  <span>Book Guest</span>
                </Link>
              )}
            </div>

            <p>
              <span style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}>
                {getGuestsCount()} {getGuestsCount() > 2 ? 'guests' : 'guest'}
              </span>
              
              <span style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}>
                {selectedDate === today ? 'as of today' : `on ${formatDate(selectedDate)}`}
              </span>
            </p>
          </div>

          {/* Announcements */}
          <div className='announcements'>
            <Link 
              to={`/announcement-overview/${announcements[announcements.length - 1]?._id}`}
              ref={announcementsStack1Ref} 
              className='stack'
            >
              <div ref={announcementsStackHeaderRef} className='header'>
                <h2 ref={announcementsStackTitleRef} style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}>
                  Announcement
                  <img src={MegaphoneEmoji} alt='Emoji' />
                </h2>

                <div>
                  {announcements[announcements.length - 1]?.isPin && <Pin color='#5CB950' />}
                  
                  <span ref={announcementsStackBadgeRef} className='badge'>
                    {announcements.length}
                  </span>

                  <button 
                    ref={announcementsStackButtonRef}
                    style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }} 
                    onClick={expandAnnouncements}
                    className='text btn'
                  >
                    See More
                  </button>
                </div>
              </div>

              <div className='content'>
                <div className='titleAndDate'>
                  <h3 
                    style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }} 
                    className='title'
                  >
                    {announcements[announcements.length - 1]?.heading.length > 40 ? `${announcements[announcements.length - 1]?.heading.substring(0, 40)}...` : announcements[announcements.length - 1]?.heading}
                  </h3>
                  
                  <p className='date'>
                    {`${formatDate(announcements[announcements.length - 1]?.datePosted)} at ${formatTime(announcements[announcements.length - 1]?.datePosted)}`}
                  </p>
                </div>

                <p>
                  {announcements[announcements.length - 1]?.body.length > 140 ? `${announcements[announcements.length - 1].body.substring(0, 140)}...` : announcements[announcements.length - 1]?.body}
                  
                  {announcements[announcements.length - 1]?.body.length > 140 && (
                    <button 
                      to='#' 
                      style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }} 
                      className='text btn'
                    >
                      See more
                    </button>
                  )}
                </p>
              </div>
            </Link>

            <div ref={announcementsStack2Ref} className='stack'>
              <div className='content'>
                <div className='titleAndDate'>
                  <h3 
                    style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }} 
                    className='title'
                  >
                    {announcements[announcements.length - 2]?.heading.length > 40 ? `${announcements[announcements.length - 2]?.heading.substring(0, 40)}...` : announcements[announcements.length - 2]?.heading}
                  </h3>
                  
                  <p className='date'>
                    {`${formatDate(announcements[announcements.length - 2]?.datePosted)} at ${formatTime(announcements[announcements.length - 2]?.datePosted)}`}
                  </p>
                </div>

                <p>
                  {announcements[announcements.length - 2]?.body.length > 140 ? `${announcements[announcements.length - 2].body.substring(0, 140)}...` : announcements[announcements.length - 2]?.body}
                  
                  {announcements[announcements.length - 2]?.body.length > 140 && (
                    <button 
                      to='#' 
                      style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }} 
                      className='text btn'
                    >
                      See more
                    </button>
                  )}
                </p>
              </div>
            </div>

            <div ref={announcementsStack3Ref} className='stack'>
              <div className='content'>
                <div className='titleAndDate'>
                  <h3 
                    style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }} 
                    className='title'
                  >
                    {announcements[announcements.length - 3]?.heading.length > 40 ? `${announcements[announcements.length - 3]?.heading.substring(0, 40)}...` : announcements[announcements.length - 3]?.heading}
                  </h3>
                  
                  <p className='date'>
                    {`${formatDate(announcements[announcements.length - 3]?.datePosted)} at ${formatTime(announcements[announcements.length - 3]?.datePosted)}`}
                  </p>
                </div>

                <p>
                  {announcements[announcements.length - 3]?.body.length > 140 ? `${announcements[announcements.length - 3].body.substring(0, 140)}...` : announcements[announcements.length - 3]?.body}
                  
                  {announcements[announcements.length - 3]?.body.length > 140 && (
                    <button 
                      to='#' 
                      style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }} 
                      className='text btn'
                    >
                      See more
                    </button>
                  )}
                </p>
              </div>
            </div>

            {/* Condense Button */}
            <button 
              ref={condenseBtnRef}
              onClick={condenceAnnouncements} 
              className='condense btn'
            >
              <ChevronUp color='#1E1E1E' />
            </button>
          </div>

          {/* Notifications */}
          {initialState.user?.notifications?.length !== 0 && (
            <div 
              ref={notificationsStackRef} 
              className='notifications stack'
            >
              <div className='header'>
                <h2 style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}>
                  Notifications
                </h2>

                <div>
                  <span className='badge'>
                    {notificationsCount}
                  </span>
                  <Link 
                    style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }} 
                    onClick={navigateToNotifications}
                    className='text btn'
                  >
                    See More
                  </Link>
                </div>
              </div>
              <div className='list'>
                {notifications?.length >= 3 && (
                  <Link onClick={(e) => handleNotificationClick(e, notifications[notifications.length - 1]?.notificationId, notifications[notifications.length - 1]?.type, notifications[notifications.length - 1]?.otherDetails)} className='item'>
                    <span className='badge'>
                      {notifications[notifications.length - 1]?.type === 'account' && <Security color='#FFF' />}
                      {notifications[notifications.length - 1]?.type === 'announcement' && <Megaphone color='#FFF' />}
                      {notifications[notifications.length - 1]?.type === 'guest' && <Users color='#FFF' />}
                      {notifications[notifications.length - 1]?.type === 'profile' && <UserInfo color='#FFF' />}
                    </span>

                    <div>
                      <div className='titleAndDate'>
                        <h3 
                          style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }} 
                          className='title'
                        >
                          {notifications[notifications.length - 1]?.heading}
                        </h3>

                        <p className='date'>
                          {`${formatDate(notifications[notifications.length - 1]?.dateCreated)} at ${formatTime(notifications[notifications.length - 1]?.dateCreated)}`}
                        </p>
                      </div>
                      
                      <p>
                        {notifications[notifications.length - 1]?.body.substring(0, 54)}
                      </p>
                    </div>
                  </Link>
                )}

                {notifications?.length >= 2 && (
                  <Link onClick={(e) => handleNotificationClick(e, notifications[notifications.length - 1]?.notificationId, notifications[notifications.length - 1]?.type, notifications[notifications.length - 1]?.otherDetails)} className='item'>
                    <span className='badge'>
                      {notifications[notifications.length - 1]?.type === 'account' && <Security color='#FFF' />}
                      {notifications[notifications.length - 1]?.type === 'announcement' && <Megaphone color='#FFF' />}
                      {notifications[notifications.length - 1]?.type === 'guest' && <Users color='#FFF' />}
                      {notifications[notifications.length - 1]?.type === 'profile' && <UserInfo color='#FFF' />}
                    </span>

                    <div>
                      <div className='titleAndDate'>
                        <h3 
                          style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }} 
                          className='title'
                        >
                          {notifications[notifications.length - 1]?.heading}
                        </h3>

                        <p className='date'>
                          {`${formatDate(notifications[notifications.length - 1]?.dateCreated)} at ${formatTime(notifications[notifications.length - 1]?.dateCreated)}`}
                        </p>
                      </div>
                      
                      <p>
                        {notifications[notifications.length - 1]?.body.substring(0, 54)}
                      </p>
                    </div>
                  </Link>
                )}

                {notifications?.length >= 1 && (
                  <Link onClick={(e) => handleNotificationClick(e, notifications[notifications.length - 3]?.notificationId, notifications[notifications.length - 3]?.type, notifications[notifications.length - 3]?.otherDetails)} className='item'>
                    <span className='badge'>
                      {notifications[notifications.length - 3]?.type === 'account' && <Security color='#FFF' />}
                      {notifications[notifications.length - 3]?.type === 'announcement' && <Megaphone color='#FFF' />}
                      {notifications[notifications.length - 3]?.type === 'guest' && <Users color='#FFF' />}
                      {notifications[notifications.length - 3]?.type === 'profile' && <UserInfo color='#FFF' />}
                    </span>

                    <div>
                      <div className='titleAndDate'>
                        <h3 
                          style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }} 
                          className='title'
                        >
                          {notifications[notifications.length - 3]?.heading}
                        </h3>

                        <p className='date'>
                          {`${formatDate(notifications[notifications.length - 3]?.dateCreated)} at ${formatTime(notifications[notifications.length - 3]?.dateCreated)}`}
                        </p>
                      </div>
                      
                      <p>
                        {notifications[notifications.length - 3]?.body.substring(0, 54)}
                      </p>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default Home
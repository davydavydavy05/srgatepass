import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { 
  BookGuest, 
  Notifications, 
  SearchGuest
} from '../../pages'

import { 
  useSrContext,
  INSERT_ROUTE,
  SET_ACTIVE_PAGE,
  validateUser
} from '../../context'

import {
  fetchGuests,
  formatDate,
  formatTime
} from '../../utils'

import {
  ArrowDownRight,
  Plus,
  Search,
  BadgeMeh
} from '../../assets/svg'

import '../../css/my_guests.css'

function MyGuests() {
  const myGuestsContRef = useRef(null)
  const searchGuestContRef = useRef(null)
  const bookGuestContRef = useRef(null)
  const notificationsContRef = useRef(null)
  const navigate = useNavigate()
  const details = JSON.parse(window.localStorage.getItem('profile'))
  const [guests, setGuests] = useState([])
  const [currentWeekBookings, setCurrentWeekBookings] = useState([])
  const [lastWeekBookings, setLastWeekBookings] = useState([])
  const [otherWeekBookings, setOtherWeekBookings] = useState([])
  const [openItemId, setOpenItemId] = useState(null)
  const [initialState, dispatch] = useSrContext()
  const [isVisible, setIsVisible] = useState(true)

  // Navigate to Search Guest
  const navigateToSearchGuest = (e) => {
    e.preventDefault()

    myGuestsContRef.current.style.transform = 'translateX(-150px)'
    myGuestsContRef.current.style.transition = '300ms ease'
    searchGuestContRef.current.style.visibility = 'visible'
    searchGuestContRef.current.style.transform = 'translateX(0)'
    searchGuestContRef.current.style.transition = '300ms ease'
    
    setTimeout(() => {
      navigate('/search-guest')
    }, 500)
  }

  // Navigate to Book Guest
  const navigateToBookGuest = (e) => {
    e.preventDefault()

    myGuestsContRef.current.style.transform = 'translateX(-150px)'
    myGuestsContRef.current.style.transition = '300ms ease'
    bookGuestContRef.current.style.visibility = 'visible'
    bookGuestContRef.current.style.transform = 'translateX(0)'
    bookGuestContRef.current.style.transition = '300ms ease'
    
    setTimeout(() => {
      navigate('/book-guest')
    }, 500)
  }

  // Handle click
  const handleClick = (id) => {
    navigate(`/guest-overview/${id}`)
  }

  // Handle scroll
  const handleScroll = () => {
    if (window.scrollY > 40) {
      setIsVisible(false)
    }
    
    if (window.scrollY < 40) {
      setIsVisible(true)
    }
  }

  // Use effect
  useEffect(() => {
    notificationsContRef.current.style.position = 'absolute'
    notificationsContRef.current.style.top = '0'
    notificationsContRef.current.style.bottom = '0'
    notificationsContRef.current.style.left = '0'
    notificationsContRef.current.style.right = '0'
    notificationsContRef.current.style.visibility = 'hidden'
    notificationsContRef.current.style.transform = 'translateX(100%)'
    notificationsContRef.current.style.zIndex = '3'

    searchGuestContRef.current.style.position = 'absolute'
    searchGuestContRef.current.style.top = '0'
    searchGuestContRef.current.style.bottom = '0'
    searchGuestContRef.current.style.left = '0'
    searchGuestContRef.current.style.right = '0'
    searchGuestContRef.current.style.visibility = 'hidden'
    searchGuestContRef.current.style.transform = 'translateX(100%)'
    searchGuestContRef.current.style.zIndex = '100'

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
    document.title = 'My Guests'

    const cookie = document.cookie?.split('; ')?.find((row) => row.startsWith('routesHistory='))?.split('=')[1]
    const routeHistory = cookie?.split(',')

    document.cookie = `routesHistory=${routeHistory}`
    routeHistory.push('my-guests')
    document.cookie = `routesHistory=${routeHistory}`
    
    dispatch({ type: INSERT_ROUTE, payload: routeHistory })
    dispatch({ type: SET_ACTIVE_PAGE, payload: 'myGuests' })

    // Validate user
    async function validate() {
      let token = window.localStorage.getItem('user')
      let res = await validateUser(dispatch, { token })

      if (res?.status === 401) {
        navigate('/login')
      }
    }

    // Fetch guests
    async function getGuests() {
      let res = await fetchGuests({ userId: details.userId })

      setGuests(res.data)

      const mergedData = []

      res.data.forEach((item) => {
        item.dateBooked.forEach((date) => {
          const day = new Date(date).toLocaleDateString()

          const existingDay = mergedData.find((mergedItem) => mergedItem.day === day)
          if (existingDay) {
            existingDay.bookings.push(item)
          } else {
            mergedData.push({ day, bookings: [item] })
          }
        })
      })

      // Get the current date
      const currentDate = new Date()

      // Calculate the start and end dates of the current week
      const currentWeekStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay())
      const currentWeekEnd = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + (6 - currentDate.getDay()))

      // Calculate the start and end dates of the last week
      const lastWeekStart = new Date(currentWeekStart.getFullYear(), currentWeekStart.getMonth(), currentWeekStart.getDate() - 7)
      const lastWeekEnd = new Date(currentWeekEnd.getFullYear(), currentWeekEnd.getMonth(), currentWeekEnd.getDate() - 7)

      // Filter bookings for the current week
      const currentWeekBookings = mergedData.filter(booking => {
        const bookingDate = new Date(booking.day)
        return bookingDate >= currentWeekStart && bookingDate <= currentWeekEnd
      })

      setCurrentWeekBookings(currentWeekBookings)

      // Filter bookings for the last week
      const lastWeekBookings = mergedData.filter(booking => {
        const bookingDate = new Date(booking.day)
        return bookingDate >= lastWeekStart && bookingDate <= lastWeekEnd
      })

      setLastWeekBookings(lastWeekBookings)

      // Filter bookings for other dates
      const otherWeekBookings = mergedData.filter(booking => {
        const bookingDate = new Date(booking.day)
        return bookingDate < lastWeekStart || bookingDate > currentWeekEnd
      })

      setOtherWeekBookings(otherWeekBookings)
      console.log(otherWeekBookings)
    }

    validate()
    getGuests()

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <>
      {/* For Animation Purpose Only */}
      <Notifications forwardRef={notificationsContRef} />
      <SearchGuest forwardRef={searchGuestContRef} />
      <BookGuest forwardRef={bookGuestContRef} />
      
      <section ref={myGuestsContRef} id='my_guests'>
        {/* Heading */}
        <h1 
          style={{ visibility: `${isVisible ? 'visible' : 'hidden'}`, fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }} 
          id='heading'
        >
          My Guests
        </h1>

        {guests.length > 0 ? (
          <>
            {/* List */}
            <div className='list'>
              {currentWeekBookings.length !== 0 && (
                <div>
                  <h2 style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}>
                    This week
                  </h2>

                  <div className='items'>
                    {currentWeekBookings.slice(0).reverse().map((guest, i) => {
                      const isItemOpen = guest.day === openItemId
                      
                      return (
                        <div 
                          key={i}
                          style={{ marginBottom: `${isItemOpen ? '16px' : '0'}` }}
                          className='item'
                        >
                          <div>
                            <div className='dateAndGuestsCount'>
                              <p className='date'>{formatDate(guest.day)}</p>
                              <p className='guestsCount'>{guest?.bookings?.length} Guests</p>
                            </div>

                            <span 
                              style={{ transform: `${isItemOpen ? 'rotate(-180deg)' : 'none'}` }}
                              onClick={() => setOpenItemId(isItemOpen ? null : guest.day)}
                              className={`action ${isItemOpen ? 'opened' : ''}`}
                            >
                              <ArrowDownRight color='#1E1E1E' />
                            </span>
                          </div>

                          <div className={`content ${isItemOpen ? 'opened' : ''}`}>
                            {guest?.bookings?.map(({ _id, name, phoneNumber, dateBooked }, i) => (
                              <div 
                                key={i}
                                onClick={() => handleClick(_id)}
                              >
                                <div className='nameAndContactNum'>
                                  <p 
                                    style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}
                                    className='name'
                                  >
                                    {`${name.length > 20 ? name.slice(0, 20) + '...' : name.slice(0, 20)}`}
                                  </p>

                                  <p className='contactNum'>{phoneNumber}</p>
                                </div>
                                
                                <p className='time'>
                                  {formatTime(dateBooked[dateBooked.length - 1])}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {lastWeekBookings.length !== 0 && (
                <div>
                  <h2 style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}>
                    Last week
                  </h2>

                  <div className='items'>
                    {lastWeekBookings.slice(0).reverse().map((guest, i) => {
                      const isItemOpen = guest.day === openItemId

                      return (
                        <div 
                          key={i}
                          style={{ marginBottom: `${isItemOpen ? '16px' : '0'}` }}
                          className='item'
                        >
                          <div>
                            <div className='dateAndGuestsCount'>
                              <p className='date'>{formatDate(guest.day)}</p>
                              <p className='guestsCount'>{guest?.bookings?.length} Guests</p>
                            </div>

                            <span 
                              onClick={() => setOpenItemId(isItemOpen ? null : guest.day)}
                              className={`action ${isItemOpen ? 'opened' : ''}`}
                            >
                              <ArrowDownRight color='#1E1E1E' />
                            </span>
                          </div>

                          <div className={`content ${isItemOpen ? 'opened' : ''}`}>
                            {guest?.bookings?.map(({ _id, name, phoneNumber, dateBooked }, i) => (
                              <div 
                                key={i}
                                onClick={() => navigate(`/guest-overview/${_id}`)}
                              >
                                  <div className='nameAndContactNum'>
                                  <p 
                                    style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}
                                    className='name'
                                  >
                                    {name}
                                  </p>

                                  <p className='contactNum'>{phoneNumber}</p>
                                </div>

                                <p className='time'>
                                  {formatTime(dateBooked[dateBooked.length - 1])}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {otherWeekBookings.length !== 0 && (
                <div>
                  <h2 style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}>
                    Other weeks
                  </h2>

                  <div className='items'>
                    {otherWeekBookings.map((guest, i) => {
                      const isItemOpen = guest.day === openItemId

                      return (
                        <div 
                          key={i}
                          style={{ marginBottom: `${isItemOpen ? '16px' : '0'}` }}
                          className='item'
                        >
                          <div>
                            <div className='dateAndGuestsCount'>
                              <p className='date'>{formatDate(guest.day)}</p>
                              <p className='guestsCount'>{guest?.bookings?.length} Guests</p>
                            </div>

                            <span 
                              onClick={() => setOpenItemId(isItemOpen ? null : guest.day)}
                              className={`action ${isItemOpen ? 'opened' : ''}`}
                            >
                              <ArrowDownRight color='#1E1E1E' />
                            </span>
                          </div>

                          <div className={`content ${isItemOpen ? 'opened' : ''}`}>
                            {guest?.bookings?.map(({ _id, name, phoneNumber, dateBooked }, i) => (
                              <div 
                                key={i}
                                onClick={() => navigate(`/guest-overview/${_id}`)}
                              >
                                <div className='nameAndContactNum'>
                                  <p 
                                    style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}
                                    className='name'
                                  >
                                    {name}
                                  </p>

                                  <p className='contactNum'>{phoneNumber}</p>
                                </div>

                                <p className='time'>
                                  {formatTime(dateBooked[dateBooked.length - 1])}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className='list empty'>
            <div className='status'>
              {/* Badge */}
              <img src={BadgeMeh} alt='Badge' />
              
              {/* Heading & Paragraph */}
              <div>
                <h2 style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}>
                  No bookings yet
                </h2>

                <p>You have not made any bookings yet.</p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className='actions'>
          <Link onClick={navigateToSearchGuest} className='outline btn'>
            <Search color='#1E1E1E' />
          </Link>

          <Link onClick={navigateToBookGuest} className='solid btn'>
            <Plus color='#FFF' />
          </Link>
        </div>
      </section>
    </>
  )
}

export default MyGuests
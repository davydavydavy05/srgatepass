import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useSrContext, validateUser } from '../context'

import { ArrowDownRight, Back } from '../assets/svg'

import '../css/guest_history.css'

function GuestHistory({ forwardRef }) {
  const navigate = useNavigate()
  const [initialState, dispatch] = useSrContext()
  const guest = JSON.parse(window.localStorage.getItem('guest'))
  const [bookingHistory, setBookingHistory] = useState([])
  const [loggingHistory, setLoggingHistory] = useState([])
  const [tabActive, setTabActive] = useState('bookingHistory')
  const [openItemId, setOpenItemId] = useState(null)

  // Use effect
  useEffect(() => {
    document.title = 'Guest History'

    async function validate() {
      const token = window.localStorage.getItem('user')
      const res = await validateUser(dispatch, { token })

      if (res?.status === 401) {
        navigate('/login')
      }
    }

    validate()

    // Transformed booking history data
    const transformedBookingHistoryData = guest?.dateBooked.reduce((acc, timestamp) => {
      const dateObj = new Date(timestamp)
      const date = dateObj.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric'
      })
      const time = dateObj.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      })
      const existingDate = acc.find(item => item.date === date)

      if (existingDate) {
        existingDate.time.push(time)
      } else {
        acc.push({ date, time: [time] })
      }
    
      return acc
    }, [])

    // Transformed logging history data
    const transformedLoggingHistoryData = guest?.timeArrived.reduce((acc, timestamp) => {
      const dateObj = new Date(timestamp)
      const date = dateObj.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric'
      })
      const time = dateObj.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      })
      const existingDate = acc.find(item => item.date === date)
      
      if (existingDate) {
        existingDate.time.push(time)
      } else {
        acc.push({ date, time: [time] })
      }
    
      return acc
    }, [])

    setBookingHistory(transformedBookingHistoryData)
    setLoggingHistory(transformedLoggingHistoryData)
  }, [])

  return (
    <section ref={forwardRef} id='guest_history'>
      {/* Back Button */}
      <Link to={`/guest-overview/${guest?._id}`} className='text btn'>
        <Back />
        <span>Back</span>
      </Link>

      {/* Heading */}
      <h1 style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}>
        Guest History
      </h1>

      {/* Tabs */}
      <div id='tabs'>
        <div 
          onClick={() => setTabActive('bookingHistory')}
          className={`tab ${tabActive === 'bookingHistory' && 'active'}`}
        >
          <p style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}>
            Booking History
          </p>

          <span></span>
        </div>

        <div 
          onClick={() => setTabActive('loggingHistory')}
          className={`tab ${tabActive === 'loggingHistory' && 'active'}`}
        >
          <p style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}>
            Logging History
          </p>

          <span></span>
        </div>
      </div>

      {/* Booking History List */}
      <div 
        style={{ display: `${tabActive === 'bookingHistory' ? 'flex' : 'none'}` }}
        className={`bookingHistory list ${tabActive === 'bookingHistory' && 'active'}`}
      >
        {bookingHistory?.map(({ date, time }, i) => {
          const isItemOpen = date === openItemId

          return (
            <div key={i}>
              <div className='item'>
                <p
                  style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }} 
                  className='date'
                >
                  {date}
                </p>

                {time.length > 1 ? (
                  <span 
                    style={{ transform: `${isItemOpen ? 'rotate(-180deg)' : 'none'}` }}
                    onClick={() => setOpenItemId(isItemOpen ? null : date)}
                    className='action'
                  >
                    <ArrowDownRight color='#1E1E1E' />
                  </span>
                ) : (
                  <p className='time'>
                    {time[0]}
                  </p>
                )}
              </div>

              {time.length > 1 && (
                <div 
                  style={{ transition: `${tabActive === 'bookingHistory' && '350ms'}` }}
                  className={`content ${isItemOpen ? 'opened' : ''}`}
                >
                  {time?.map((time, i) => (
                    <p key={i}>
                      {time}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Logging History List */}
      <div 
        style={{ display: `${tabActive === 'loggingHistory' ? 'flex' : 'none'}` }}
        className={`loggingHistory list ${tabActive === 'loggingHistory' && 'active'}`}
      >
        {loggingHistory?.map(({ date, time }, i) => {
          const isItemOpen = date === openItemId

          return (
            <div key={i}>
              <div className='item'>
                <p
                  style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }} 
                  className='date'
                >
                  {date}
                </p>

                {time.length > 1 ? (
                  <span 
                    style={{ transform: `${isItemOpen ? 'rotate(-180deg)' : 'none'}` }}
                    onClick={() => setOpenItemId(isItemOpen ? null : date)}
                    className='action'
                  >
                    <ArrowDownRight color='#1E1E1E' />
                  </span>
                ) : (
                  <p className='time'>
                    {time[0]}
                  </p>
                )}
              </div>

              {time.length > 1 && (
                <div 
                  style={{ transition: `${tabActive === 'loggingHistory' && '350ms'}` }}
                  className={`content ${isItemOpen ? 'opened' : ''}`}
                >
                  {time?.map((time, i) => (
                    <p key={i}>
                      {time}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default GuestHistory
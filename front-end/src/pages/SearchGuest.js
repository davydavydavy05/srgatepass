import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import {
  useSrContext,
  INSERT_ROUTE,
  validateUser
} from '../context'

import { fetchGuests } from '../utils'

import { Back, Search } from '../assets/svg'

import '../css/search_guest.css'

function SearchGuest({ forwardRef }) {
  const navigate = useNavigate()
  const [initialState, dispatch] = useSrContext()
  const details = JSON.parse(window.localStorage.getItem('profile'))
  const [guests, setGuests] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [routeDest, setRouteDest] = useState('')

  // Handle search
  const handleSearch = (event) => {
    const { value } = event.target

    if (value === '') {
      setSearchResults([])
    } else {
      const filteredResults = guests.filter(guest =>
        guest.name.toLowerCase().includes(value.toLowerCase())
      )
      
      setSearchResults(filteredResults)
    }

    setSearchTerm(value)
  }

  // Use effect
  useEffect(() => {
    document.title = 'Search Guest'

    const cookie = document.cookie?.split('; ')?.find((row) => row.startsWith('routesHistory='))?.split('=')[1]
    const routeHistory = cookie?.split(',')

    document.cookie = `routesHistory=${routeHistory}`

    if (routeHistory[routeHistory?.length - 1] !== 'search-guest') {
      routeHistory.push('search-guest')
      document.cookie = `routesHistory=${routeHistory}`
    } else {
      setRouteDest(routeHistory[routeHistory?.length - 2])
    }
    
    dispatch({ type: INSERT_ROUTE, payload: routeHistory })

    async function validate() {
      const token = window.localStorage.getItem('user')
      const res = await validateUser(dispatch, { token })

      if (res?.status === 401) {
        navigate('/login')
      }
    }

    async function getGuests() {
      const res = await fetchGuests({ userId: details.userId })
      setGuests(res.data)
    }

    validate()
    getGuests()
  }, [])

  return (
    <section ref={forwardRef} id='search_guest'>
      {/* Back Button */}
      <Link to={`../${routeDest}`} className='text btn'>
        <Back />
        <span>Back</span>
      </Link>

      {/* Heading */}
      <h1 style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}>
        Search Guest
      </h1>

      {/* Search Bar */}
      <div className='searchBar form-group'>
        <label>Name of Guest</label>

        <div className='input-field'>
          <span className='prefix'>
            <Search />
          </span>

          <input 
            type='text' 
            placeholder='Search guest' 
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      {/* Result */}
      <div className='result'>
        {searchResults.map((guest, i) => (
          <Link 
            to={`/guest-overview/${guest._id}`} 
            key={i} 
            className='item'
          >
            <div className='nameAndContactNum'>
              <p 
                style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}
                className='name'
              >
                {`${guest?.name.length > 20 ? guest?.name.slice(0, 20) + '...' : guest?.name.slice(0, 20)}`}
              </p>
              
              <p className='contactNum'>
                {guest?.phoneNumber}
              </p>
            </div>

            <p 
              style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}
              className='log'
            >
              Yesterday at 10:00 AM
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default SearchGuest
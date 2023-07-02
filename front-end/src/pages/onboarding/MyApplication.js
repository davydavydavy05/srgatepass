import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { EditApplicationStep1 } from '../../pages'

import { 
  useSrContext,
  INSERT_ROUTE,
  SET_ACTIVE_PAGE,
  validateUser
} from '../../context'

import { formatBirthdate, formatBytes } from '../../utils'

import { 
  Back,
  Edit,
  Download,
  PDF,
  Picture
} from '../../assets/svg'

import '../../css/my_application.css'

function MyApplication() {
  const myApplicationContRef = useRef(null)
  const editApplicationContRef = useRef(null)
  const headerRef = useRef(null)
  const navigate = useNavigate()
  const [initialState, dispatch] = useSrContext()
  const details = JSON.parse(window.localStorage.getItem('application'))
  const [headingFontSize, setHeadingFontSize] = useState(40)

  // Handle scroll
  const handleScroll = () => {
    if (window.scrollY > 5) {
      headerRef.current.style.display = 'none !important'
      headerRef.current.style.boxShadow = '0px 4px 16px rgba(139, 139, 139, 0.25)'
      setHeadingFontSize(24)
    }
    
    if (window.scrollY < 5) {
      headerRef.current.style.boxShadow = 'none'
      setHeadingFontSize(40)
    }
  }

  // Navigate to Edit Application
  const navigateToEditApplication = (e) => {
    e.preventDefault()

    myApplicationContRef.current.style.transform = 'translateX(-150px)'
    myApplicationContRef.current.style.transition = '300ms ease'
    editApplicationContRef.current.style.visibility = 'visible'
    editApplicationContRef.current.style.transform = 'translateX(0)'
    editApplicationContRef.current.style.transition = '300ms ease'
    
    setTimeout(() => {
      navigate('/edit-application-step-1')
    }, 500)
  }

  // Format date and time
  const formatDateAndTime = (date) => {
    const dateTime = new Date(date)

    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }

    return dateTime.toLocaleString('en-US', options)
  }

  // Download file
  const downloadFile = async (publicId) => {
    const fileUrl = `https://res.cloudinary.com/dfc3s2kfc/raw/upload/v1687658461/${publicId}`

    try {
      const response = await fetch(fileUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')

      link.href = url
      link.download = fileUrl
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading image:', error)
    }
  }

  // Use effect
  useEffect(() => {
    editApplicationContRef.current.style.position = 'absolute'
    editApplicationContRef.current.style.top = '0'
    editApplicationContRef.current.style.bottom = '0'
    editApplicationContRef.current.style.left = '0'
    editApplicationContRef.current.style.right = '0'
    editApplicationContRef.current.style.visibility = 'hidden'
    editApplicationContRef.current.style.transform = 'translateX(100%)'
    editApplicationContRef.current.style.zIndex = '100'
  }, [])

  useEffect(() => {
    document.title = 'My Profile'

    const routeHistory = initialState.routeHistory
    dispatch({ type: INSERT_ROUTE, payload: [...routeHistory, 'my-profile'] })
    dispatch({ type: SET_ACTIVE_PAGE, payload: 'myProfile' })

    // Validate user
    async function validate() {
      const token = window.localStorage.getItem('user')
      const res = await validateUser(dispatch, { token })

      if (res?.status === 401) {
        navigate('/login')
      }
    }

    validate()

    console.log(details)

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <>
      {/* For Animation Purpose Only */}
      <EditApplicationStep1 forwardRef={editApplicationContRef} />
      
      <section ref={myApplicationContRef} id='my_application'>
        <div className='container'>
          {/* Header */}
          <header ref={headerRef} id='header'>
            <div>
              <Link to='/login' className='text btn'>
                <Back />
                <span>Log out</span>
              </Link>
            </div>
          </header>

          {/* Heading */}
          <h1 style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold', fontSize: headingFontSize }}>
            My Application
          </h1>

          {/* Info */}
          <div className='info'>
            <div className='personalInfo'>
              <h2 style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}>
                Personal Information
              </h2>

              <div className='info-group'>
                <label>Full Name</label>
                <p style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}>
                  {`${details?.firstName} ${details?.lastName}`}
                </p>
              </div>

              <div className='info-group'>
                <label>Username</label>
                
                <p style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}>
                  @{details?.username}
                </p>
              </div>

              <div className='info-group'>
                <label>Birthday</label>

                <p style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}>
                  {formatBirthdate(details?.birthdate)}
                </p>
              </div>

              <div className='info-group'>
                <label>Gender</label>

                <p style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}>
                  {details?.gender?.charAt(0).toUpperCase() + details?.gender?.slice(1)}
                </p>
              </div>

              <div className='info-group'>
                <label>Phone Number</label>

                <p style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}>
                  {details?.phoneNumber}
                </p>
              </div>

              <div className='info-group'>
                <label>Date Requested</label>

                <p style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}>
                  {formatDateAndTime(details?.dateRequested)}
                </p>
              </div>
            </div>

            <div className='propertyInfo'>
              <h2 style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}>Property Information</h2>

              <div className='info-group'>
                <label>Resident Type</label>

                <p style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}>
                  {details?.type[0]?.toUpperCase() + details.type?.slice(1)}
                </p>
              </div>

              <div className='info-group'>
                <label>Home Address</label>

                <p style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}>
                  {details?.address}
                </p>
              </div>

              <div className='info-group'>
                <label>Land Certificate</label>

                <div 
                  className='files'
                >
                  {details?.landCertificate?.map((file, i) => (
                    <div key={i} className='file'>
                      <div className='icon-and-info'>
                        <PDF />

                        <div className='info'>
                          <p className='name'>{file?.name}</p>
                          <p className='size'>{formatBytes(file?.size)}</p>
                        </div>
                      </div>

                      <a onClick={() => downloadFile(file?.name)} >
                        <Download />
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              <div className='info-group'>
                <label>Valid ID</label>

                <div 
                  className='files'
                >
                  {details?.validId?.map((file, i) => (
                    <div key={i} className='file'>
                      <div className='icon-and-info'>
                        <Picture />

                        <div className='info'>
                          <p className='name'>{file?.name}</p>
                          <p className='size'>{formatBytes(file?.size)}</p>
                        </div>
                      </div>

                      <a onClick={() => downloadFile(file?.name)} >
                        <Download />
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              <div className='info-group'>
                <label>2x2 Picture</label>

                <div 
                  className='files'
                >
                  {details?.picture?.map((file, i) => (
                    <div key={i} className='file'>
                      <div className='icon-and-info'>
                        <Picture />

                        <div className='info'>
                          <p className='name'>{file?.name}</p>
                          <p className='size'>{formatBytes(file?.size)}</p>
                        </div>
                      </div>

                      <a onClick={() => downloadFile(file?.name)} >
                        <Download />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Button */}
        <Link onClick={navigateToEditApplication} className='solid circle btn'>
          <Edit color='#FFF' />
        </Link>
      </section>
    </>
  )
}

export default MyApplication
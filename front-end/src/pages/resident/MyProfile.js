import React, { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { EditProfileStep1 } from '../../pages'

import { 
  useSrContext,
  INSERT_ROUTE,
  SET_ACTIVE_PAGE,
  validateUser
} from '../../context'

import { formatBirthdate } from '../../utils'

import { Edit } from '../../assets/svg'

import '../../css/my_profile.css'

function MyProfile() {
  const myProfileContRef = useRef(null)
  const editProfileContRef = useRef(null)
  const navigate = useNavigate()
  const [initialState, dispatch] = useSrContext()

  // Navigate to Edit Profile
  const navigateToEditProfile = (e) => {
    e.preventDefault()

    myProfileContRef.current.style.transform = 'translateX(-150px)'
    myProfileContRef.current.style.transition = '300ms ease'
    editProfileContRef.current.style.visibility = 'visible'
    editProfileContRef.current.style.transform = 'translateX(0)'
    editProfileContRef.current.style.transition = '300ms ease'
    
    setTimeout(() => {
      navigate('/edit-profile-step-1')
    }, 500)
  }

  // Use effect
  useEffect(() => {
    editProfileContRef.current.style.position = 'absolute'
    editProfileContRef.current.style.top = '0'
    editProfileContRef.current.style.bottom = '0'
    editProfileContRef.current.style.left = '0'
    editProfileContRef.current.style.right = '0'
    editProfileContRef.current.style.visibility = 'hidden'
    editProfileContRef.current.style.transform = 'translateX(100%)'
    editProfileContRef.current.style.zIndex = '100'
  }, [])

  useEffect(() => {
    document.title = 'My Profile'

    console.log(initialState)

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

    console.log(initialState)
  }, [])

  return (
    <>
      {/* For Animation Purpose Only */}
      <EditProfileStep1 forwardRef={editProfileContRef} />
      
      <section ref={myProfileContRef} id='my_profile'>
        <div className='container'>
          {/* Heading */}
          <h1 style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}>
            My Profile
          </h1>

          {/* Note */}
          {initialState.user?.isProfileRequestApprove === false && (
            <div id='note'>
              <p>Your profile is under review</p>
              <p>You requested to edit your profile and the admin need to approve it first.</p>
            </div>
          )}

          {/* Info */}
          <div className='info'>
            <div className='personalInfo'>
              <h2 style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}>
                Personal Information
              </h2>

              <div className='info-group'>
                <label>Full Name</label>
                <p style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}>
                  {`${initialState.user?.profile?.firstName} `}
                  {initialState.user?.profile?.hasOwnProperty('middleName') && `${initialState.user?.profile?.middleName} `}
                  {initialState.user?.profile?.lastName}
                </p>
              </div>

              <div className='info-group'>
                <label>Username</label>
                
                <p style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}>
                  @{initialState.user?.profile?.username}
                </p>
              </div>

              <div className='info-group'>
                <label>Birthday</label>

                <p style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}>
                  {formatBirthdate(initialState.user?.profile?.birthdate)}
                </p>
              </div>

              <div className='info-group'>
                <label>Gender</label>

                <p style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}>
                  {initialState?.user?.profile?.gender}
                </p>
              </div>

              <div className='info-group'>
                <label>Phone Number</label>

                <p style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}>
                  {initialState.user?.profile?.phoneNumber}
                </p>
              </div>

              <div className='info-group'>
                <label>Email Address</label>

                <p style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}>
                  {initialState.user?.profile?.emailAddress}
                </p>
              </div>
            </div>

            <div className='propertyInfo'>
              <h2 style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}>Property Information</h2>

              <div className='info-group'>
                <label>Resident Type</label>

                <p style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}>
                  {initialState.user?.profile?.type[0]?.toUpperCase() + initialState.user?.profile?.type?.slice(1)}
                </p>
              </div>

              <div className='info-group'>
                <label>Home Address</label>

                <p style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}>
                  {initialState.user?.profile?.address}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Button */}
        {initialState.user?.isProfileRequestApprove && (
          <Link onClick={navigateToEditProfile} className='solid circle btn'>
            <Edit color='#FFF' />
          </Link>
        )}
      </section>
    </>
  )
}

export default MyProfile
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { 
  useSrContext,
  UPDATE_PROFILE_DETAILS,
  INSERT_ROUTE,
  validateUser
} from '../../context'

import { uploadFile, formatBytes, updateUser } from '../../utils'

import {
  Back,
  PDF,
  Picture,
  Remove,
  Upload
} from '../../assets/svg'

import '../../css/edit_application.css'

function EditApplicationStep3() {
  const navigate = useNavigate()
  const [initialState, dispatch] = useSrContext()
  const details = JSON.parse(window.localStorage.getItem('application'))
  const [files, setFiles] = useState({
    landCertificate: details?.landCertificate,
    validId: details?.validId,
    picture: details?.picture
  })
  const [filesToUpload, setFilesToUpload] = useState({
    landCertificate: [],
    validId: [],
    picture: []
  })

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault()
  
    try {
      // Land Certificate
      if (filesToUpload.landCertificate.length !== 0) {
        const uploadLandCertificatePromises = filesToUpload.landCertificate.map(async (file, i) => {
          const res = await uploadFile(file)
          const fileName = res?.data?.public_id
          const newLandCertificateArr = [...files.landCertificate]

          newLandCertificateArr[i].name = fileName

          return newLandCertificateArr
        })
  
        const updatedLandCertificatesArr = await Promise.all(uploadLandCertificatePromises)
    
        setFiles((prevFiles) => ({
          ...prevFiles,
          landCertificate: updatedLandCertificatesArr
        }))
      }

      // Valid ID
      if (filesToUpload.validId.length !== 0) {
        const uploadValidIdPromises = filesToUpload.validId.map(async (file, i) => {
          const res = await uploadFile(file)
          const fileName = res?.data?.public_id
          const newValidIdArr = [...files.validId]

          newValidIdArr[i].name = fileName

          return newValidIdArr
        })
    
        const updatedValidIdArr = await Promise.all(uploadValidIdPromises);
    
        setFiles((prevFiles) => ({
          ...prevFiles,
          validId: updatedValidIdArr
        }))
      }

      // 2x2 Picture
      if (filesToUpload.validId.length !== 0) {
        const uploadPicturePromises = filesToUpload.picture.map(async (file, i) => {
          const res = await uploadFile(file)
          const fileName = res?.data?.public_id
          const newPictureArr = [...files.picture]

          newPictureArr[i].name = fileName

          return newPictureArr
        })
    
        const updatedPictureArr = await Promise.all(uploadPicturePromises)
    
        setFiles((prevFiles) => ({
          ...prevFiles,
          picture: updatedPictureArr
        }))
      }

      const res = await updateUser({
        ...initialState.userDetails,
        id: initialState.user?.profile?.userId,
        emailAddress: details?.emailAddress,
        landCertificate: files?.landCertificate,
        validId: files?.validId,
        picture: files?.picture,
      })

      if (res.status === 201) {
        window.localStorage.removeItem('application')
        window.localStorage.setItem('application', JSON.stringify(res.data))
        navigate('/edit-application-pending');
      }
    } catch (error) {
      console.log(error)
      throw new Error(error)
    }
  }

  // Handle scroll
  const handleScroll = () => {
    const header = document.getElementById('header')

    if (window.scrollY > 64) {
      header.style.boxShadow = '0px 4px 16px rgba(139, 139, 139, 0.25)'
    }
    
    if (window.scrollY < 64) {
      header.style.boxShadow = 'none'
    }
  }

  // Handle file
  const handleFile = (e, prop) => {
    const selectedFiles = e.target.files
    const selectedFileArray = Array.from(selectedFiles)

    const newArr = selectedFileArray.map(file => ({
      name: file.name,
      size: file.size
    }))

    setFiles({ ...files, [prop]: newArr })
    setFilesToUpload({ ...filesToUpload, [prop]: selectedFileArray })
  }

  // Remove rile
  const removeFile = (i, prop) => {
    const updatedFiles = [...files[prop]]
    updatedFiles.splice(i, 1)

    setFiles({ ...files, [prop]: updatedFiles })
  }

  // Use effect
  useEffect(() => {
    document.title = 'Edit Application'

    const routeHistory = initialState.routeHistory
    dispatch({ type: INSERT_ROUTE, payload: [...routeHistory, 'edit-application-step-3'] })

    // Validate user
    async function validate() {
      const token = window.localStorage.getItem('user')
      const res = await validateUser(dispatch, { token })

      if (res?.status === 401) {
        navigate('/login')
      }
    }

    validate()

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <section id='edit_application'>
      {/* Header */}
      <header id='header'>
        <div>
          <Link to='/edit-application-step-2' className='text btn'>
            <Back />
            <span>Back</span>
          </Link>

          <div id='progress-bar' className='progress-bar'>
            <span className='active bar'></span>
            <span className='active bar'></span>
            <span className='bar'></span>
          </div>
        </div>
      </header>

      {/* Heading */}
      <h1 style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}>
        Edit Application
      </h1>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <h2 style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}>
          Proof of Residency
        </h2>

        <div className='inputFields'>
          <div className='form-group'>
            <label style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}>
              Land Certificate 
              <span className='required-symbol'>*</span>
              <span className='guide'>(or any document to prove)</span>
            </label>

            <div className='input-image-field'>
              <input 
                type='file' 
                name='landCertificate'
                accept='application/pdf' 
                onChange={(e) => handleFile(e, 'landCertificate')}
                multiple
              />
              
              <Upload />

              <div>
                <p>Click to upload</p>
                <p>5 mb maximum file size</p>
              </div>
            </div>
          </div>

          <div 
            className='files'
            style={{ display: `${files.landCertificate?.length !== 0 ? 'grid' : 'none'}` }}
          >
            {files.landCertificate?.map((file, i) => (
              <div key={i} className='file'>
                <div className='icon-and-info'>
                  <PDF />

                  <div className='info'>
                    <p className='name'>{file?.name}</p>
                    <p className='size'>{formatBytes(file?.size)}</p>
                  </div>
                </div>

                <a onClick={() => removeFile(i, 'landCertificate')}>
                  <Remove />
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className='form-group'>
          <label style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}>
            Valid ID 
            <span className='required-symbol'>*</span>
            <span className='guide'>(or any document to prove)</span>
          </label>

          <div className='input-image-field'>
            <input type='file' accept='application/pdf' />
            
            <Upload />

            <div>
              <p>Click to upload</p>
              <p>5 mb maximum file size</p>
            </div>
          </div>
        </div>

        <div 
          className='files'
          style={{ display: `${files.validId?.length !== 0 ? 'grid' : 'none'}` }}
        >
          {files.validId?.map((file, i) => (
            <div key={i} className='file'>
              <div className='icon-and-info'>
                <PDF />

                <div className='info'>
                  <p className='name'>{file?.name}</p>
                  <p className='size'>{formatBytes(file?.size)}</p>
                </div>
              </div>

              <a onClick={() => removeFile(i, 'validId')}>
                <Remove />
              </a>
            </div>
          ))}
        </div>

        <div className='form-group'>
          <label style={{ fontFamily: initialState.isiOSDevice ? '-apple-system, BlinkMacSystemFont, sans-serif' : 'SFProDisplay-Bold' }}>
            2x2 Picture 
            <span className='required-symbol'>*</span>
            <span className='guide'>(must be hd and updated)</span>
          </label>

          <div className='input-image-field'>
            <input
              type='file' 
              accept='image/*' 
              onChange={(e) => handleFile(e, 'picture')}
            />
            
            <Upload />

            <div>
              <p>Click to upload</p>
              <p>5 mb maximum file size</p>
            </div>
          </div>
        </div>

        <div 
          className='files'
          style={{ display: `${files.picture?.length !== 0 ? 'grid' : 'none'}` }}
        >
          {files.picture?.map((file, i) => (
            <div key={i} className='file'>
              <div className='icon-and-info'>
                <Picture />

                <div className='info'>
                  <p className='name'>{file?.name}</p>
                  <p className='size'>{formatBytes(file?.size)}</p>
                </div>
              </div>

              <a onClick={() => removeFile(i, 'picture')}>
                <Remove />
              </a>
            </div>
          ))}
        </div>

        <div className='actions'>
          <input type='submit' value='Save' className='solid btn' />

          <Link to='/my-application' className='outline btn'>Cancel</Link>
        </div>
      </form>
    </section>
  )
}

export default EditApplicationStep3
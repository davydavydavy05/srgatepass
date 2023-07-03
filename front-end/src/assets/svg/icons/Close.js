import React, { useState } from 'react'

function Close({ color = '#1E1E1E' }) {
  const [isHoldingClick, setIsHoldingClick] = useState(false)

  // Handle Touch Start
  const handleTouchStart = () => {
    setIsHoldingClick(true)
  }

  // Handle Touch End
  const handleTouchEnd = () => {
    setIsHoldingClick(false)
  }

  return (
    <svg 
      width='24' 
      height='25' 
      viewBox='0 0 20 21' 
      fill='none' 
      xmlns='http://www.w3.org/2000/svg'
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <path d='M15 5.5L5 15.5' stroke={isHoldingClick ? '#353535' : color} strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'/>
      <path d='M5 5.5L15 15.5' stroke={isHoldingClick ? '#353535' : color} strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'/>
    </svg>
  )
}

export default Close
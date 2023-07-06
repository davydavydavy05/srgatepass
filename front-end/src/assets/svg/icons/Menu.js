import React, { useState } from 'react'

function Menu({ color = '#606060' }) {
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
      height='24' 
      viewBox='0 0 20 20' 
      fill='none' 
      xmlns='http://www.w3.org/2000/svg' 
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <path d='M2.5 7.5H17.5' stroke={isHoldingClick ? '#353535' : color} strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'/>
      <path d='M2.5 12.5H17.5' stroke={isHoldingClick ? '#353535' : color} strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'/>
    </svg>
  )
}

export default Menu
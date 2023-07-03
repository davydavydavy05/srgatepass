import { useState } from 'react'

function Bell({ color = '#B1B3B6' }) {
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
      viewBox='0 0 24 24' 
      fill='none' 
      xmlns='http://www.w3.org/2000/svg'
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <path d='M12.3997 2C10.4902 2 8.65884 2.75857 7.30858 4.10883C5.95831 5.45909 5.19974 7.29044 5.19974 9.2V13.5032L4.35134 14.3516C4.18357 14.5194 4.06933 14.7332 4.02304 14.966C3.97676 15.1987 4.00053 15.4399 4.09133 15.6592C4.18213 15.8784 4.3359 16.0658 4.53319 16.1977C4.73049 16.3295 4.96244 16.4 5.19974 16.4H19.5997C19.837 16.4 20.069 16.3295 20.2663 16.1977C20.4636 16.0658 20.6174 15.8784 20.7082 15.6592C20.799 15.4399 20.8227 15.1987 20.7764 14.966C20.7302 14.7332 20.6159 14.5194 20.4481 14.3516L19.5997 13.5032V9.2C19.5997 7.29044 18.8412 5.45909 17.4909 4.10883C16.1407 2.75857 14.3093 2 12.3997 2ZM12.3997 21.2C11.445 21.2 10.5293 20.8207 9.85416 20.1456C9.17903 19.4705 8.79974 18.5548 8.79974 17.6H15.9997C15.9997 18.5548 15.6205 19.4705 14.9453 20.1456C14.2702 20.8207 13.3545 21.2 12.3997 21.2Z' fill={isHoldingClick ? '#606060' : color}/>
    </svg>
  )
}

export default Bell
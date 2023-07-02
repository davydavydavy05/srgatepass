function Remove({ color = '#1E1E1E' }) {
  return (
    <svg width='20' height='21' viewBox='0 0 20 21' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M15 5.5L5 15.5' stroke={color} strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'/>
      <path d='M5 5.5L15 15.5' stroke={color} strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'/>
    </svg>
  )
}

export default Remove
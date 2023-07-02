function Pin({ color = '#5CB950' }) {
  return (
    <svg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M5.33366 2.97403C5.33366 2.43609 5.76975 2 6.30769 2H9.69296C10.2309 2 10.667 2.43609 10.667 2.97403V3.11964C10.667 4.56308 11.0943 5.97422 11.8949 7.17524L12.5868 8.21308C12.9508 8.75902 12.664 9.50074 12.0275 9.65988C9.3834 10.3209 6.61725 10.3209 3.97317 9.65988C3.33663 9.50074 3.04987 8.75902 3.41383 8.21308L4.10572 7.17524C4.9064 5.97422 5.33366 4.56308 5.33366 3.11964V2.97403Z' fill={color}/>
      <path d='M8 13.3333L8 9' stroke={color} strokeWidth='2' strokeLinecap='round'/>
      <path d='M4 13.3333H12' stroke={color} strokeWidth='2'/>
    </svg>
  )
}

export default Pin
/**
 ** This function outputs the countdown timer for the resend OTP code link
 ** We usually use this as the argument of the renderer parameter of Timer component
**/

export default function renderer({ minutes, seconds }) {
  return (
    <span
      style={{ marginLeft: '4px', fontFamily: 'SFProDisplay-Medium' }}
    >
      Resend in {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
    </span>
  )
};
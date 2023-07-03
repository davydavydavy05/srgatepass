/**
 ** This function generates 6 random numbers to be used as the OTP code
**/

const generateOtp = () => {
  var otp = []

  for (let i = 0; i < 6; i++) {
    let rand = Math.floor(Math.random() * (9 - 1 + 1)) + 1
    otp.push(rand)
  }

  otp = parseInt(otp.join(''))
  return otp
}

export default generateOtp
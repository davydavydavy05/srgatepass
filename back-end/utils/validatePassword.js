/**
 ** This function validates the user-created password with the NIST policy
**/

import passwordValidator from 'password-validator'

const validatePassword = (password) => {
  const schema = new passwordValidator()

  // Check if the password is minimum of 8 characters
  if (!schema.is().min(8).validate(password)) {
    console.error('Password must be minimum of 8 characters')
    return { isValidate: false, errorMessage: 'Password must be minimum of 8 characters' }
  }

  // Check if the password is maximum of 24 characters
  if (!schema.is().max(100).validate(password)) {
    console.error('Password must be maximum of 24 characters')
    return { isValidate: false, errorMessage: 'Password must be maximum of 24 characters' }
  }

  // Check if the password has at least one lowercase letter
  if (!schema.has().lowercase().validate(password)) {
    console.error('Password must have at least one lowercase letter')
    return { isValidate: false, errorMessage: 'Password must have at least one lowercase letter' }
  }

  // Check if the password has at least one uppercase letter
  if (!schema.has().uppercase().validate(password)) {
    console.error('Password must have at least one uppercase letter')
    return { isValidate: false, errorMessage: 'Password must have at least one uppercase letter' }
  }

  // Check if the password has at least one digit
  if (!schema.has().digits().validate(password)) {
    console.error('Password must have at least one digit')
    return { isValidate: false, errorMessage: 'Password must have at least one digit' }
  }

  // Check if the password has at least one special character
  if (!schema.has().symbols().validate(password)) {
    console.error('Password must have at least one special character')
    return { isValidate: false, errorMessage: 'Password must have at least one special character' }
  }

  // Check if the password has contain spaces
  if (!schema.has().not().spaces().validate(password)) {
    console.error('Password should not contain spaces')
    return { isValidate: false, errorMessage: 'Password should not contain spaces' }
  }

  return { isValidate: true, errorMessage: '' }
}

export default validatePassword
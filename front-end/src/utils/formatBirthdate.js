/**
 ** This function formats birthdate
**/

export default function formatBirthdate(birthdate) {
  const date = new Date(birthdate)
  const options = { month: 'long', day: 'numeric', year: 'numeric' }
  const formattedDate = date.toLocaleDateString('en-US', options)

  return formattedDate
}
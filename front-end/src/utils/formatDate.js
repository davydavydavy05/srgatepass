/**
 ** This function formats date
**/

export default function formatDate(dateString) {
  const date = new Date(dateString)
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)

  // Remove the year if it is the same as today's year
  var formattedDate = date.toLocaleDateString(undefined, {
    year: (date.getFullYear() !== today.getFullYear()) ? 'numeric' : undefined,
    month: 'short',
    day: 'numeric'
  })

  // Check if the date is today or yesterday
  if (date.toDateString() === today.toDateString()) {
    formattedDate = 'Today'
  } else if (date.toDateString() === yesterday.toDateString()) {
    formattedDate = 'Yesterday'
  }

  return formattedDate
}
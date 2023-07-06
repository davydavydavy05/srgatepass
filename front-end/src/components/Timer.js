import { useEffect, useState } from 'react'
import Countdown from 'react-countdown'
import { SET_COUNTDOWN_START } from '../context/index'

function Timer({ countdownName, delay, renderer, start, dispatch }) {
  const [timer, setTimer] = useState({ date: Date.now(), delay })
  const savedDate = localStorage.getItem(countdownName)
  const currentTime = Date.now()
  const delta = parseInt(savedDate, 10) - currentTime

  // On start
  const onStart = (delta) => {
    localStorage.getItem(countdownName) == null && localStorage.setItem(countdownName,JSON.stringify(timer.date + timer.delay))
  }

  // On complete
  const onComplete = () => {
    if (localStorage.getItem(countdownName) != null) {
      localStorage.removeItem(countdownName)
      dispatch({ type: SET_COUNTDOWN_START, payload: false })
    }
  }

  // Use effect
  useEffect(() => {
    if (savedDate != null && !isNaN(savedDate)) {
      if (delta > delay) {
        if (localStorage.getItem(countdownName).length > 0) localStorage.removeItem(countdownName)
      } else {
        setTimer({ date: currentTime, delay: delta })
      }
    }
  }, [])

  return (
    <div>
      <Countdown
        date={start && timer.date + timer.delay}
        renderer={renderer}
        onStart={onStart}
        onComplete={onComplete}
      />
    </div>
  )
}

export default Timer
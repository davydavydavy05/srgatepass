import React from 'react'
import '../css/node.css'

const Node = ({ isStart, isEnd, row, col, isWall, label }) => {
  const classes = isStart
    ? 'node-start'
    : isWall
    ? 'wall'
    : isEnd
    ? 'node-End'
    : ''

  return (
    <div
      className={`node ${classes}`}
      id={`node-${row}-${col}`}
    >
      {label && <div className="node-label">{label}</div>}
    </div>
  )
}

export default Node
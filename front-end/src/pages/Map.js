import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { Node } from '../components'

import { useSrContext } from '../context'

import {
  INSERT_ROUTE,
  SET_ACTIVE_PAGE,
  validateUser
} from '../context'

import { endNodes, walls } from '../constants'
import { astar } from '../utils'

import '../css/map.css'

const rows = 60
const cols = 60

const NODE_START_ROW = 59
const NODE_START_COL = 45

function Map() {
  const navigate = useNavigate()
  const [, dispatch] = useSrContext()
  const [Grid, setGrid] = useState([])
  const [searchInput, setSearchInput] = useState('')
  const [previousPath, setPreviousPath] = useState([])
  const [previousVisitedNodes, setPreviousVisitedNodes] = useState([])

  // Spot
  function Spot(i, j) {
    this.x = j
    this.y = i

    this.isStart = this.x === NODE_START_ROW && this.y === NODE_START_COL

    this.isEnd = endNodes.some(
      node => this.x === node.row && this.y === node.col
    )

    this.g = 0
    this.f = 0
    this.h = 0
    this.neighbours = []
    this.isWall = false
    this.previous = undefined
    this.label = getLabel(this.x, this.y) // Add label property
    this.houseName = houseName(this.x, this.y) // Add label property
    this.isStartVisited = false
    this.isEndVisited = false

    this.addNeighbours = function (grid) {
      let i = this.x
      let j = this.y

      if (i > 0) this.neighbours.push(grid[i - 1][j])
      if (i < rows - 1) this.neighbours.push(grid[i + 1][j])
      if (j > 0) this.neighbours.push(grid[i][j - 1])
      if (j < cols - 1) this.neighbours.push(grid[i][j + 1])
    }
  }

  // Create Spot
  const createSpot = grid => {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        grid[i][j] = new Spot(j, i)
        grid[i][j].isWall = false

        const isFixedWall = walls.some(
          wall => wall.row === i && wall.col === j
        )

        if (isFixedWall) grid[i][j].isWall = true
      }
    }

    for (const { row, col, label } of endNodes) {
      grid[row][col].isWall = false
      grid[row][col].label = label
    }
  }

  // Add Neighbours
  const addNeighbours = grid => {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        grid[i][j].addNeighbours(grid)
      }
    }
  }

  // Initialize Grid
  const initializeGrid = () => {
    const grid = new Array(rows)

    for (let i = 0; i < rows; i++) {
      grid[i] = new Array(cols)
    }

    createSpot(grid)
    setGrid(grid)
    addNeighbours(grid)
  }

  // Get Label
  const getLabel = (x, y) => {
    if (x === NODE_START_ROW && y === NODE_START_COL) {
      return
    }

    const endNode = endNodes.find(node => node.row === x && node.col === y)

    if (endNode) {
      return endNode.label
    }

    return ''
  }

  // Get House Name
  const houseName = (x, y) => {
    const endNode = endNodes.find(node => node.row === x && node.col === y)

    if (endNode) {
      return endNode.houseName
    }

    return ''
  }

  // Handle Search And Visualize
  const handleSearchAndVisualize = () => {
    const selectedEndNode = findEndNodeByName(searchInput)

    if (selectedEndNode) {
      const startNode = Grid[NODE_START_ROW][NODE_START_COL]
      const endNode = selectedEndNode
      const path = astar(startNode, endNode)

      if (path) {
        startNode.isStartVisited = true
        endNode.isEndVisited = true
        visualizePath(path.path, path.visitedNodes)

        document.getElementById('node-59-45').style.backgroundColor = '#28CE28'
      }
    }
  }

  // Find End Node By Name
  const findEndNodeByName = name => {
    const selectedEndNode = endNodes.find(node => node.houseName === name)

    if (selectedEndNode) {
      return Grid[selectedEndNode.row][selectedEndNode.col]
    }

    return null
  }

  // Visualize Path
  const visualizePath = (shortestPathNodes, visitedNodes) => {
    clearPreviousPath()

    for (let i = 0; i < visitedNodes.length; i++) {
      setTimeout(() => {
        const node = visitedNodes[i]
        const element = document.getElementById(`node-${node.x}-${node.y}`)
        
        if (
          !node.isStartVisited &&
          !node.isEndVisited &&
          !element.classList.contains('node-End')
        ) {
          element.className = 'node node-visited'
        }
      }, 0.75 * i)
    }

    setTimeout(() => {
      for (let i = 0; i < shortestPathNodes.length; i++) {
        const node = shortestPathNodes[i]
        const element = document.getElementById(`node-${node.x}-${node.y}`)

        if (
          !node.isStartVisited &&
          !node.isEndVisited &&
          !element.classList.contains('node-End')
        ) {
          element.className = 'node node-shortest-path'
        }
      }
    }, 0.75 * visitedNodes.length)

    setPreviousPath(shortestPathNodes)
    setPreviousVisitedNodes(visitedNodes)
  }

  // Clear Previous Path
  const clearPreviousPath = () => {
    for (let i = 0; i < previousVisitedNodes.length; i++) {
      const node = previousVisitedNodes[i]
      const element = document.getElementById(`node-${node.x}-${node.y}`)

      if (
        !node.isStartVisited &&
        !node.isEndVisited &&
        !element.classList.contains('node-End')
      ) {
        element.className = 'node'
      }
    }

    for (let i = 0; i < previousPath.length; i++) {
      const node = previousPath[i]
      const element = document.getElementById(`node-${node.x}-${node.y}`)

      if (
        !node.isStartVisited &&
        !node.isEndVisited &&
        !element.classList.contains('node-End')
      ) {
        element.className = 'node'
      }
    }

    setPreviousPath([]) // Clear previous path array
    setPreviousVisitedNodes([]) // Clear previous visited nodes array
  }

  // Use Effect
  useEffect(() => {
    document.title = 'Map'

    const cookie = document.cookie?.split('; ')?.find((row) => row.startsWith('routesHistory='))?.split('=')[1]
    const routeHistory = cookie?.split(',')

    document.cookie = `routesHistory=${routeHistory}`
    routeHistory.push('map')
    document.cookie = `routesHistory=${routeHistory}`
    
    dispatch({ type: INSERT_ROUTE, payload: routeHistory })
    dispatch({ type: SET_ACTIVE_PAGE, payload: 'map' })

    // Validate user
    async function validate() {
      let token = window.localStorage.getItem('user')
      let res = await validateUser(dispatch, { token })

      if (res?.status === 401) {
        navigate('/login')
      }
    }
    
    validate()
    initializeGrid()
  }, [])

  return (
    <div id='map'>
      {/* Search Bar */}
      <div className='searchBar'>
        <input
          type='text'
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          placeholder='Example: Phase 1 Unit 5'
        />
        <button onClick={handleSearchAndVisualize} className='solid btn'>Search</button>
      </div>

      {/* Blue Print */}
      <div className='bluePrint'>
        <div className='gridWrapper'>
          {/* Road Labels */}
          <p className='roadLabel'>RD. Phase 3 Block 3</p>
          <p className='roadLabel'>RD. Phase 3 Block 2</p>
          <p className='roadLabel'>RD. Phase 3 Block 1</p>
          <p className='roadLabel'>RD. Phase 3 Block 4</p>

          <p className='roadLabel'>RD. Phase 3 Block 5</p>
          <p className='roadLabel'>RD. Phase 2 Block 6</p>
          <p className='roadLabel'>RD. Phase 2 Block 5</p>
          <p className='roadLabel'>RD. Phase 2 Block 4</p>
          <p className='roadLabel'>RD. Phase 2 Block 3</p>
          <p className='roadLabel'>RD. Phase 2 Block 2</p>

          <p className='roadLabel'>RD. Phase 1 Block 6</p>
          <p className='roadLabel'>RD. Phase 1 Block 5</p>
          <p className='roadLabel'>RD. Phase 1 Block 4</p>
          <p className='roadLabel'>RD. Phase 1 Block 3</p>
          <p className='roadLabel'>RD. Phase 1 Block 2</p>
          <p className='roadLabel'>RD. Phase 1 Block 1</p>
          
          <p className='roadLabel'>Clubhouse</p>
          <p className='roadLabel'>Court</p>

          {/* Nodes */}
          {Grid.map((rows, rowsIndex) => (
            <div key={rowsIndex} className='rowWrapper'>
              {rows.map((col, colIndex) => {
                const { isStart, isEnd, isWall, label, image } = col

                return (
                  <Node
                    key={colIndex}
                    isStart={isStart}
                    isEnd={isEnd}
                    row={rowsIndex}
                    col={colIndex}
                    isWall={isWall}
                    label={label}
                    image={image}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Map
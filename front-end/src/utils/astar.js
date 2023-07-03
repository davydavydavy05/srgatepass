/**
 ** This function visualizes the path
**/

function Astar(startNode, endNode) {
  var openSet = []
  var closedSet = []
  var path = []
  var visitedNodes = []

  openSet.push(startNode)

  while (openSet.length > 0) {
    var leastIndex = 0

    for (let i = 0; i < openSet.length; i++) {
      if (openSet[i].f < openSet[leastIndex].f) {
        leastIndex = i
      }
    }

    var current = openSet[leastIndex]
    visitedNodes.push(current)

    if (current === endNode) {
      let temp = current
      path.push(temp)

      while (temp.previous) {
        path.push(temp.previous)
        temp = temp.previous
      }
      
      return { path, visitedNodes }
    }
    
    openSet = openSet.filter(elt => elt !== current)
    closedSet.push(current)

    var neighbours = current.neighbours

    for (let i = 0; i < neighbours.length; i++) {
      var neighbour = neighbours[i]

      if (!closedSet.includes(neighbour) && !neighbour.isWall) {
        var tempG = current.g + 1
        var newPath = false

        if (openSet.includes(neighbour)) {
          if (tempG < neighbour.g) {
            neighbour.g = tempG
            newPath = true
          }
        } else {
          neighbour.g = tempG
          newPath = true
          openSet.push(neighbour)
        }

        if (newPath) {
          neighbour.h = heruistic(neighbour, endNode)
          neighbour.f = neighbour.g + neighbour.h

          neighbour.previous = current
        }
      }
    }
  }
  return { path, visitedNodes, error: 'No Path Found' }
}

function heruistic(a, b) {
  var d = Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
  return d
}

export default Astar

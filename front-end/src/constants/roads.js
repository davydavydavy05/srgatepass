const roads = [
  { row: 15, col: 2 }, { row: 15, col: 3 }, { row: 15, col: 4 }, { row: 15, col: 5 }, { row: 15, col: 6 }, 
  { row: 15, col: 7 }, { row: 15, col: 8 }, { row: 15, col: 9 }, { row: 15, col: 10 }, { row: 15, col: 11 },
  { row: 15, col: 12 },{ row: 15, col: 13 }, { row: 15, col: 14 }, { row: 15, col: 15 }, { row: 15, col: 16 }, 
  { row: 15, col: 17 }, { row: 15, col: 18 }, { row: 15, col: 19 }, { row: 15, col: 20 }, { row: 15, col: 21 },
  { row: 15, col: 22 }, { row: 15, col: 23 }, { row: 15, col: 24 },

  { row: 2, col: 24 }, { row: 3, col: 24 }, { row: 4, col: 24 }, { row: 5, col: 24 }, { row: 6, col: 24 },
  { row: 7, col: 24 }, { row: 8, col: 24 }, { row: 9, col: 24 }, { row: 10, col: 24 }, { row: 11, col: 24 },
  { row: 12, col: 24 }, { row: 13, col: 24 }, { row: 14, col: 24 },

  { row: 4, col: 25 }, { row: 4, col: 26 }, { row: 4, col: 27 }, { row: 4, col: 28 }, { row: 4, col: 29 },
  { row: 4, col: 30 }, { row: 4, col: 31 }, { row: 4, col: 32 }, { row: 4, col: 33 }, { row: 4, col: 34 },
  { row: 4, col: 35 }, { row: 4, col: 36 }, { row: 4, col: 37 }, { row: 4, col: 38 }, { row: 4, col: 39 },
  { row: 4, col: 40 }, { row: 4, col: 41 }, { row: 4, col: 42 }, { row: 4, col: 43 }, { row: 4, col: 44 },
  { row: 4, col: 45 }, { row: 4, col: 46 }, { row: 4, col: 47 }, { row: 4, col: 48 }, { row: 4, col: 49 },
  { row: 4, col: 50 }, { row: 4, col: 51 }, { row: 4, col: 52 }, { row: 4, col: 53 }, { row: 4, col: 54 },
  { row: 4, col: 55 },

  { row: 10, col: 25 }, { row: 10, col: 26 }, { row: 10, col: 27 }, { row: 10, col: 28 }, { row: 10, col: 29 },
  { row: 10, col: 31 }, { row: 10, col: 30 }, { row: 10, col: 32 }, { row: 10, col: 33 }, { row: 10, col: 34 }, 
  { row: 10, col: 35 }, { row: 10, col: 36 }, { row: 10, col: 37 }, { row: 10, col: 38 }, { row: 10, col: 39 }, 
  { row: 10, col: 40 }, { row: 10, col: 41 }, { row: 10, col: 42 }, { row: 10, col: 43 }, { row: 10, col: 44 }, 
  { row: 10, col: 45 }, { row: 10, col: 46 }, { row: 10, col: 47 }, { row: 10, col: 48 }, { row: 10, col: 49 }, 
  { row: 10, col: 50 }, { row: 10, col: 51 }, { row: 10, col: 52 }, { row: 10, col: 53 }, { row: 10, col: 54 }, 
  { row: 10, col: 55 },

  { row: 16, col: 24 }, { row: 16, col: 25 }, { row: 16, col: 26 }, { row: 16, col: 27 }, { row: 16, col: 28 },
  { row: 16, col: 29 }, { row: 16, col: 30 }, { row: 16, col: 31 }, { row: 16, col: 32 }, { row: 16, col: 33 },
  { row: 16, col: 34 }, { row: 16, col: 35 }, { row: 16, col: 36 }, { row: 16, col: 37 }, { row: 16, col: 38 },
  { row: 16, col: 39 }, { row: 16, col: 40 }, { row: 16, col: 41 }, { row: 16, col: 42 }, { row: 16, col: 43 },
  { row: 16, col: 44 }, { row: 16, col: 45 }, { row: 16, col: 46 }, { row: 16, col: 47 }, { row: 16, col: 48 },
  { row: 16, col: 49 }, { row: 16, col: 50 }, { row: 16, col: 51 }, { row: 16, col: 52 }, { row: 16, col: 53 },
  { row: 16, col: 54 }, { row: 16, col: 55 },
  
  { row: 16, col: 5 }, { row: 17, col: 5 }, { row: 18, col: 5 }, { row: 19, col: 5 }, { row: 20, col: 5 },
  { row: 21, col: 5 }, { row: 22, col: 5 }, { row: 23, col: 5 }, { row: 24, col: 5 }, { row: 25, col: 5 },
  { row: 26, col: 5 }, { row: 27, col: 5 }, { row: 28, col: 5 }, { row: 29, col: 5 }, { row: 30, col: 5 },
  { row: 31, col: 5 }, { row: 32, col: 5 }, { row: 33, col: 5 }, { row: 34, col: 5 }, { row: 35, col: 5 },
  { row: 36, col: 5 },

  { row: 16, col: 12 }, { row: 17, col: 12 }, { row: 18, col: 12 }, { row: 19, col: 12 }, { row: 20, col: 12 },
  { row: 21, col: 12 }, { row: 22, col: 12 }, { row: 23, col: 12 }, { row: 24, col: 12 }, { row: 25, col: 12 },
  { row: 26, col: 12 }, { row: 27, col: 12 }, { row: 28, col: 12 }, { row: 29, col: 12 }, { row: 30, col: 12 },
  { row: 31, col: 12 }, { row: 32, col: 12 }, { row: 33, col: 12 }, { row: 34, col: 12 }, { row: 35, col: 12 },
  { row: 36, col: 12 },

  { row: 16, col: 19 }, { row: 17, col: 19 }, { row: 18, col: 19 }, { row: 19, col: 19 }, { row: 20, col: 19 },
  { row: 21, col: 19 }, { row: 22, col: 19 }, { row: 23, col: 19 }, { row: 24, col: 19 }, { row: 25, col: 19 },
  { row: 26, col: 19 }, { row: 27, col: 19 }, { row: 28, col: 19 }, { row: 29, col: 19 }, { row: 30, col: 19 },
  { row: 31, col: 19 }, { row: 32, col: 19 }, { row: 33, col: 19 }, { row: 34, col: 19 }, { row: 35, col: 19 },
  { row: 36, col: 19 },

  { row: 17, col: 26 }, { row: 18, col: 26 }, { row: 19, col: 26 }, { row: 20, col: 26 }, { row: 21, col: 26 },
  { row: 22, col: 26 }, { row: 23, col: 26 }, { row: 24, col: 26 }, { row: 25, col: 26 }, { row: 26, col: 26 },
  { row: 27, col: 26 }, { row: 28, col: 26 }, { row: 29, col: 26 }, { row: 30, col: 26 }, { row: 31, col: 26 },
  { row: 32, col: 26 }, { row: 33, col: 26 }, { row: 34, col: 26 }, { row: 35, col: 26 }, { row: 36, col: 26 },

  { row: 25, col: 27 }, { row: 25, col: 28 }, { row: 25, col: 29 }, { row: 25, col: 30 }, { row: 25, col: 31 },
  { row: 25, col: 32 }, { row: 25, col: 33 }, { row: 25, col: 34 }, { row: 25, col: 35 }, { row: 25, col: 36 },
  { row: 25, col: 37 }, { row: 25, col: 38 }, { row: 25, col: 39 }, { row: 25, col: 40 }, { row: 25, col: 41 },
  { row: 25, col: 42 }, { row: 25, col: 43 }, { row: 25, col: 44 },

  { row: 31, col: 27 }, { row: 31, col: 28 }, { row: 31, col: 29 }, { row: 31, col: 30 }, { row: 31, col: 31 },
  { row: 31, col: 32 }, { row: 31, col: 33 }, { row: 31, col: 34 }, { row: 31, col: 35 }, { row: 31, col: 36 },
  { row: 31, col: 37 }, { row: 31, col: 38 }, { row: 31, col: 39 }, { row: 31, col: 40 }, { row: 31, col: 41 },
  { row: 31, col: 42 }, { row: 31, col: 43 }, { row: 31, col: 44 },

  { row: 17, col: 45 }, { row: 18, col: 45 }, { row: 19, col: 45 }, { row: 20, col: 45 }, { row: 21, col: 45 },
  { row: 22, col: 45 }, { row: 23, col: 45 }, { row: 24, col: 45 }, { row: 25, col: 45 }, { row: 26, col: 45 },
  { row: 27, col: 45 }, { row: 28, col: 45 }, { row: 29, col: 45 }, { row: 30, col: 45 }, { row: 31, col: 45 },
  { row: 32, col: 45 }, { row: 33, col: 45 }, { row: 34, col: 45 }, { row: 35, col: 45 }, { row: 36, col: 45 },
  { row: 37, col: 45 }, { row: 38, col: 45 }, { row: 39, col: 45 }, { row: 40, col: 45 }, { row: 41, col: 45 },
  { row: 42, col: 45 }, { row: 43, col: 45 },

  { row: 22, col: 46 }, { row: 22, col: 47 }, { row: 22, col: 48 }, { row: 22, col: 49 }, { row: 22, col: 50 },
  { row: 22, col: 51 }, { row: 22, col: 52 }, { row: 22, col: 53 }, { row: 22, col: 54 },

  { row: 27, col: 46 }, { row: 27, col: 47 }, { row: 27, col: 48 }, { row: 27, col: 49 }, { row: 27, col: 50 },
  { row: 27, col: 51 }, { row: 27, col: 52 }, { row: 27, col: 53 }, { row: 27, col: 54 },

  { row: 32, col: 46 }, { row: 32, col: 47 }, { row: 32, col: 48 }, { row: 32, col: 49 }, { row: 32, col: 50 },
  { row: 32, col: 51 }, { row: 32, col: 52 }, { row: 32, col: 53 }, { row: 32, col: 54 },

  { row: 37, col: 2 }, { row: 37, col: 3 }, { row: 37, col: 4 }, { row: 37, col: 5 }, { row: 37, col: 6 },
  { row: 37, col: 7 }, { row: 37, col: 8 }, { row: 37, col: 9 }, { row: 37, col: 10 }, { row: 37, col: 11 },
  { row: 37, col: 12 }, { row: 37, col: 13 }, { row: 37, col: 14 }, { row: 37, col: 15 }, { row: 37, col: 16 },
  { row: 37, col: 17 }, { row: 37, col: 18 }, { row: 37, col: 19 }, { row: 37, col: 20 }, { row: 37, col: 21 },
  { row: 37, col: 22 }, { row: 37, col: 23 }, { row: 37, col: 24 }, { row: 37, col: 25 }, { row: 37, col: 26 },
  { row: 37, col: 27 }, { row: 37, col: 28 }, { row: 37, col: 29 }, { row: 37, col: 30 }, { row: 37, col: 31 },
  { row: 37, col: 32 }, { row: 37, col: 33 }, { row: 37, col: 34 }, { row: 37, col: 35 }, { row: 37, col: 36 },
  { row: 37, col: 37 }, { row: 37, col: 38 }, { row: 37, col: 39 }, { row: 37, col: 40 }, { row: 37, col: 41 },
  { row: 37, col: 42 }, { row: 37, col: 43 }, { row: 37, col: 44 }, 
  
  { row: 5, col: 55 }, { row: 6, col: 55 }, { row: 7, col: 55 }, { row: 8, col: 55 }, { row: 9, col: 55 },
  { row: 10, col: 55 }, { row: 11, col: 55 }, { row: 12, col: 55 }, { row: 13, col: 55 }, { row: 14, col: 55 },
  { row: 15, col: 55 }, { row: 16, col: 55 }, { row: 17, col: 55 }, { row: 18, col: 55 }, { row: 19, col: 55 },
  { row: 20, col: 55 }, { row: 21, col: 55 }, { row: 22, col: 55 }, { row: 23, col: 55 }, { row: 24, col: 55 },
  { row: 25, col: 55 }, { row: 26, col: 55 }, { row: 27, col: 55 }, { row: 28, col: 55 }, { row: 29, col: 55 },
  { row: 30, col: 55 }, { row: 31, col: 55 }, { row: 32, col: 55 },
]

export default roads
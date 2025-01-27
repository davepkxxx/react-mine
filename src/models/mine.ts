export interface MineCell {
  row: number
  col: number
  mined: boolean
  revealed: boolean
  flagged: boolean
  adjacentMines: number
}

export function createMineGrid(rows: number, cols: number, mines: number) {
  const grid: MineCell[][] = []

  for (let row = 0; row < rows; row++) {
    grid[row] = []
    for (let col = 0; col < cols; col++) {
      grid[row][col] = {
        row,
        col,
        mined: false,
        revealed: false,
        flagged: false,
        adjacentMines: 0,
      }
    }
  }

  placeMines(grid, mines)
  return grid
}

function placeMines(grid: MineCell[][], mines: number) {
  for (let i = 0; i < mines; ) {
    const row = Math.floor(Math.random() * grid.length)
    const col = Math.floor(Math.random() * grid[0].length)
    if (!grid[row][col].mined) {
      grid[row][col].mined = true
      addAdjacentMines(grid, row, col)
      i++
    }
  }
}

function addAdjacentMines(grid: MineCell[][], row: number, col: number) {
  for (let i = row - 1; i <= row + 1; i++) {
    for (let j = col - 1; j <= col + 1; j++) {
      if (grid[i]?.[j]) grid[i][j].adjacentMines++
    }
  }
}

export function cloneMineGrid(grid: MineCell[][]) {
  return grid.map((row) =>
    row.map((cell) => ({
      ...cell,
    }))
  )
}

export function eachMineAdjacent(
  grid: MineCell[][],
  cell: MineCell,
  callback: (adjacent: MineCell | undefined) => void
) {
  const { row, col } = cell
  for (let i = row - 1; i <= row + 1; i++) {
    for (let j = col - 1; j <= col + 1; j++) {
      callback(grid[i]?.[j])
    }
  }
}

export function reduceMineAdjacent<U>(
  grid: MineCell[][],
  cell: MineCell,
  callback: (prev: U, curr: MineCell | undefined) => U,
  init: U
) {
  eachMineAdjacent(grid, cell, (adjacent) => {
    init = callback(init, adjacent)
  })
  return init
}

export interface GridState {
  flags: number
  unrevealed: number
  revealedMines: number
}

export function getGridStats(grid: MineCell[][]) {
  return grid.reduce(
    (state, row) => {
      return row.reduce((state, cell) => {
        if (cell.flagged) state.flags++
        if (cell.revealed) state.unrevealed--
        if (cell.revealed && cell.mined) state.revealedMines++
        return state
      }, state)
    },
    {
      flags: 0,
      unrevealed: grid.length * (grid[0]?.length || 0),
      revealedMines: 0,
    } as GridState
  )
}

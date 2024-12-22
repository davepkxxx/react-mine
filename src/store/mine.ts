import { atom } from 'jotai'

export enum MineFieldState {
  Explored,
  Unexplored,
  Flagged,
}

export interface MineCell {
  row: number
  col: number
  mined: boolean
  state: MineFieldState
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
        state: MineFieldState.Unexplored,
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

export const mineGridAtom = atom(createMineGrid(10, 10, 10))

export function setMineCell(grid: MineCell[][], newCell: MineCell) {
  const { row, col } = newCell
  const newRow = [...grid[row]]
  newRow.splice(col, 1, { ...newCell })
  const newGrid = [...grid]
  newGrid.splice(row, 1, newRow)
  return newGrid
}

export const setMineCellAtom = atom(null, (get, set, cell: MineCell) =>
  set(mineGridAtom, setMineCell(get(mineGridAtom), cell))
)

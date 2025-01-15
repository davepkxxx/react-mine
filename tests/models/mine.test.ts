import { describe, expect, test } from 'vitest'
import { cloneMineGrid, createMineGrid } from '../../src/models/mine'

describe('mine.ts', () => {
  test('createMineGrid()', () => {
    const rows = 10
    const cols = 10
    const mines = 10
    const grid = createMineGrid(rows, cols, mines)
    expect(grid.length).toBe(rows)

    let mineCount = 0
    for (let i = 0; i < rows; i++) {
      const row = grid[i]
      expect(row.length).toBe(cols)

      for (let j = 0; j < cols; j++) {
        const cell = row[j]
        expect(cell.row).toBe(i)
        expect(cell.col).toBe(j)
        expect(cell.revealed).toBe(false)
        expect(cell.flagged).toBe(false)

        let adjacentMines = 0
        for (let k = i - 1; k <= i + 1; k++) {
          for (let l = j - 1; l <= j + 1; l++) {
            if (grid[k]?.[l]?.mined) adjacentMines++
          }
        }

        expect(cell.adjacentMines).toBe(adjacentMines)
        if (cell.mined) mineCount++
      }
    }
    expect(mineCount).toBe(mines)
  })

  test('cloneMineCell()', () => {
    const rows = 10
    const cols = 10
    const mines = 10
    const grid = createMineGrid(rows, cols, mines)

    const row = Math.floor(Math.random() * rows)
    const col = Math.floor(Math.random() * cols)

    const newGrid = cloneMineGrid(grid)
    expect(newGrid).toEqual(grid)
    expect(newGrid).not.toBe(grid)

    for (let i = 0; i < rows; i++) {
      expect(newGrid[row]).not.toBe(grid[row])

      for (let j = 0; j < cols; j++) {
        expect(newGrid[row][col]).not.toBe(grid[row][cols])
      }
    }
  })
})

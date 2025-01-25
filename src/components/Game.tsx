import { useCallback, useEffect, useState } from 'react'
import { MineMap } from './Mine'
import { createMineGrid, MineCell } from '../models/mine'
import { Scoreboard } from './Scoreboard'

function calcFlags(grid: MineCell[][]) {
  return grid.reduce((n, row) => {
    return row.reduce((n, cell) => {
      return cell.flagged ? n + 1 : n
    }, n)
  }, 0)
}

export function Game() {
  const mines = 10
  const [curMines, setCurMines] = useState(mines)
  const [grid, setGrid] = useState([] as MineCell[][])

  useEffect(() => {
    setGrid(createMineGrid(10, 10, mines))
  }, [])

  const handleChange = useCallback((value: MineCell[][]) => {
    setGrid(value)
    setCurMines(mines - calcFlags(value))
  }, [])

  return (
    <div>
      <Scoreboard mines={curMines} />
      <MineMap value={grid} onChange={handleChange} />
    </div>
  )
}

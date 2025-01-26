import { useCallback, useEffect, useState } from 'react'
import { MineMap } from './Mine'
import { createMineGrid, MineCell } from '../models/mine'
import { Scoreboard } from './Scoreboard'
import { Btn } from './Btn'
import './Game.css'

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
  const [status, setStatus] = useState<'inited' | 'running' | 'stoped'>(
    'inited'
  )
  const [sec, setSec] = useState(0)
  const [grid, setGrid] = useState([] as MineCell[][])

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined

    switch (status) {
      case 'inited':
        clearInterval(intervalId)
        setSec(0)
        setGrid(createMineGrid(10, 10, mines))
        break
      case 'running': {
        const startAt = new Date()
        intervalId = setInterval(
          () =>
            setSec(
              Math.floor((new Date().getTime() - startAt.getTime()) / 1000)
            ),
          1000
        )
        break
      }
      case 'stoped':
        clearInterval(intervalId)
        break
    }

    return () => {
      clearInterval(intervalId)
    }
  }, [status])

  const handleResetClick = useCallback(() => setStatus('inited'), [])

  const handleChange = useCallback(
    (value: MineCell[][]) => {
      if (status === 'inited' || status === 'running') {
        if (status === 'inited') {
          setStatus('running')
        }

        setGrid(value)
        setCurMines(mines - calcFlags(value))
      }
    },
    [status]
  )

  return (
    <div>
      <div className="banner">
        <Scoreboard mines={curMines} sec={sec} />
        <Btn onClick={handleResetClick}>RESET</Btn>
      </div>
      <MineMap value={grid} onChange={handleChange} />
    </div>
  )
}

import { useCallback, useEffect, useState } from 'react'
import { MineMap } from './Mine'
import { createMineGrid, getGridStats, MineCell } from '../models/mine'
import { GameResult, Scoreboard } from './Scoreboard'
import { Btn } from './Btn'
import './Game.css'

export function Game() {
  const mines = 10
  const [hiddenMines, setHiddenMines] = useState(mines)
  const [status, setStatus] = useState<'inited' | 'running' | 'stoped'>(
    'inited'
  )
  const [sec, setSec] = useState(0)
  const [result, setResult] = useState<GameResult>('none')
  const [grid, setGrid] = useState([] as MineCell[][])

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined

    switch (status) {
      case 'inited':
        clearInterval(intervalId)
        setSec(0)
        setResult('none')
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

  useEffect(() => {
    const { flags, unrevealed, revealedMines } = getGridStats(grid)
    setHiddenMines(mines - flags)
    if (revealedMines > 0) {
      setStatus('stoped')
      setResult('lose')
    } else if (unrevealed === mines) {
      setStatus('stoped')
      setResult('win')
    }
  }, [grid])

  const handleResetClick = useCallback(() => setStatus('inited'), [])

  const handleChange = useCallback(
    (value: MineCell[][]) => {
      if (status === 'inited' || status === 'running') {
        if (status === 'inited') {
          setStatus('running')
        }

        setGrid(value)
      }
    },
    [status]
  )

  return (
    <div>
      <div className="banner">
        <Scoreboard mines={hiddenMines} sec={sec} result={result} />
        <Btn onClick={handleResetClick}>RESET</Btn>
      </div>
      <MineMap value={grid} onChange={handleChange} />
    </div>
  )
}

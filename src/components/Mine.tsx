import classNames from 'classnames'
import { MouseEvent, useCallback, useState } from 'react'
import './Mine.css'
import {
  cloneMineGrid,
  eachMineAdjacent,
  MineCell,
  reduceMineAdjacent,
} from '../models/mine'

export type MineFieldProps = {
  value: MineCell
  onChange: (value: MineCell) => void
  onChord: () => void
}

export function MineField(props: MineFieldProps) {
  const { value, onChange, onChord } = props
  const { mined, revealed, flagged, adjacentMines } = value
  const [leftPassed, setLeftPassed] = useState(false)
  const [rightPassed, setRightPassed] = useState(false)

  const handleMouseDown = useCallback((e: MouseEvent) => {
    switch (e.button) {
      case 0:
        setLeftPassed(true)
        break
      case 2:
        setRightPassed(true)
        break
    }
  }, [])

  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      const { revealed, flagged, adjacentMines } = value

      const reveal = () => {
        if (!revealed && !flagged) onChange({ ...value, revealed: true })
      }

      const toggleFlag = () => {
        if (!revealed) onChange({ ...value, flagged: !flagged })
      }
      const chord = () => {
        if (revealed && adjacentMines > 0) onChord()
      }

      switch (e.button) {
        case 0:
          setLeftPassed(false)
          if (rightPassed) {
            setRightPassed(false)
            chord()
          } else {
            reveal()
          }
          break
        case 2:
          setRightPassed(false)
          if (leftPassed) {
            setLeftPassed(false)
            chord()
          } else {
            toggleFlag()
          }
          break
      }
    },
    [leftPassed, rightPassed, value, onChange, onChord]
  )

  return (
    <td
      role="gridcell"
      className={classNames('mine-cell', { 'mine-cell-revealed': revealed })}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onContextMenu={(e) => e.preventDefault()}
    >
      {revealed
        ? mined
          ? '*'
          : adjacentMines > 0
            ? adjacentMines
            : ''
        : flagged
          ? 'P'
          : ''}
    </td>
  )
}

export interface MineMapProps {
  value: MineCell[][]
  onChange: (value: MineCell[][]) => void
}

const reveal = (newCell: MineCell, newGrid: MineCell[][]) => {
  const { revealed, flagged, adjacentMines } = newCell
  if (!revealed && !flagged) {
    newCell.revealed = true
    if (adjacentMines === 0) revealAdjacent({ ...newCell }, newGrid)
  }
}

function revealAdjacent(newCell: MineCell, newGrid: MineCell[][]) {
  eachMineAdjacent(newGrid, newCell, (adjacent) => {
    if (adjacent) reveal(adjacent, newGrid)
  })
}

export function MineMap(props: MineMapProps) {
  const { value, onChange } = props

  const handleCellChange = useCallback(
    (newCell: MineCell) => {
      const { row, col, revealed, adjacentMines } = newCell
      const { revealed: oldRevealed } = value[row][col]
      const newValue = cloneMineGrid(value)
      newValue[row][col] = newCell
      if (!oldRevealed && revealed && adjacentMines === 0)
        revealAdjacent(newCell, newValue)
      onChange(newValue)
    },
    [value, onChange]
  )

  const handleChord = useCallback(
    (cell: MineCell) => {
      const flags = reduceMineAdjacent(
        value,
        cell,
        (num, curr) => (num += curr?.flagged ? 1 : 0),
        0
      )

      if (flags === cell.adjacentMines) {
        const newValue = cloneMineGrid(value)
        revealAdjacent(cell, newValue)
        onChange(newValue)
      }
    },
    [value, onChange]
  )

  return (
    <table role="grid" className="mine-grid">
      <tbody>
        {value.map((row, i) => (
          <tr key={`row-${i}`}>
            {row.map((cell, j) => (
              <MineField
                key={`cell-${i}-${j}`}
                value={cell}
                onChange={handleCellChange}
                onChord={() => handleChord(cell)}
              />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

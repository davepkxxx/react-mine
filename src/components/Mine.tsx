import classNames from 'classnames'
import { MouseEvent, useCallback } from 'react'
import {
  cloneMineGrid,
  eachMineAdjacent,
  MineCell,
  reduceMineAdjacent,
} from '../models/mine'
import './Mine.css'

export type MineFieldProps = {
  value: MineCell
  onChange: (value: MineCell) => void
  onChord: () => void
}

export function MineField({ value, onChange, onChord }: MineFieldProps) {
  const { mined, revealed, flagged, adjacentMines } = value

  const handleClick = useCallback(() => {
    if (revealed) {
      if (!mined && adjacentMines > 0) onChord()
    } else if (!flagged) {
      onChange({ ...value, revealed: true })
    }
  }, [value, mined, revealed, flagged, adjacentMines, onChange, onChord])

  const handleContextMenu = useCallback(
    (event: MouseEvent) => {
      event.preventDefault()

      if (revealed) {
        if (!mined && adjacentMines > 0) onChord()
      } else {
        onChange({ ...value, flagged: !flagged })
      }
    },
    [value, mined, revealed, flagged, adjacentMines, onChange, onChord]
  )

  return (
    <td
      role="gridcell"
      className={classNames('mine-cell', { 'mine-cell-revealed': revealed })}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
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

export function MineMap({ value, onChange }: MineMapProps) {
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

import classNames from 'classnames'
import './Mine.css'
import { MineCell, setMineCell } from '../models/mine'

export type MineFieldProps = {
  value: MineCell
  onChange: (value: MineCell) => void
}

export function MineField(props: MineFieldProps) {
  const { value, onChange } = props
  const { row, col, mined, revealed, flagged, adjacentMines } = value

  const reveal = () => {
    const { revealed, flagged } = value
    if (!revealed && !flagged) onChange({ ...value, revealed: true })
  }

  const toggleFlag = () => {
    const { revealed, flagged } = value
    if (!revealed) onChange({ ...value, flagged: !flagged })
  }

  return (
    <td
      role="gridcell"
      {...(import.meta.env.DEV
        ? { 'data-testid': `mine-cell-${row}-${col}` }
        : {})}
      className={classNames('mine-cell', {
        'mine-cell-revealed': revealed,
      })}
      onClick={reveal}
      onContextMenu={(e) => {
        e.preventDefault()
        toggleFlag()
      }}
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

export function MineMap(props: MineMapProps) {
  const { value, onChange } = props

  const revealAdjacent = (cell: MineCell, grid: MineCell[][]) => {
    for (let i = cell.row - 1; i <= cell.row + 1; i++) {
      for (let j = cell.col - 1; j <= cell.col + 1; j++) {
        if (value[i]?.[j]) reveal(value[i][j], grid)
      }
    }
  }

  const reveal = (cell: MineCell, grid: MineCell[][]) => {
    const { revealed, flagged, adjacentMines } = cell
    if (!revealed && !flagged) {
      cell.revealed = true
      if (adjacentMines === 0) revealAdjacent(cell, grid)
    }
  }

  const handleCellChange = (cell: MineCell) => {
    const { revealed, adjacentMines } = cell
    const newValue = setMineCell(value, cell)
    if (revealed && adjacentMines === 0) revealAdjacent(cell, newValue)
    onChange(newValue)
  }

  return (
    <table role="grid" className="mine-grid">
      <tbody>
        {value.map((row, i) => (
          <tr key={`row-${i}`}>
            {row.map((cell, j) => (
              <MineField
                key={`cell-${i}-${j}`}
                value={cell}
                onChange={(newCell) => handleCellChange(newCell)}
              />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

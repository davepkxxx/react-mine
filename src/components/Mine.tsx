import classNames from 'classnames'
import { useAtomValue, useSetAtom } from 'jotai'
import {
  MineCell,
  MineFieldState,
  mineGridAtom,
  setMineCellAtom,
} from '../store/mine'
import './Mine.css'

export type MineFieldProps = MineCell

export function MineField(props: MineFieldProps) {
  const setMineCell = useSetAtom(setMineCellAtom)
  const { mined, state, adjacentMines } = props

  return (
    <td
      role="gridcell"
      className={classNames('mine-cell', {
        'mine-cell-explored': state === MineFieldState.Explored,
        'mine-cell-empty':
          state === MineFieldState.Explored && !mined && adjacentMines === 0,
      })}
      onClick={() => setMineCell({ ...props, state: MineFieldState.Explored })}
    >
      {state === MineFieldState.Explored
        ? mined
          ? '*'
          : adjacentMines > 0
            ? adjacentMines
            : ''
        : ''}
    </td>
  )
}

export function MineMap() {
  const grid = useAtomValue(mineGridAtom)

  return (
    <table role="grid" className="mine-grid">
      <tbody>
        {grid.map((row, i) => (
          <tr role="row" key={`row-${i}`}>
            {row.map((cell, j) => (
              <MineField key={`cell-${i}-${j}`} {...cell} />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

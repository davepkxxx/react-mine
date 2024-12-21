import classNames from 'classnames'
import { atom, useAtom, SetStateAction } from 'jotai'

enum MineFieldState {
  Explored,
  Unexplored,
  Flagged,
}

interface MineCell {
  mined: boolean
  state: MineFieldState
  adjacentMines: number
}

function createMineGrid(rows: number, cols: number, mines: number) {
  const grid: MineCell[][] = []

  for (let row = 0; row < rows; row++) {
    grid[row] = []
    for (let col = 0; col < cols; col++) {
      grid[row][col] = {
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
    if (grid[i]) {
      for (let j = col - 1; j <= col + 1; j++) {
        if (grid[i][j] && !(i == row && j == col)) {
          grid[i][j].adjacentMines++
        }
      }
    }
  }
}

const mineGridAtom = atom(createMineGrid(10, 10, 10))

function updateMineGridAtom(
  setGrid: (setAction: SetStateAction<MineCell[][]>) => void,
  row: number,
  col: number,
  cell: Partial<MineCell>
) {
  setGrid((grid) => [
    ...grid.slice(0, row),
    [
      ...grid[row].slice(0, col),
      {
        ...grid[row][col],
        ...cell,
      },
      ...grid[row].slice(col + 1, grid[row].length),
    ],
    ...grid.slice(row + 1, grid.length),
  ])
}

type MineFieldProps = MineCell & {
  onClick: () => void
}

function MineField(props: MineFieldProps) {
  const { mined, state, adjacentMines, onClick } = props
  return (
    <td
      className={classNames('mine-cell', {
        'mine-cell-explored': state === MineFieldState.Explored,
        'mine-cell-empty':
          state === MineFieldState.Explored && !mined && adjacentMines === 0,
      })}
      onClick={onClick}
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
  const [grid, setGrid] = useAtom(mineGridAtom)

  const explore = (row: number, col: number) => {
    updateMineGridAtom(setGrid, row, col, { state: MineFieldState.Explored })
  }

  return (
    <table className="mine-grid">
      <tbody>
        {grid.map((row, i) => (
          <tr key={`row-${i}`} className="mine-row">
            {row.map((cell, j) => (
              <MineField
                key={`cell-${i}-${j}`}
                {...cell}
                onClick={() => explore(i, j)}
              />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

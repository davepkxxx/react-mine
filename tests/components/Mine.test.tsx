import { useAtomValue, useSetAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { beforeEach, describe, expect, test } from 'vitest'
import { render } from 'vitest-browser-react'
import { MineField, MineMap } from '../../src/components/Mine'
import {
  createMineGrid,
  MineCell,
  MineFieldState,
  mineGridAtom,
  setMineCellAtom,
} from '../../src/store/mine'

describe('Mine.tsx', () => {
  describe('<MineField>', () => {
    let grid: MineCell[][]
    let cell: MineCell

    const Test = () => {
      const [inited, setInited] = useState(false)
      const setCell = useSetAtom(setMineCellAtom)
      useEffect(() => setCell(cell), [inited, setCell])
      if (!inited) setInited(true)
      return <MineField {...useAtomValue(mineGridAtom)[0][0]} />
    }

    beforeEach(() => {
      grid = createMineGrid(1, 1, 1)
      cell = grid[0][0]
    })

    test('unexplored -> empty', async () => {
      cell.mined = false
      cell.state = MineFieldState.Unexplored
      cell.adjacentMines = 0

      const { getByRole } = render(<Test />)
      const loc = getByRole('gridcell')
      await expect.element(loc).toBeInTheDocument()
      await expect.element(loc).toHaveClass('mine-cell')
      await expect.element(loc).not.toHaveClass('mine-cell-explored')
      await expect.element(loc).not.toHaveClass('mine-cell-empty')
      await expect.element(loc).toHaveTextContent('')

      await loc.click()
      await expect.element(loc).toHaveClass('mine-cell-explored')
      await expect.element(loc).toHaveClass('mine-cell-empty')
      await expect.element(loc).toHaveTextContent('')
    })

    test('unexplored -> mine', async () => {
      cell.mined = true
      cell.state = MineFieldState.Unexplored
      cell.adjacentMines = Math.floor(1 + Math.random() * 8)

      const { getByRole } = render(<Test />)
      const loc = getByRole('gridcell')
      await expect.element(loc).toBeInTheDocument()
      await expect.element(loc).toHaveClass('mine-cell')
      await expect.element(loc).not.toHaveClass('mine-cell-explored')
      await expect.element(loc).not.toHaveClass('mine-cell-empty')
      await expect.element(loc).toHaveTextContent('')

      await loc.click()
      await expect.element(loc).toHaveClass('mine-cell-explored')
      await expect.element(loc).not.toHaveClass('mine-cell-empty')
      await expect.element(loc).toHaveTextContent('*')
    })

    test('unexplored -> mines around', async () => {
      cell.mined = false
      cell.state = MineFieldState.Unexplored
      cell.adjacentMines = Math.floor(Math.random() * 8)

      const { getByRole } = render(<Test />)
      const loc = getByRole('gridcell')
      await expect.element(loc).toBeInTheDocument()
      await expect.element(loc).toHaveClass('mine-cell')
      await expect.element(loc).not.toHaveClass('mine-cell-explored')
      await expect.element(loc).not.toHaveClass('mine-cell-empty')
      await expect.element(loc).toHaveTextContent('')

      await loc.click()
      await expect.element(loc).toHaveClass('mine-cell-explored')
      await expect.element(loc).not.toHaveClass('mine-cell-empty')
      await expect.element(loc).toHaveTextContent(`${cell.adjacentMines}`)
    })
  })

  test('<MineMap>', async () => {
    const rows = 10
    const cols = 10

    const Test = () => {
      const [inited, setInited] = useState(false)
      const setGrid = useSetAtom(mineGridAtom)
      useEffect(
        () => setGrid(createMineGrid(rows, cols, 10)),
        [inited, setGrid]
      )
      if (!inited) setInited(true)
      return <MineMap />
    }

    const { getByRole } = render(<Test />)
    const gridLoc = getByRole('grid')
    await expect.element(gridLoc).toBeInTheDocument()
    await expect.element(gridLoc).toHaveClass('mine-grid')

    const rowEls = gridLoc.element().querySelectorAll('tr')
    expect(rowEls.length).toBe(rows)

    for (const rowEl of rowEls) {
      const cellEls = rowEl.querySelectorAll('td')
      expect(cellEls.length).toBe(cols)
      for (const cellEl of cellEls) expect(cellEl).toHaveClass('mine-cell')
    }
  })
})

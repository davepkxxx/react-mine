import { fireEvent } from '@testing-library/react'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { MineField, MineMap } from '../../src/components/Mine'
import { createMineGrid, MineCell } from '../../src/models/mine'

describe('Mine.tsx', () => {
  describe('<MineField>', () => {
    let value: MineCell

    beforeEach(() => {
      value = {
        row: 0,
        col: 0,
        mined: false,
        revealed: false,
        flagged: false,
        adjacentMines: 0,
      }
    })

    test('unrevealed', async () => {
      const onChange = vi.fn()
      const { getByRole } = render(
        <MineField value={value} onChange={onChange} onChord={() => {}} />
      )

      const loc = getByRole('gridcell')
      await expect.element(loc).toBeInTheDocument()
      await expect.element(loc).toHaveClass('mine-cell')
      await expect.element(loc).not.toHaveClass('mine-cell-revealed')
      await expect.element(loc).toHaveTextContent('')

      await loc.click()
      expect(onChange).toHaveBeenCalledWith({ ...value, revealed: true })

      await loc.click({ button: 'right' })
      expect(onChange).toHaveBeenCalledWith({ ...value, flagged: true })
    })

    test('empty', async () => {
      value.revealed = true
      const onChange = vi.fn()
      const { getByRole } = render(
        <MineField value={value} onChange={onChange} onChord={() => {}} />
      )

      const loc = getByRole('gridcell')
      await expect.element(loc).toBeInTheDocument()
      await expect.element(loc).toHaveClass('mine-cell')
      await expect.element(loc).toHaveClass('mine-cell-revealed')
      await expect.element(loc).toHaveTextContent('')

      await loc.click()
      expect(onChange).not.toHaveBeenCalled()

      await loc.click({ button: 'right' })
      expect(onChange).not.toHaveBeenCalled()
    })

    test('mined', async () => {
      value.mined = true
      value.revealed = true
      value.adjacentMines = 1
      const onChange = vi.fn()
      const { getByRole } = render(
        <MineField value={value} onChange={onChange} onChord={() => {}} />
      )

      const loc = getByRole('gridcell')
      await expect.element(loc).toBeInTheDocument()
      await expect.element(loc).toHaveClass('mine-cell')
      await expect.element(loc).toHaveClass('mine-cell-revealed')
      await expect.element(loc).toHaveTextContent('*')

      await loc.click()
      expect(onChange).not.toHaveBeenCalled()

      await loc.click({ button: 'right' })
      expect(onChange).not.toHaveBeenCalled()
    })

    test('mines adjacent', async () => {
      value.mined = false
      value.revealed = true
      value.adjacentMines = Math.floor(Math.random() * 8)
      const onChange = vi.fn()
      const { getByRole } = render(
        <MineField value={value} onChange={onChange} onChord={() => {}} />
      )

      const loc = getByRole('gridcell')
      await expect.element(loc).toBeInTheDocument()
      await expect.element(loc).toHaveClass('mine-cell')
      await expect.element(loc).toHaveClass('mine-cell-revealed')
      await expect.element(loc).toHaveTextContent(`${value.adjacentMines}`)

      await loc.click()
      expect(onChange).not.toHaveBeenCalled()

      await loc.click({ button: 'right' })
      expect(onChange).not.toHaveBeenCalled()
    })

    test('flagged', async () => {
      value.flagged = true
      const onChange = vi.fn()
      const { getByRole } = render(
        <MineField value={value} onChange={onChange} onChord={() => {}} />
      )

      const loc = getByRole('gridcell')
      await expect.element(loc).toBeInTheDocument()
      await expect.element(loc).toHaveClass('mine-cell')
      await expect.element(loc).not.toHaveClass('mine-cell-revealed')
      await expect.element(loc).toHaveTextContent('P')

      await loc.click()
      expect(onChange).not.toHaveBeenCalled()

      await loc.click({ button: 'right' })
      expect(onChange).toHaveBeenCalledWith({ ...value, flagged: false })
    })
  })

  describe('<MineMap>', () => {
    test('created', async () => {
      const rows = 10
      const cols = 10

      const { getByRole } = render(
        <MineMap value={createMineGrid(rows, cols, 0)} onChange={() => {}} />
      )
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

    test('reveal mined', async () => {
      const rows = 2
      const cols = 2
      const value = createMineGrid(rows, cols, 0)
      value[0][0].mined = true
      value[0][0].adjacentMines = 1
      value[0][1].adjacentMines = 1
      value[1][0].adjacentMines = 1
      value[1][1].adjacentMines = 1

      const onChange = vi.fn()
      const { getByRole } = render(
        <MineMap value={value} onChange={onChange} />
      )

      await getByRole('gridcell').all()[0]?.click()
      expect(onChange).toHaveBeenCalledWith([
        [
          {
            ...value[0][0],
            revealed: true,
          },
          value[0][1],
        ],
        value[1],
      ])
    })

    test('reveal mines adjacent', async () => {
      const rows = 2
      const cols = 2
      const value = createMineGrid(rows, cols, 0)
      value[0][0].adjacentMines = 1
      value[0][1].mined = true
      value[0][1].adjacentMines = 1
      value[1][0].adjacentMines = 1
      value[1][1].adjacentMines = 1

      const onChange = vi.fn()
      const { getByRole } = render(
        <MineMap value={value} onChange={onChange} />
      )

      await getByRole('gridcell').all()[0]?.click()
      expect(onChange).toHaveBeenCalledWith([
        [
          {
            ...value[0][0],
            revealed: true,
          },
          value[0][1],
        ],
        value[1],
      ])
    })

    test('reveal empty', async () => {
      const rows = 3
      const cols = 3
      const value = createMineGrid(rows, cols, 0)
      value[0][2].flagged = true
      value[1][0].adjacentMines = 1
      value[1][1].adjacentMines = 1
      value[2][1].mined = true
      value[2][1].adjacentMines = 1
      value[2][2].adjacentMines = 1

      const onChange = vi.fn()
      const { getByRole } = render(
        <MineMap value={value} onChange={onChange} />
      )

      await getByRole('gridcell').all()[0]?.click()
      expect(onChange).toHaveBeenCalledWith([
        [
          {
            ...value[0][0],
            revealed: true,
          },
          {
            ...value[0][1],
            revealed: true,
          },
          value[0][2],
        ],
        [
          {
            ...value[1][0],
            revealed: true,
          },
          {
            ...value[1][1],
            revealed: true,
          },
          {
            ...value[1][2],
            revealed: true,
          },
        ],
        [
          value[2][0],
          {
            ...value[2][1],
            revealed: true,
          },
          {
            ...value[2][2],
            revealed: true,
          },
        ],
      ])
    })

    test('place flag', async () => {
      const rows = 2
      const cols = 2
      const value = createMineGrid(rows, cols, 0)
      value[0][0].flagged = true
      value[0][1].flagged = true
      value[1][0].flagged = true
      value[1][1].flagged = true

      const onChange = vi.fn()
      const { getByRole } = render(
        <MineMap value={value} onChange={onChange} />
      )

      await getByRole('gridcell').all()[0]?.click({ button: 'right' })
      expect(onChange).toHaveBeenCalledWith([
        [
          {
            ...value[0][0],
            flagged: false,
          },
          value[0][1],
        ],
        value[1],
      ])
    })

    test('pull out flag', async () => {
      const rows = 2
      const cols = 2
      const value = createMineGrid(rows, cols, 0)

      const onChange = vi.fn()
      const { getByRole } = render(
        <MineMap value={value} onChange={onChange} />
      )

      await getByRole('gridcell').all()[0]?.click({ button: 'right' })
      expect(onChange).toHaveBeenCalledWith([
        [
          {
            ...value[0][0],
            flagged: true,
          },
          value[0][1],
        ],
        value[1],
      ])
    })

    test('chord if no flags', async () => {
      const rows = 2
      const cols = 2
      const value = createMineGrid(rows, cols, 0)
      value[0][0].revealed = true
      value[0][0].adjacentMines = 1
      value[0][1].adjacentMines = 1
      value[1][0].adjacentMines = 1
      value[1][1].mined = true
      value[1][1].adjacentMines = 1

      const onChange = vi.fn()
      const { getByRole } = render(
        <MineMap value={value} onChange={onChange} />
      )

      const el = getByRole('gridcell').all()[0].element()
      fireEvent.mouseDown(el, { button: 0 })
      fireEvent.mouseDown(el, { button: 2 })
      fireEvent.mouseUp(el, { button: 0 })
      fireEvent.mouseUp(el, { button: 2 })

      expect(onChange).not.toHaveBeenCalled()
    })

    test('chord if flags exceeds', async () => {
      const rows = 2
      const cols = 2
      const value = createMineGrid(rows, cols, 0)
      value[0][0].revealed = true
      value[0][0].adjacentMines = 1
      value[0][1].flagged = true
      value[0][1].adjacentMines = 1
      value[1][0].flagged = true
      value[1][0].adjacentMines = 1
      value[1][1].mined = true
      value[1][1].adjacentMines = 1

      const onChange = vi.fn()
      const { getByRole } = render(
        <MineMap value={value} onChange={onChange} />
      )

      const el = getByRole('gridcell').all()[0].element()
      fireEvent.mouseDown(el, { button: 0 })
      fireEvent.mouseDown(el, { button: 2 })
      fireEvent.mouseUp(el, { button: 0 })
      fireEvent.mouseUp(el, { button: 2 })

      expect(onChange).not.toHaveBeenCalled()
    })

    test('chord if insufficient flags', async () => {
      const rows = 2
      const cols = 2
      const value = createMineGrid(rows, cols, 0)
      value[0][0].revealed = true
      value[0][0].adjacentMines = 2
      value[0][1].flagged = true
      value[0][1].adjacentMines = 2
      value[1][0].mined = true
      value[1][0].adjacentMines = 2
      value[1][1].mined = true
      value[1][1].adjacentMines = 2

      const onChange = vi.fn()
      const { getByRole } = render(
        <MineMap value={value} onChange={onChange} />
      )

      const el = getByRole('gridcell').all()[0].element()
      fireEvent.mouseDown(el, { button: 0 })
      fireEvent.mouseDown(el, { button: 2 })
      fireEvent.mouseUp(el, { button: 0 })
      fireEvent.mouseUp(el, { button: 2 })

      expect(onChange).not.toHaveBeenCalled()
    })

    test('chord mines', async () => {
      const rows = 2
      const cols = 2
      const value = createMineGrid(rows, cols, 0)
      value[0][0].revealed = true
      value[0][0].adjacentMines = 1
      value[0][1].flagged = true
      value[0][1].adjacentMines = 1
      value[1][0].adjacentMines = 1
      value[1][1].mined = true
      value[1][1].adjacentMines = 1

      const onChange = vi.fn()
      const { getByRole } = render(
        <MineMap value={value} onChange={onChange} />
      )

      const el = getByRole('gridcell').all()[0].element()
      fireEvent.mouseDown(el, { button: 0 })
      fireEvent.mouseDown(el, { button: 2 })
      fireEvent.mouseUp(el, { button: 0 })
      fireEvent.mouseUp(el, { button: 2 })

      expect(onChange).toHaveBeenCalledWith([
        value[0],
        [
          {
            ...value[1][0],
            revealed: true,
          },
          {
            ...value[1][1],
            revealed: true,
          },
        ],
      ])
    })
  })
})

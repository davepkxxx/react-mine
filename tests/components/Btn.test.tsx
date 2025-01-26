import { describe, expect, test, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { Btn } from '../../src/components/Btn'

describe('<Btn>', () => {
  test('no content', async () => {
    const loc = render(<Btn />).getByRole('button')
    await expect.element(loc).toBeInTheDocument()
    await expect.element(loc).toHaveClass('btn')
    await expect.element(loc).toHaveTextContent('')
  })

  test('generic', async () => {
    const handleClick = vi.fn()
    const loc = render(<Btn onClick={handleClick}>submit</Btn>).getByRole(
      'button'
    )
    await expect.element(loc).toBeInTheDocument()
    await expect.element(loc).toHaveClass('btn')
    await expect.element(loc).toHaveTextContent('submit')

    await loc.click()
    expect(handleClick).toHaveBeenCalled()
  })
})

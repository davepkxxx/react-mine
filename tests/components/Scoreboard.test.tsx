import { expect, test } from 'vitest'
import { render } from 'vitest-browser-react'
import { Scoreboard } from '../../src/components/Scoreboard'

test('<Scoreboard>', async () => {
  const loc = render(<Scoreboard mines={7} sec={37} />).getByText(
    'Mines: 7, Time: 37s'
  )
  await expect.element(loc).toBeInTheDocument()
  await expect.element(loc).toHaveClass('scoreboard')
})

import { useEffect, useState } from 'react'
import './App.css'
import { MineMap } from './components/Mine'
import { createMineGrid, MineCell } from './models/mine'

function App() {
  const [grid, setGrid] = useState([] as MineCell[][])

  useEffect(() => {
    setGrid(createMineGrid(10, 10, 10))
  }, [])

  return <MineMap value={grid} onChange={(value) => setGrid(value)} />
}

export default App

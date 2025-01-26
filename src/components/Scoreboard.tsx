import './Scoreboard.css'

interface ScoreboardProps {
  mines: number
  sec: number
}

export function Scoreboard({ mines, sec }: ScoreboardProps) {
  return (
    <span className="scoreboard">
      Mines:&nbsp;{mines},&nbsp;Time:&nbsp;{sec}s
    </span>
  )
}

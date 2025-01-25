import './Scoreboard.css'

interface ScoreboardProps {
  mines: number
}

export function Scoreboard({ mines }: ScoreboardProps) {
  return <span className="scoreboard">Mines:&nbsp;{mines}</span>
}

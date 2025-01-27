import './Scoreboard.css'

export type GameResult = 'win' | 'lose' | 'none'

export type ScoreboardProps = {
  mines: number
  sec: number
} & GameResultProps

export function Scoreboard({ mines, sec, result }: ScoreboardProps) {
  return (
    <span className="scoreboard">
      Mines:&nbsp;{mines},&nbsp;Time:&nbsp;{sec}s
      {result === 'win' || result === 'lose' ? ', ' : ''}
      <GameResult result={result} />
    </span>
  )
}

export interface GameResultProps {
  result: GameResult
}

function GameResult({ result }: GameResultProps) {
  switch (result) {
    case 'win':
      return <span className="win">WIN</span>
    case 'lose':
      return <span className="lose">LOSE</span>
    default:
      return ''
  }
}

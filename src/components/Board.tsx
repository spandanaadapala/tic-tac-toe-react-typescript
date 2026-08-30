import type { SquareValue } from '../utils/calculateWinner'
import Square from './Square'

interface BoardProps {
  squares: SquareValue[]
  winningLine: number[]
  onPlay: (index: number) => void
}

function Board({ squares, winningLine, onPlay }: BoardProps) {
  return (
    <div className="board">
      {squares.map((value, index) => (
        <Square
          key={index}
          value={value}
          isWinning={winningLine.includes(index)}
          onClick={() => onPlay(index)}
        />
      ))}
    </div>
  )
}

export default Board

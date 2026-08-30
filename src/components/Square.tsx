import type { SquareValue } from '../utils/calculateWinner'

interface SquareProps {
  value: SquareValue
  onClick: () => void
  isWinning: boolean
}

function Square({ value, onClick, isWinning }: SquareProps) {
  return (
    <button
      className={`square${isWinning ? ' square-winning' : ''}`}
      onClick={onClick}
    >
      {value}
    </button>
  )
}

export default Square

export type SquareValue = 'X' | 'O' | null

export interface WinnerResult {
  player: SquareValue
  line: number[]
}

const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

export function calculateWinner(squares: SquareValue[]): WinnerResult | null {
  for (const line of LINES) {
    const [a, b, c] = line
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { player: squares[a], line }
    }
  }
  return null
}

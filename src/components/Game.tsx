import { useState } from 'react'
import type { SquareValue } from '../utils/calculateWinner'
import { calculateWinner } from '../utils/calculateWinner'
import Board from './Board'

const EMPTY_BOARD: SquareValue[] = Array(9).fill(null)

function Game() {
  const [history, setHistory] = useState<SquareValue[][]>([EMPTY_BOARD])
  const [currentMove, setCurrentMove] = useState(0)

  const currentSquares = history[currentMove]
  const xIsNext = currentMove % 2 === 0
  const result = calculateWinner(currentSquares)
  const isDraw = !result && currentSquares.every((square) => square !== null)

  function handlePlay(index: number) {
    if (result || currentSquares[index]) return

    const nextSquares = currentSquares.slice()
    nextSquares[index] = xIsNext ? 'X' : 'O'

    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
    setHistory(nextHistory)
    setCurrentMove(nextHistory.length - 1)
  }

  function jumpTo(move: number) {
    setCurrentMove(move)
  }

  function restart() {
    setHistory([EMPTY_BOARD])
    setCurrentMove(0)
  }

  let status: string
  if (result) {
    status = `Winner: ${result.player}`
  } else if (isDraw) {
    status = "It's a draw!"
  } else {
    status = `Next player: ${xIsNext ? 'X' : 'O'}`
  }

  const moves = history.map((_, move) => {
    const label = move === 0 ? 'Go to game start' : `Go to move #${move}`
    return (
      <li key={move}>
        <button
          className={move === currentMove ? 'move-button move-current' : 'move-button'}
          onClick={() => jumpTo(move)}
        >
          {label}
        </button>
      </li>
    )
  })

  return (
    <div className="game">
      <h1>Tic-Tac-Toe</h1>
      <div className="game-body">
        <div className="game-board">
          <p className="status">{status}</p>
          <Board
            squares={currentSquares}
            winningLine={result?.line ?? []}
            onPlay={handlePlay}
          />
          <button className="restart-button" onClick={restart}>
            Restart game
          </button>
        </div>
        <div className="game-info">
          <h2>Move history</h2>
          <ol>{moves}</ol>
        </div>
      </div>
    </div>
  )
}

export default Game

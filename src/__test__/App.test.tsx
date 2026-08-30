import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from '../App'

function getSquares() {
  return screen.getAllByRole('button', { name: /^[XO]?$/ })
}

describe('App (integration)', () => {
  it('renders the game heading and an empty board', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: 'Tic-Tac-Toe' })).toBeInTheDocument()
    expect(screen.getByText('Next player: X')).toBeInTheDocument()
    expect(getSquares()).toHaveLength(9)
  })

  it('plays a full game end to end through the rendered app: win, highlight, restart', async () => {
    const user = userEvent.setup()
    render(<App />)

    // X wins the top row: X plays 0, 1, 2; O plays 3, 4
    await user.click(getSquares()[0])
    await user.click(getSquares()[3])
    await user.click(getSquares()[1])
    await user.click(getSquares()[4])
    await user.click(getSquares()[2])

    expect(screen.getByText('Winner: X')).toBeInTheDocument()
    const winningSquares = getSquares()
    expect(winningSquares[0]).toHaveClass('square-winning')
    expect(winningSquares[1]).toHaveClass('square-winning')
    expect(winningSquares[2]).toHaveClass('square-winning')

    // move history was tracked for every move made
    expect(screen.getByRole('button', { name: 'Go to game start' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Go to move #5' })).toBeInTheDocument()

    // further clicks on empty squares are ignored once there is a winner
    await user.click(winningSquares[5]);
    expect(getSquares()[5]).toHaveTextContent('')

    // restarting clears the board and move history
    await user.click(screen.getByRole('button', { name: 'Restart game' }))
    expect(screen.getByText('Next player: X')).toBeInTheDocument()
    getSquares().forEach((square) => expect(square).toHaveTextContent(''))
    expect(screen.queryByRole('button', { name: /Go to move #/ })).not.toBeInTheDocument()
  })

  it('reaches a draw end to end and shows no winner highlight', async () => {
    const user = userEvent.setup()
    render(<App />)

    // X O X / X O O / O X X -> full board, no winner
    const order = [0, 1, 2, 4, 3, 5, 7, 6, 8]
    for (const index of order) {
      await user.click(getSquares()[index])
    }

    expect(screen.getByText("It's a draw!")).toBeInTheDocument()
    getSquares().forEach((square) => expect(square).not.toHaveClass('square-winning'))
  })

  it('lets you time-travel through move history and branch into a new line', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(getSquares()[0]) // X at 0
    await user.click(getSquares()[1]) // O at 1
    await user.click(getSquares()[2]) // X at 2

    await user.click(screen.getByRole('button', { name: 'Go to move #1' }))
    expect(getSquares()[0]).toHaveTextContent('X')
    expect(getSquares()[1]).toHaveTextContent('')
    expect(getSquares()[2]).toHaveTextContent('')
    expect(screen.getByText('Next player: O')).toBeInTheDocument()

    // branching here should drop the previously recorded moves #2 and #3
    await user.click(getSquares()[4])
    expect(screen.queryByRole('button', { name: 'Go to move #3' })).not.toBeInTheDocument()
    expect(getSquares()[2]).toHaveTextContent('')
  })
})

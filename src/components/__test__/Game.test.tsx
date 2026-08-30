import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import Game from '../Game'

function getSquares() {
  return screen.getAllByRole('button', { name: /^[XO]?$/ })
}

describe('Game', () => {
  it('shows "Next player: X" at the start', () => {
    render(<Game />)
    expect(screen.getByText('Next player: X')).toBeInTheDocument()
  })

  it('alternates players as moves are made', async () => {
    const user = userEvent.setup()
    render(<Game />)

    await user.click(getSquares()[0])
    expect(screen.getByText('Next player: O')).toBeInTheDocument()

    await user.click(getSquares()[1])
    expect(screen.getByText('Next player: X')).toBeInTheDocument()
  })

  it('ignores clicks on an already-filled square', async () => {
    const user = userEvent.setup()
    render(<Game />)

    await user.click(getSquares()[0])
    await user.click(getSquares()[0])

    expect(getSquares()[0]).toHaveTextContent('X')
    expect(screen.getByText('Next player: O')).toBeInTheDocument()
  })

  it('declares a winner and stops accepting moves on that square set', async () => {
    const user = userEvent.setup()
    render(<Game />)

    // X: 0, 1, 2 (top row) / O: 3, 4
    await user.click(getSquares()[0])
    await user.click(getSquares()[3])
    await user.click(getSquares()[1])
    await user.click(getSquares()[4])
    await user.click(getSquares()[2])

    expect(screen.getByText('Winner: X')).toBeInTheDocument()

    const squaresAfterWin = getSquares()
    await user.click(squaresAfterWin[5])
    expect(squaresAfterWin[5]).toHaveTextContent('')
  })

  it('declares a draw when the board fills with no winner', async () => {
    const user = userEvent.setup()
    render(<Game />)

    // X O X / X O O / O X X -> full board, no winner
    const order = [0, 1, 2, 4, 3, 5, 7, 6, 8]
    for (const index of order) {
      await user.click(getSquares()[index])
    }

    expect(screen.getByText("It's a draw!")).toBeInTheDocument()
  })

  it('supports jumping back to an earlier move and continuing from there', async () => {
    const user = userEvent.setup()
    render(<Game />)

    await user.click(getSquares()[0]) // X at 0
    await user.click(getSquares()[1]) // O at 1

    await user.click(screen.getByRole('button', { name: 'Go to move #1' }))

    expect(getSquares()[0]).toHaveTextContent('X')
    expect(getSquares()[1]).toHaveTextContent('')
    expect(screen.getByText('Next player: O')).toBeInTheDocument()

    await user.click(getSquares()[4]) // O at 4, discarding the old move #2
    expect(getSquares()[4]).toHaveTextContent('O')
    expect(getSquares()[1]).toHaveTextContent('')
  })

  it('resets the board when Restart game is clicked', async () => {
    const user = userEvent.setup()
    render(<Game />)

    await user.click(getSquares()[0])
    await user.click(screen.getByRole('button', { name: 'Restart game' }))

    expect(screen.getByText('Next player: X')).toBeInTheDocument()
    getSquares().forEach((square) => expect(square).toHaveTextContent(''))
  })
})

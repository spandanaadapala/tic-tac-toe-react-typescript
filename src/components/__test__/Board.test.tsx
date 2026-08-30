import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { SquareValue } from '../../utils/calculateWinner'
import Board from '../Board'

describe('Board', () => {
  it('renders nine squares', () => {
    const squares: SquareValue[] = Array(9).fill(null)
    render(<Board squares={squares} winningLine={[]} onPlay={() => {}} />)
    expect(screen.getAllByRole('button')).toHaveLength(9)
  })

  it('renders each square with its value', () => {
    const squares: SquareValue[] = ['X', 'O', null, null, null, null, null, null, null]
    render(<Board squares={squares} winningLine={[]} onPlay={() => {}} />)
    const buttons = screen.getAllByRole('button')
    expect(buttons[0]).toHaveTextContent('X')
    expect(buttons[1]).toHaveTextContent('O')
    expect(buttons[2]).toHaveTextContent('')
  })

  it('calls onPlay with the clicked square index', async () => {
    const user = userEvent.setup()
    const handlePlay = vi.fn()
    const squares: SquareValue[] = Array(9).fill(null)
    render(<Board squares={squares} winningLine={[]} onPlay={handlePlay} />)

    await user.click(screen.getAllByRole('button')[4])

    expect(handlePlay).toHaveBeenCalledWith(4)
  })

  it('highlights only the squares in the winning line', () => {
    const squares: SquareValue[] = ['X', 'X', 'X', null, null, null, null, null, null]
    render(<Board squares={squares} winningLine={[0, 1, 2]} onPlay={() => {}} />)
    const buttons = screen.getAllByRole('button')

    expect(buttons[0]).toHaveClass('square-winning')
    expect(buttons[1]).toHaveClass('square-winning')
    expect(buttons[2]).toHaveClass('square-winning')
    expect(buttons[3]).not.toHaveClass('square-winning')
  })
})

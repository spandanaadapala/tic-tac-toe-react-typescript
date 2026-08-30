import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import Square from '../Square'

describe('Square', () => {
  it('renders its value', () => {
    render(<Square value="X" isWinning={false} onClick={() => {}} />)
    expect(screen.getByRole('button')).toHaveTextContent('X')
  })

  it('renders empty when value is null', () => {
    render(<Square value={null} isWinning={false} onClick={() => {}} />)
    expect(screen.getByRole('button')).toHaveTextContent('')
  })

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(<Square value={null} isWinning={false} onClick={handleClick} />)

    await user.click(screen.getByRole('button'))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies the winning class when isWinning is true', () => {
    render(<Square value="O" isWinning onClick={() => {}} />)
    expect(screen.getByRole('button')).toHaveClass('square-winning')
  })

  it('does not apply the winning class when isWinning is false', () => {
    render(<Square value="O" isWinning={false} onClick={() => {}} />)
    expect(screen.getByRole('button')).not.toHaveClass('square-winning')
  })
})

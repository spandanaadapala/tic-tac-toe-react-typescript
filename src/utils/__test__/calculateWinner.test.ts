import { describe, expect, it } from 'vitest'
import { calculateWinner } from '../calculateWinner'
import type { SquareValue } from '../calculateWinner'

function board(cells: SquareValue[]): SquareValue[] {
  const squares: SquareValue[] = Array(9).fill(null)
  cells.forEach((value, index) => {
    squares[index] = value
  })
  return squares
}

describe('calculateWinner', () => {
  it('returns null on an empty board', () => {
    expect(calculateWinner(Array(9).fill(null))).toBeNull()
  })

  it('returns null when no line is complete', () => {
    const squares = board(['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'])
    expect(calculateWinner(squares)).toBeNull()
  })

  it('detects a winning row', () => {
    const squares = board(['X', 'X', 'X', 'O', 'O', null, null, null, null])
    expect(calculateWinner(squares)).toEqual({ player: 'X', line: [0, 1, 2] })
  })

  it('detects a winning column', () => {
    const squares = board(['O', 'X', null, 'O', 'X', null, 'O', null, 'X'])
    expect(calculateWinner(squares)).toEqual({ player: 'O', line: [0, 3, 6] })
  })

  it('detects a winning diagonal', () => {
    const squares = board(['X', 'O', 'O', null, 'X', null, null, null, 'X'])
    expect(calculateWinner(squares)).toEqual({ player: 'X', line: [0, 4, 8] })
  })

  it('detects the anti-diagonal', () => {
    const squares = board([null, null, 'O', null, 'O', null, 'O', null, null])
    expect(calculateWinner(squares)).toEqual({ player: 'O', line: [2, 4, 6] })
  })

  it('returns null for a full board with no winner (draw)', () => {
    const squares = board(['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'])
    expect(calculateWinner(squares)).toBeNull()
    expect(squares.every((square) => square !== null)).toBe(true)
  })
})

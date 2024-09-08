import { MockInstance } from 'vitest'
import AnimalCard, { IAnimalCards } from '../AnimalCard'
import { HexBoard } from '../HexBoard'
import Token, { TokenType } from '../Token'
import { testRiverHexBoard } from './test-data'
import animalsJson from '../../animals.json'

const animals = animalsJson as IAnimalCards

describe('hasPattern', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let consoleLogSpy: MockInstance
  let patternBoard: HexBoard

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {
      /* empty body */
    })
    patternBoard = new HexBoard(0, 0, 'custom')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return false when the pattern is empty', () => {
    patternBoard.addHex(0, 0)
    expect(testRiverHexBoard.hasPattern(patternBoard)).toBe(false)

    patternBoard.addHex(1, 0)
    expect(testRiverHexBoard.hasPattern(patternBoard)).toBe(false)

    patternBoard.addHex(1, -1)
    expect(testRiverHexBoard.hasPattern(patternBoard)).toBe(false)

    patternBoard.addHex(0, -1)
    expect(testRiverHexBoard.hasPattern(patternBoard)).toBe(false)

    patternBoard.addHex(-1, 0)
    expect(testRiverHexBoard.hasPattern(patternBoard)).toBe(false)

    patternBoard.addHex(-1, 1)
    expect(testRiverHexBoard.hasPattern(patternBoard)).toBe(false)

    patternBoard.addHex(0, 1)
    expect(testRiverHexBoard.hasPattern(patternBoard)).toBe(false)
  })

  it('should return true for a triangle river pattern', () => {
    patternBoard.addHex(0, 0, [TokenType.Blue])
    patternBoard.addHex(1, 0, [TokenType.Blue])
    patternBoard.addHex(1, -1, [TokenType.Blue])
    expect(testRiverHexBoard.hasPattern(patternBoard)).toBe(true)
  })

  it('should return true for the river/field pattern', () => {
    patternBoard.addHex(1, 0, [TokenType.Blue])
    patternBoard.addHex(1, -1, [TokenType.Yellow])
    patternBoard.addHex(0, -1, [TokenType.Yellow])
    expect(testRiverHexBoard.hasPattern(patternBoard)).toBe(true)
  })

  it('should return false for the triangle leaves pattern', () => {
    patternBoard.addHex(0, 0, [TokenType.Green])
    patternBoard.addHex(1, 0, [TokenType.Green])
    patternBoard.addHex(1, -1, [TokenType.Green])
    expect(testRiverHexBoard.hasPattern(patternBoard)).toBe(false)
  })

  it('should return true with buildings in the pattern', () => {
    patternBoard.addHex(0, 0, [TokenType.Brown, TokenType.Red])
    patternBoard.addHex(1, 0, [TokenType.Blue])
    patternBoard.addHex(1, -1, [TokenType.Gray, TokenType.Red])
    patternBoard.addHex(0, -1, [TokenType.Gray])
    expect(testRiverHexBoard.hasPattern(patternBoard)).toBe(true)
  })

  it('should return true with a Wood/Bricks building pattern', () => {
    patternBoard.addHex(1, -1, [TokenType.Brown, TokenType.Red])
    expect(testRiverHexBoard.hasPattern(patternBoard)).toBe(true)
  })

  it('should return true with a Mountain/Bricks building pattern', () => {
    patternBoard.addHex(0, -1, [TokenType.Gray, TokenType.Red])
    expect(testRiverHexBoard.hasPattern(patternBoard)).toBe(true)
  })

  describe('Building edge cases', () => {
    let boardWithBricksBricksBuilding: HexBoard
    let patternBoard: HexBoard

    beforeEach(() => {
      boardWithBricksBricksBuilding = new HexBoard(5, 5, 'river')
      boardWithBricksBricksBuilding.addHex(0, 0, [TokenType.Red, TokenType.Red])
      patternBoard = new HexBoard(0, 0, 'custom')
    })

    it('should match building with two Red tokens', () => {
      patternBoard.addHex(1, 0, [TokenType.Red, TokenType.Red])
      expect(boardWithBricksBricksBuilding.hasPattern(patternBoard)).toBe(true)
    })

    it('should match building with a Brown and Red token', () => {
      patternBoard.addHex(1, 0, [TokenType.Brown, TokenType.Red])
      expect(boardWithBricksBricksBuilding.hasPattern(patternBoard)).toBe(true)
    })

    it('should match building with a Gray and Red token', () => {
      patternBoard.addHex(1, 0, [TokenType.Gray, TokenType.Red])
      expect(boardWithBricksBricksBuilding.hasPattern(patternBoard)).toBe(true)
    })
  })

  describe('Animal patterns', () => {
    let gameBoard: HexBoard

    beforeEach(() => {
      gameBoard = new HexBoard(5, 5, 'river')
    })

    it('should return false when the pattern is empty', () => {
      const emptyPattern = new HexBoard(0, 0, 'custom')
      expect(gameBoard.hasPattern(emptyPattern)).toBe(false)
      expect(gameBoard.findAllMatchingPatterns(emptyPattern).length).toBe(0)
    })

    describe('ladybug', () => {
      const ladybug = new AnimalCard(animals.ladybug)

      it('should correctly match a ladybug pattern', () => {
        gameBoard.getHex(2, 1)?.tokens.push(new Token(TokenType.Yellow))
        gameBoard.getHex(3, 1)?.tokens.push(new Token(TokenType.Green))
        expect(gameBoard.hasPattern(ladybug.pattern)).toBe(true)
        const matchedPatterns = gameBoard.findAllMatchingPatterns(ladybug.pattern)
        expect(matchedPatterns.length).toBe(1)
        matchedPatterns.forEach((pattern) => {
          expect(pattern.length).toBe(2)
        })
      })

      it('should correctly match 2 overlapping ladybug patterns (form 1)', () => {
        gameBoard.getHex(3, 1)?.tokens.push(new Token(TokenType.Green))
        gameBoard.getHex(2, 1)?.tokens.push(new Token(TokenType.Yellow))
        gameBoard.getHex(3, 0)?.tokens.push(new Token(TokenType.Yellow))
        expect(gameBoard.hasPattern(ladybug.pattern)).toBe(true)
        const matchedPatterns = gameBoard.findAllMatchingPatterns(ladybug.pattern)
        expect(matchedPatterns.length).toBe(2)
        matchedPatterns.forEach((pattern) => {
          expect(pattern.length).toBe(2)
        })
      })

      it('should correctly match 2 overlapping ladybug patterns (form 2)', () => {
        gameBoard.getHex(2, 1)?.tokens.push(new Token(TokenType.Yellow))
        gameBoard.getHex(3, 0)?.tokens.push(new Token(TokenType.Green))
        gameBoard.getHex(3, 1)?.tokens.push(new Token(TokenType.Green))
        expect(gameBoard.hasPattern(ladybug.pattern)).toBe(true)
        const matchedPatterns = gameBoard.findAllMatchingPatterns(ladybug.pattern)
        expect(matchedPatterns.length).toBe(2)
        matchedPatterns.forEach((pattern) => {
          expect(pattern.length).toBe(2)
        })
      })

      it('should correctly match 3 overlapping ladybug patterns (form 1)', () => {
        gameBoard.getHex(3, 1)?.tokens.push(new Token(TokenType.Green))
        gameBoard.getHex(2, 1)?.tokens.push(new Token(TokenType.Yellow))
        gameBoard.getHex(3, 0)?.tokens.push(new Token(TokenType.Yellow))
        gameBoard.getHex(4, 0)?.tokens.push(new Token(TokenType.Yellow))
        expect(gameBoard.hasPattern(ladybug.pattern)).toBe(true)
        const matchedPatterns = gameBoard.findAllMatchingPatterns(ladybug.pattern)
        expect(matchedPatterns.length).toBe(3)
        matchedPatterns.forEach((pattern) => {
          expect(pattern.length).toBe(2)
        })
      })

      it('should correctly match 3 overlapping ladybug patterns (form 2)', () => {
        gameBoard.getHex(2, 1)?.tokens.push(new Token(TokenType.Yellow))
        gameBoard.getHex(3, 0)?.tokens.push(new Token(TokenType.Green))
        gameBoard.getHex(3, 1)?.tokens.push(new Token(TokenType.Green))
        gameBoard.getHex(2, 2)?.tokens.push(new Token(TokenType.Green))
        expect(gameBoard.hasPattern(ladybug.pattern)).toBe(true)
        const matchedPatterns = gameBoard.findAllMatchingPatterns(ladybug.pattern)
        expect(matchedPatterns.length).toBe(3)
        matchedPatterns.forEach((pattern) => {
          expect(pattern.length).toBe(2)
        })
      })

      it('should correctly match 4 overlapping ladybug patterns (form 1)', () => {
        gameBoard.getHex(3, 1)?.tokens.push(new Token(TokenType.Green))
        gameBoard.getHex(2, 1)?.tokens.push(new Token(TokenType.Yellow))
        gameBoard.getHex(3, 0)?.tokens.push(new Token(TokenType.Yellow))
        gameBoard.getHex(4, 0)?.tokens.push(new Token(TokenType.Yellow))
        gameBoard.getHex(4, 1)?.tokens.push(new Token(TokenType.Yellow))
        expect(gameBoard.hasPattern(ladybug.pattern)).toBe(true)
        const matchedPatterns = gameBoard.findAllMatchingPatterns(ladybug.pattern)
        expect(matchedPatterns.length).toBe(4)
        matchedPatterns.forEach((pattern) => {
          expect(pattern.length).toBe(2)
        })
      })

      it('should correctly match 4 overlapping ladybug patterns (form 2)', () => {
        gameBoard.getHex(2, 1)?.tokens.push(new Token(TokenType.Yellow))
        gameBoard.getHex(3, 0)?.tokens.push(new Token(TokenType.Green))
        gameBoard.getHex(3, 1)?.tokens.push(new Token(TokenType.Green))
        gameBoard.getHex(2, 2)?.tokens.push(new Token(TokenType.Green))
        gameBoard.getHex(1, 2)?.tokens.push(new Token(TokenType.Green))
        expect(gameBoard.hasPattern(ladybug.pattern)).toBe(true)
        const matchedPatterns = gameBoard.findAllMatchingPatterns(ladybug.pattern)
        expect(matchedPatterns.length).toBe(4)
        matchedPatterns.forEach((pattern) => {
          expect(pattern.length).toBe(2)
        })
      })

      it('should correctly match 4 overlapping ladybug patterns (form 3)', () => {
        gameBoard.getHex(2, 1)?.tokens.push(new Token(TokenType.Yellow))
        gameBoard.getHex(3, 1)?.tokens.push(new Token(TokenType.Yellow))
        gameBoard.getHex(3, 0)?.tokens.push(new Token(TokenType.Green))
        gameBoard.getHex(2, 2)?.tokens.push(new Token(TokenType.Green))
        expect(gameBoard.hasPattern(ladybug.pattern)).toBe(true)
        const matchedPatterns = gameBoard.findAllMatchingPatterns(ladybug.pattern)
        expect(matchedPatterns.length).toBe(4)
        matchedPatterns.forEach((pattern) => {
          expect(pattern.length).toBe(2)
        })
      })
    })
  })
})

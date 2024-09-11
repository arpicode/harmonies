import Token, { TokenType } from '../Token'
import { Hex } from '../Hex'
import { HexBoard } from '../HexBoard'
import { testIslandHexBoard, testRiverHexBoard } from './test-data'
import { MockInstance } from 'vitest'

describe('HexBoard', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let consoleLogSpy: MockInstance

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(vi.fn())
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('constructor', () => {
    it('should initialize with correct dimensions', () => {
      const board = new HexBoard(2, 5, 'custom')
      expect(board.cols).toBe(2)
      expect(board.rows).toBe(5)
    })

    it('should generate the correct number of hexes for the river board', () => {
      const board = new HexBoard(5, 5, 'custom')
      expect(board.hexes.size).toBe(board.cols * board.rows - ~~(board.cols / 2))
    })

    it('should generate the correct number of hexes for the island board', () => {
      const board = new HexBoard(7, 4, 'custom')
      expect(board.hexes.size).toBe(board.cols * board.rows - ~~(board.cols / 2))
    })
  })

  describe('getHex', () => {
    it('should return the correct hex given valid axial coordinates', () => {
      const board = new HexBoard(5, 5, 'custom')
      const hex = board.getHex(1, 1)
      expect(hex).toBeInstanceOf(Hex)
      expect(hex?.q).toBe(1)
      expect(hex?.r).toBe(1)
      expect(hex?.s).toBe(-2)
    })

    it('should return undefined for non-existent hex', () => {
      const board = new HexBoard(5, 5, 'custom')
      const hex = board.getHex(10, 10)
      expect(hex).toBeUndefined()
    })
  })

  describe('getEmptyHexes', () => {
    it('should return all hexes with no tokens', () => {
      const board = new HexBoard(5, 5, 'custom')
      const emptyHexes = board.getEmptyHexes()
      expect(emptyHexes.length).toBe(board.hexes.size)
    })

    it('should return only hexes with no tokens', () => {
      const board = new HexBoard(5, 5, 'custom')
      board.getHex(0, 0)?.tokens.push(new Token(TokenType.Blue))
      board.getHex(1, 1)?.tokens.push(new Token(TokenType.Blue))
      const emptyHexes = board.getEmptyHexes()
      expect(emptyHexes.length).toBe(board.hexes.size - 2)
    })
  })

  describe('findNeighbors', () => {
    it('should return the correct neighbors for a hex in the middle of the board', () => {
      const board = new HexBoard(5, 5, 'custom')
      const hex = board.getHex(2, 2)
      if (hex) {
        const neighbors = new Set(board.hexPathFinder.findNeighbors(hex))
        expect(neighbors.size).toBe(6)

        const expectedNeighbors = [
          board.getHex(1, 2),
          board.getHex(1, 3),
          board.getHex(2, 3),
          board.getHex(3, 2),
          board.getHex(3, 1),
          board.getHex(2, 1),
        ]
        expectedNeighbors.forEach((expectedNeighbor) => {
          expect(expectedNeighbor).toBeDefined()
          if (expectedNeighbor) expect(neighbors.has(expectedNeighbor)).toBe(true)
        })
      }
    })

    it('should return the correct neighbors for a hex on a corner of the board', () => {
      const board = new HexBoard(5, 5, 'custom')
      let hex = board.getHex(0, 0)
      if (hex) {
        const neighbors = new Set(board.hexPathFinder.findNeighbors(hex))
        expect(neighbors.size).toBe(2)

        const expectedNeighbors = [board.getHex(0, 1), board.getHex(1, 0)]
        expectedNeighbors.forEach((expectedNeighbor) => {
          expect(expectedNeighbor).toBeDefined()
          if (expectedNeighbor) expect(neighbors.has(expectedNeighbor)).toBe(true)
        })
      }

      hex = board.getHex(0, 4)
      if (hex) {
        const neighbors = new Set(board.hexPathFinder.findNeighbors(hex))
        expect(neighbors.size).toBe(2)

        const expectedNeighbors = [board.getHex(0, 3), board.getHex(1, 3)]
        expectedNeighbors.forEach((expectedNeighbor) => {
          expect(expectedNeighbor).toBeDefined()
          if (expectedNeighbor) expect(neighbors.has(expectedNeighbor)).toBe(true)
        })
      }

      hex = board.getHex(4, 2)
      if (hex) {
        const neighbors = new Set(board.hexPathFinder.findNeighbors(hex))
        expect(neighbors.size).toBe(2)

        const expectedNeighbors = [board.getHex(3, 2), board.getHex(4, 1)]
        expectedNeighbors.forEach((expectedNeighbor) => {
          expect(expectedNeighbor).toBeDefined()
          if (expectedNeighbor) expect(neighbors.has(expectedNeighbor)).toBe(true)
        })
      }

      hex = board.getHex(4, -2)
      if (hex) {
        const neighbors = new Set(board.hexPathFinder.findNeighbors(hex))
        expect(neighbors.size).toBe(2)

        const expectedNeighbors = [board.getHex(3, -1), board.getHex(4, -1)]
        expectedNeighbors.forEach((expectedNeighbor) => {
          expect(expectedNeighbor).toBeDefined()
          if (expectedNeighbor) expect(neighbors.has(expectedNeighbor)).toBe(true)
        })
      }
    })

    it('should return the correct neighbors for a hex on the top edge of the board', () => {
      const board = new HexBoard(5, 5, 'custom')
      let hex = board.getHex(1, 0)
      if (hex) {
        const neighbors = new Set(board.hexPathFinder.findNeighbors(hex))
        expect(neighbors.size).toBe(5)

        const expectedNeighbors = [
          board.getHex(0, 0),
          board.getHex(0, 1),
          board.getHex(1, 1),
          board.getHex(2, 0),
          board.getHex(2, -1),
        ]
        expectedNeighbors.forEach((expectedNeighbor) => {
          expect(expectedNeighbor).toBeDefined()
          if (expectedNeighbor) expect(neighbors.has(expectedNeighbor)).toBe(true)
        })
      }

      hex = board.getHex(2, -1)
      if (hex) {
        const neighbors = new Set(board.hexPathFinder.findNeighbors(hex))
        expect(neighbors.size).toBe(3)

        const expectedNeighbors = [board.getHex(1, 0), board.getHex(2, 0), board.getHex(3, -1)]
        expectedNeighbors.forEach((expectedNeighbor) => {
          expect(expectedNeighbor).toBeDefined()
          if (expectedNeighbor) expect(neighbors.has(expectedNeighbor)).toBe(true)
        })
      }
    })

    it('should return the correct neighbors for a hex on the bottom edge of the board', () => {
      const board = new HexBoard(5, 5, 'custom')
      let hex = board.getHex(1, 3)
      if (hex) {
        const neighbors = new Set(board.hexPathFinder.findNeighbors(hex))
        expect(neighbors.size).toBe(5)

        const expectedNeighbors = [
          board.getHex(0, 4),
          board.getHex(0, 3),
          board.getHex(1, 2),
          board.getHex(2, 2),
          board.getHex(2, 3),
        ]
        expectedNeighbors.forEach((expectedNeighbor) => {
          expect(expectedNeighbor).toBeDefined()
          if (expectedNeighbor) expect(neighbors.has(expectedNeighbor)).toBe(true)
        })
      }

      hex = board.getHex(2, 3)
      if (hex) {
        const neighbors = new Set(board.hexPathFinder.findNeighbors(hex))
        expect(neighbors.size).toBe(3)

        const expectedNeighbors = [board.getHex(1, 3), board.getHex(2, 2), board.getHex(3, 2)]
        expectedNeighbors.forEach((expectedNeighbor) => {
          expect(expectedNeighbor).toBeDefined()
          if (expectedNeighbor) expect(neighbors.has(expectedNeighbor)).toBe(true)
        })
      }
    })
  })

  describe('findAllChains', () => {
    it.each`
      TokenType
      ${TokenType.Blue}
      ${TokenType.Gray}
      ${TokenType.Brown}
      ${TokenType.Green}
      ${TokenType.Yellow}
      ${TokenType.Red}
    `(
      'should return an empty array if there are no chains of $TokenType',
      ({ TokenType }: { TokenType: TokenType }) => {
        const board = new HexBoard(5, 5, 'custom')
        const chains = board.hexPathFinder.findAllChains(TokenType)
        expect(chains.length).toBe(0)
      }
    )

    it.each`
      tokenType           | expectedChainCount
      ${TokenType.Blue}   | ${2}
      ${TokenType.Gray}   | ${2}
      ${TokenType.Brown}  | ${1}
      ${TokenType.Green}  | ${2}
      ${TokenType.Yellow} | ${2}
      ${TokenType.Red}    | ${2}
    `(
      'should find all chains of $tokenType',
      ({ tokenType, expectedChainCount }: { tokenType: TokenType; expectedChainCount: number }) => {
        const chains = testRiverHexBoard.hexPathFinder.findAllChains(tokenType)
        expect(chains.length).toBe(expectedChainCount)
      }
    )
  })

  describe('findLongestShortestPathBetweenMostDistantHexesOfType', () => {
    let riverHexBoard: HexBoard

    beforeEach(() => {
      riverHexBoard = new HexBoard(5, 5, 'custom')
    })

    it('should return an empty array if there are no tokens of type', () => {
      const longestRiver = riverHexBoard.hexPathFinder.findLongestShortestPathBetweenMostDistantHexesOfType(
        TokenType.Blue
      )
      expect(longestRiver.length).toBe(0)
    })

    it('should return an empty array when there is no valid path', () => {
      const hexBoard = new HexBoard(5, 5, 'custom')
      const tokenType = TokenType.Blue // Replace with an actual token type

      // Mock the findAllChains method to return chains without valid paths
      vi.spyOn(hexBoard.hexPathFinder, 'findAllChains').mockImplementation(() => {
        const hex1 = new Hex(0, 0, 0)
        const hex2 = new Hex(1, 1, -2)
        hex1.tokens.push(new Token(TokenType.Green)) // Different token type
        hex2.tokens.push(new Token(TokenType.Green)) // Different token type
        return [[hex1, hex2]]
      })

      const result = hexBoard.hexPathFinder.findLongestShortestPathBetweenMostDistantHexesOfType(tokenType)
      expect(result).toEqual([])
    })

    it('should find the longest shortest path between most distant hexes of type', () => {
      const longestRiver = testRiverHexBoard.hexPathFinder.findLongestShortestPathBetweenMostDistantHexesOfType(
        TokenType.Blue
      )
      expect(longestRiver.length).toBe(4)
    })

    describe('cyclic chains', () => {
      beforeEach(() => {
        // cyclic chain
        riverHexBoard = new HexBoard(5, 5, 'custom')
        riverHexBoard.getHex(2, 2)?.tokens.push(new Token(TokenType.Blue))
        riverHexBoard.getHex(3, 1)?.tokens.push(new Token(TokenType.Blue))
        riverHexBoard.getHex(3, 0)?.tokens.push(new Token(TokenType.Blue))
        riverHexBoard.getHex(2, 0)?.tokens.push(new Token(TokenType.Blue))
        riverHexBoard.getHex(1, 1)?.tokens.push(new Token(TokenType.Blue))
        riverHexBoard.getHex(1, 2)?.tokens.push(new Token(TokenType.Blue))
      })

      it('should find the longest shortest path between most distant hexes of type in a cycling chain', () => {
        const longestRiver = riverHexBoard.hexPathFinder.findLongestShortestPathBetweenMostDistantHexesOfType(
          TokenType.Blue
        )
        expect(longestRiver.length).toBe(4)
      })

      it('should find the longest shortest path between most distant hexes of type in a cycling chain with a branch 1', () => {
        riverHexBoard.getHex(4, 1)?.tokens.push(new Token(TokenType.Blue))
        const longestRiver = riverHexBoard.hexPathFinder.findLongestShortestPathBetweenMostDistantHexesOfType(
          TokenType.Blue
        )
        expect(longestRiver.length).toBe(5)
      })

      it('should find the longest shortest path between most distant hexes of type in a cycling chain with a branch 2', () => {
        riverHexBoard.getHex(3, 2)?.tokens.push(new Token(TokenType.Blue))
        const longestRiver = riverHexBoard.hexPathFinder.findLongestShortestPathBetweenMostDistantHexesOfType(
          TokenType.Blue
        )
        expect(longestRiver.length).toBe(4)
      })

      it('should find the longest shortest path between most distant hexes of type in a filled cycling chain', () => {
        riverHexBoard.getHex(2, 1)?.tokens.push(new Token(TokenType.Blue))
        const longestRiver = riverHexBoard.hexPathFinder.findLongestShortestPathBetweenMostDistantHexesOfType(
          TokenType.Blue
        )
        expect(longestRiver.length).toBe(3)
      })
    })

    it('should find the longest shortest path between most distant hexes of type in a filled board', () => {
      riverHexBoard.hexes.forEach((hex) => hex.tokens.push(new Token(TokenType.Blue)))
      const longestRiver = riverHexBoard.hexPathFinder.findLongestShortestPathBetweenMostDistantHexesOfType(
        TokenType.Blue
      )
      expect(longestRiver.length).toBe(7)
    })

    it('should find the longest shortest path between most distant hexes of type when there are multiple chains', () => {
      riverHexBoard.getHex(1, 0)?.tokens.push(new Token(TokenType.Blue))

      riverHexBoard.getHex(3, -1)?.tokens.push(new Token(TokenType.Blue))
      riverHexBoard.getHex(4, -1)?.tokens.push(new Token(TokenType.Blue))
      riverHexBoard.getHex(4, 0)?.tokens.push(new Token(TokenType.Blue))

      riverHexBoard.getHex(0, 3)?.tokens.push(new Token(TokenType.Blue))
      riverHexBoard.getHex(1, 2)?.tokens.push(new Token(TokenType.Blue))
      riverHexBoard.getHex(2, 1)?.tokens.push(new Token(TokenType.Blue))
      riverHexBoard.getHex(2, 2)?.tokens.push(new Token(TokenType.Blue))
      riverHexBoard.getHex(2, 3)?.tokens.push(new Token(TokenType.Blue))
      const longestRiver = riverHexBoard.hexPathFinder.findLongestShortestPathBetweenMostDistantHexesOfType(
        TokenType.Blue
      )
      expect(longestRiver.length).toBe(4)
    })
  })

  describe('findAllChainsExcluding', () => {
    it('should return one chain when no blue token type', () => {
      const board = new HexBoard(3, 3, 'custom')
      const chains = board.hexPathFinder.findAllChainsExcludingTokenOfType(TokenType.Blue)
      expect(chains.length).toBe(1)
    })

    it('should return an empty array if there are no chains of the excluded token type', () => {
      const chains = testIslandHexBoard.hexPathFinder.findAllChainsExcludingTokenOfType(TokenType.Blue)
      expect(chains.length).toBe(3)
    })
  })

  describe('toString', () => {
    it('should return a string representation of the hex board', () => {
      const board = new HexBoard(2, 2, 'custom')
      let firstHex = '0,0: Hex(0, 0, 0) tokens: <empty>\n'
      let expectedString = `${firstHex}0,1: Hex(0, 1, -1) tokens: <empty>\n1,0: Hex(1, 0, -1) tokens: <empty>\n`
      expect(board.toString()).toBe(expectedString)

      firstHex = '0,0: Hex(0, 0, 0) tokens: [Wood, Wood, Leaves]\n'
      expectedString = `${firstHex}0,1: Hex(0, 1, -1) tokens: <empty>\n1,0: Hex(1, 0, -1) tokens: <empty>\n`
      board.getHex(0, 0)?.tokens.push(new Token(TokenType.Brown))
      board.getHex(0, 0)?.tokens.push(new Token(TokenType.Brown))
      board.getHex(0, 0)?.tokens.push(new Token(TokenType.Green))
      expect(board.toString()).toBe(expectedString)
    })
  })

  describe('hasPattern', () => {
    let patternBoard: HexBoard
    beforeEach(() => {
      patternBoard = new HexBoard(0, 0, 'custom')
      patternBoard.addHex(0, 0)
      patternBoard.addHex(1, 0)
      patternBoard.addHex(1, -1)
      patternBoard.addHex(0, -1)
      patternBoard.addHex(-1, 0)
      patternBoard.addHex(-1, 1)
      patternBoard.addHex(0, 1)
    })

    it('should return false when pattern is empty', () => {
      expect(testRiverHexBoard.hasPattern(patternBoard)).toBe(false)
    })

    it('should return true for a triangle river pattern', () => {
      patternBoard.getHex(0, 0)?.tokens.push(new Token(TokenType.Blue))
      patternBoard.getHex(1, 0)?.tokens.push(new Token(TokenType.Blue))
      patternBoard.getHex(1, -1)?.tokens.push(new Token(TokenType.Blue))
      console.log(patternBoard.toString())
      expect(testRiverHexBoard.hasPattern(patternBoard)).toBe(true)
    })

    it('should return true for the river/field pattern', () => {
      patternBoard.getHex(0, 0)?.tokens.push(new Token(TokenType.Blue))
      patternBoard.getHex(-1, 0)?.tokens.push(new Token(TokenType.Yellow))
      patternBoard.getHex(0, 1)?.tokens.push(new Token(TokenType.Yellow))
      expect(testRiverHexBoard.hasPattern(patternBoard)).toBe(true)
    })

    it('should return false for the triangle leaves pattern', () => {
      patternBoard.getHex(0, 0)?.tokens.push(new Token(TokenType.Green))
      patternBoard.getHex(1, 0)?.tokens.push(new Token(TokenType.Green))
      patternBoard.getHex(1, -1)?.tokens.push(new Token(TokenType.Green))
      expect(testRiverHexBoard.hasPattern(patternBoard)).toBe(false)
    })

    it('should return true with buildings in the pattern', () => {
      patternBoard.getHex(0, 0)?.tokens.push(new Token(TokenType.Brown))
      patternBoard.getHex(0, 0)?.tokens.push(new Token(TokenType.Red))
      patternBoard.getHex(1, 0)?.tokens.push(new Token(TokenType.Blue))
      patternBoard.getHex(1, -1)?.tokens.push(new Token(TokenType.Gray))
      patternBoard.getHex(1, -1)?.tokens.push(new Token(TokenType.Red))
      patternBoard.getHex(0, -1)?.tokens.push(new Token(TokenType.Gray))
      expect(testRiverHexBoard.hasPattern(patternBoard)).toBe(true)
    })
  })
})

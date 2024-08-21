import Token, { TokenType } from '../Token'
import { HexBoard } from '../HexBoard'
import ScoreBoard from '../ScoreBoard'
import { testRiverHexBoard } from './test-data'

describe('ScoreBoard', () => {
  const scoreBoard = new ScoreBoard(testRiverHexBoard)
  const emptyHexBoard = new HexBoard(5, 5)
  const emptyScoreBoard = new ScoreBoard(emptyHexBoard)

  describe('treeScore', () => {
    it('should calculate the tree score correctly when there are no trees', () => {
      expect(emptyScoreBoard.treeScore()).toBe(0)
    })

    it('should calculate the tree score correctly', () => {
      expect(scoreBoard.treeScore()).toBe(11)
    })
  })

  describe('mountainScore', () => {
    it('should calculate the mountain score correctly when there are no mountains', () => {
      expect(emptyScoreBoard.mountainScore()).toBe(0)
    })

    it('should calculate the mountain score correctly', () => {
      expect(scoreBoard.mountainScore()).toBe(11)
    })
  })

  describe('fieldScore', () => {
    it('should calculate the field score correctly when there are no fields', () => {
      expect(emptyScoreBoard.fieldScore()).toBe(0)
    })

    it('should calculate the field chain score correctly', () => {
      expect(scoreBoard.fieldScore()).toBe(10)
    })
  })

  describe('buildingScore', () => {
    it('should calculate the building score correctly when there are no buildings', () => {
      expect(emptyScoreBoard.buildingScore()).toBe(0)
    })

    it('should calculate the building score correctly', () => {
      expect(scoreBoard.buildingScore()).toBe(10)
    })
  })

  describe('riverScore', () => {
    let riverHexBoard: HexBoard
    let riverScoreBoard: ScoreBoard
    let islandHexBoard: HexBoard
    let islandScoreBoard: ScoreBoard

    beforeEach(() => {
      riverHexBoard = new HexBoard(5, 5)
      riverScoreBoard = new ScoreBoard(riverHexBoard)
      islandHexBoard = new HexBoard(7, 4, 'island')
      islandScoreBoard = new ScoreBoard(islandHexBoard)
    })

    it('should calculate the river token score correctly for a river with 0 or 1 token', () => {
      expect(riverScoreBoard.riverScore()).toBe(0)

      riverHexBoard.getHex(0, 0)?.tokens.push(new Token(TokenType.Blue))
      expect(riverScoreBoard.riverScore()).toBe(0)
      riverHexBoard.getHex(2, 0)?.tokens.push(new Token(TokenType.Blue))
      expect(riverScoreBoard.totalScore()).toBe(0)
    })

    it('should calculate the river token score correctly for a river with 2 tokens', () => {
      riverHexBoard.getHex(2, 1)?.tokens.push(new Token(TokenType.Blue))
      riverHexBoard.getHex(3, 1)?.tokens.push(new Token(TokenType.Blue))
      expect(riverScoreBoard.riverScore()).toBe(2)
      expect(riverScoreBoard.totalScore()).toBe(2)
    })

    it('should calculate the river token score correctly for a river with 3 tokens', () => {
      riverHexBoard.getHex(2, 1)?.tokens.push(new Token(TokenType.Blue))
      riverHexBoard.getHex(3, 1)?.tokens.push(new Token(TokenType.Blue))
      riverHexBoard.getHex(3, 2)?.tokens.push(new Token(TokenType.Blue))
      expect(riverScoreBoard.riverScore()).toBe(5)
      expect(riverScoreBoard.totalScore()).toBe(5)
    })

    it('should calculate the river token score correctly for a river with 4 tokens', () => {
      expect(scoreBoard.riverScore()).toBe(8)
      expect(scoreBoard.totalScore()).toBe(11 + 11 + 10 + 10 + 8)
    })

    it('should calculate the river token score correctly for a river with 5 tokens', () => {
      riverHexBoard.getHex(2, 1)?.tokens.push(new Token(TokenType.Blue))
      riverHexBoard.getHex(3, 1)?.tokens.push(new Token(TokenType.Blue))
      riverHexBoard.getHex(3, 2)?.tokens.push(new Token(TokenType.Blue))
      riverHexBoard.getHex(2, 3)?.tokens.push(new Token(TokenType.Blue))
      riverHexBoard.getHex(1, 3)?.tokens.push(new Token(TokenType.Blue))
      expect(riverScoreBoard.riverScore()).toBe(11)
      expect(riverScoreBoard.totalScore()).toBe(11)
    })

    it('should calculate the river token score correctly for a river with 6 tokens', () => {
      riverHexBoard.getHex(2, 1)?.tokens.push(new Token(TokenType.Blue))
      riverHexBoard.getHex(3, 1)?.tokens.push(new Token(TokenType.Blue))
      riverHexBoard.getHex(3, 2)?.tokens.push(new Token(TokenType.Blue))
      riverHexBoard.getHex(2, 3)?.tokens.push(new Token(TokenType.Blue))
      riverHexBoard.getHex(1, 3)?.tokens.push(new Token(TokenType.Blue))
      riverHexBoard.getHex(0, 3)?.tokens.push(new Token(TokenType.Blue))
      expect(riverScoreBoard.riverScore()).toBe(15)
      expect(riverScoreBoard.totalScore()).toBe(15)
    })

    it('should calculate the river token score correctly for a river with 6 + 1 tokens', () => {
      riverHexBoard.getHex(2, 1)?.tokens.push(new Token(TokenType.Blue))
      riverHexBoard.getHex(3, 1)?.tokens.push(new Token(TokenType.Blue))
      riverHexBoard.getHex(3, 2)?.tokens.push(new Token(TokenType.Blue))
      riverHexBoard.getHex(2, 3)?.tokens.push(new Token(TokenType.Blue))
      riverHexBoard.getHex(1, 3)?.tokens.push(new Token(TokenType.Blue))
      riverHexBoard.getHex(0, 3)?.tokens.push(new Token(TokenType.Blue))
      riverHexBoard.getHex(0, 2)?.tokens.push(new Token(TokenType.Blue))
      expect(riverScoreBoard.riverScore()).toBe(15 + 4)
      expect(riverScoreBoard.totalScore()).toBe(15 + 4)
    })

    it('should calculate the river token score correctly for a river with 6 + 2 tokens', () => {
      riverHexBoard.getHex(2, 1)?.tokens.push(new Token(TokenType.Blue))
      riverHexBoard.getHex(3, 1)?.tokens.push(new Token(TokenType.Blue))
      riverHexBoard.getHex(3, 2)?.tokens.push(new Token(TokenType.Blue))
      riverHexBoard.getHex(2, 3)?.tokens.push(new Token(TokenType.Blue))
      riverHexBoard.getHex(1, 3)?.tokens.push(new Token(TokenType.Blue))
      riverHexBoard.getHex(0, 3)?.tokens.push(new Token(TokenType.Blue))
      riverHexBoard.getHex(0, 2)?.tokens.push(new Token(TokenType.Blue))
      riverHexBoard.getHex(0, 1)?.tokens.push(new Token(TokenType.Blue))
      expect(riverScoreBoard.riverScore()).toBe(15 + 4 + 4)
      expect(riverScoreBoard.totalScore()).toBe(15 + 4 + 4)
    })

    it('should calculate the river token score correctly for a cycling river with 6 + 3 tokens', () => {
      riverHexBoard.getHex(2, 1)?.tokens.push(new Token(TokenType.Blue))
      riverHexBoard.getHex(3, 1)?.tokens.push(new Token(TokenType.Blue))
      riverHexBoard.getHex(3, 2)?.tokens.push(new Token(TokenType.Blue))
      riverHexBoard.getHex(2, 3)?.tokens.push(new Token(TokenType.Blue))
      riverHexBoard.getHex(1, 3)?.tokens.push(new Token(TokenType.Blue))
      riverHexBoard.getHex(0, 3)?.tokens.push(new Token(TokenType.Blue))
      riverHexBoard.getHex(0, 2)?.tokens.push(new Token(TokenType.Blue))
      riverHexBoard.getHex(0, 1)?.tokens.push(new Token(TokenType.Blue))
      riverHexBoard.getHex(1, 1)?.tokens.push(new Token(TokenType.Blue))
      expect(riverScoreBoard.riverScore()).toBe(11)
      expect(riverScoreBoard.totalScore()).toBe(11)
    })

    it('should calculate the island score correctly when no river tokens', () => {
      expect(islandScoreBoard.riverScore()).toBe(5)
    })

    it('should calculate the island score correctly when there are 2 islands', () => {
      islandHexBoard.getHex(0, 1)?.tokens.push(new Token(TokenType.Blue))
      islandHexBoard.getHex(1, 0)?.tokens.push(new Token(TokenType.Blue))
      expect(islandScoreBoard.riverScore()).toBe(10)
    })

    it('should calculate the island score correctly when there are 3 islands', () => {
      islandHexBoard.getHex(0, 1)?.tokens.push(new Token(TokenType.Blue))
      islandHexBoard.getHex(1, 0)?.tokens.push(new Token(TokenType.Blue))
      islandHexBoard.getHex(1, 1)?.tokens.push(new Token(TokenType.Blue))
      islandHexBoard.getHex(1, 2)?.tokens.push(new Token(TokenType.Blue))
      expect(islandScoreBoard.riverScore()).toBe(15)
    })
  })

  describe('toString', () => {
    it('should return the total score', () => {
      const treeSpy = vi.spyOn(scoreBoard, 'treeScore')
      const mountainSpy = vi.spyOn(scoreBoard, 'mountainScore')
      const fieldSpy = vi.spyOn(scoreBoard, 'fieldScore')
      const buildingSpy = vi.spyOn(scoreBoard, 'buildingScore')
      const riverSpy = vi.spyOn(scoreBoard, 'riverScore')
      expect(scoreBoard.toString()).toBe(`{"tree":11,"mountain":11,"field":10,"building":10,"river":8,"total":50}`)

      expect(treeSpy).toHaveBeenCalledTimes(1)
      expect(mountainSpy).toHaveBeenCalledTimes(1)
      expect(fieldSpy).toHaveBeenCalledTimes(1)
      expect(buildingSpy).toHaveBeenCalledTimes(1)
      expect(riverSpy).toHaveBeenCalledTimes(1)
    })
  })
})

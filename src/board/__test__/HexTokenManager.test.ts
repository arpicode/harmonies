import { HexBoard } from '../HexBoard'
import Token, { TokenType } from '../Token'

describe('HexTokenManager', () => {
  describe('calculateTokensOfType', () => {
    it('should return the correct number of tokens of a given type', () => {
      const board = new HexBoard(5, 5, 'custom')
      board.getHex(0, 0)?.tokens.push(new Token(TokenType.Blue))
      board.getHex(1, 1)?.tokens.push(new Token(TokenType.Blue))
      board.getHex(2, 2)?.tokens.push(new Token(TokenType.Gray))
      board.getHex(1, 3)?.tokens.push(new Token(TokenType.Red))
      board.getHex(3, 1)?.tokens.push(new Token(TokenType.Red))
      board.getHex(4, 0)?.tokens.push(new Token(TokenType.Red))
      expect(board.tokenManager.calculateTokensOfType(TokenType.Blue)).toBe(2)
      expect(board.tokenManager.calculateTokensOfType(TokenType.Gray)).toBe(1)
      expect(board.tokenManager.calculateTokensOfType(TokenType.Red)).toBe(3)
    })
  })

  describe('calculateTokenTypeCounts', () => {
    it('should return the correct token type counts', () => {
      const board = new HexBoard(5, 5, 'custom')
      board.getHex(0, 0)?.tokens.push(new Token(TokenType.Blue))
      board.getHex(1, 1)?.tokens.push(new Token(TokenType.Blue))
      board.getHex(2, 2)?.tokens.push(new Token(TokenType.Gray))
      board.getHex(1, 3)?.tokens.push(new Token(TokenType.Red))
      board.getHex(3, 1)?.tokens.push(new Token(TokenType.Red))
      board.getHex(4, 0)?.tokens.push(new Token(TokenType.Red))
      board.getHex(0, 3)?.tokens.push(new Token(TokenType.Yellow))
      const tokenTypeCounts = board.tokenManager.calculateTokenTypeCounts()
      expect(tokenTypeCounts.get(TokenType.Blue)).toBe(2)
      expect(tokenTypeCounts.get(TokenType.Gray)).toBe(1)
      expect(tokenTypeCounts.get(TokenType.Red)).toBe(3)
      expect(tokenTypeCounts.get(TokenType.Yellow)).toBe(1)
      expect(tokenTypeCounts.get(TokenType.Brown)).toBe(0)
      expect(tokenTypeCounts.get(TokenType.Green)).toBe(0)
    })
  })

  describe('calculateTotalTokenCount', () => {
    it('should return the correct total token count', () => {
      const board = new HexBoard(5, 5, 'custom')
      board.getHex(0, 0)?.tokens.push(new Token(TokenType.Blue))
      board.getHex(1, 1)?.tokens.push(new Token(TokenType.Blue))
      board.getHex(2, 2)?.tokens.push(new Token(TokenType.Gray))
      board.getHex(1, 3)?.tokens.push(new Token(TokenType.Red))
      board.getHex(3, 1)?.tokens.push(new Token(TokenType.Red))
      board.getHex(4, 0)?.tokens.push(new Token(TokenType.Red))
      board.getHex(0, 3)?.tokens.push(new Token(TokenType.Yellow))
      expect(board.tokenManager.calculateTotalTokenCount()).toBe(7)
    })
  })
})

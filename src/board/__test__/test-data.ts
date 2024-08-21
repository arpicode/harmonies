import { HexBoard } from '../HexBoard'
import Token, { TokenType } from '../Token'

export const testRiverHexBoard = new HexBoard(5, 5, 'river')
export const testIslandHexBoard = new HexBoard(7, 4, 'island')

export const testStartingTokensMap = new Map<TokenType, number>([
  [TokenType.Blue, 23],
  [TokenType.Gray, 23],
  [TokenType.Brown, 21],
  [TokenType.Green, 19],
  [TokenType.Yellow, 19],
  [TokenType.Red, 15],
])

export const testFifteenTokensMap = new Map<TokenType, number>([
  [TokenType.Blue, 3],
  [TokenType.Gray, 3],
  [TokenType.Brown, 3],
  [TokenType.Green, 3],
  [TokenType.Yellow, 3],
  [TokenType.Red, 0],
])

// Add some river tokens to the board
testRiverHexBoard.getHex(0, 0)?.tokens.push(new Token(TokenType.Blue))
testRiverHexBoard.getHex(1, 2)?.tokens.push(new Token(TokenType.Blue))
testRiverHexBoard.getHex(2, 1)?.tokens.push(new Token(TokenType.Blue))
testRiverHexBoard.getHex(3, 1)?.tokens.push(new Token(TokenType.Blue))
testRiverHexBoard.getHex(3, 2)?.tokens.push(new Token(TokenType.Blue))
testRiverHexBoard.getHex(3, 0)?.tokens.push(new Token(TokenType.Blue))

// Add some mountain tokens to the board
testRiverHexBoard.getHex(1, 3)?.tokens.push(new Token(TokenType.Gray))
testRiverHexBoard.getHex(0, 3)?.tokens.push(new Token(TokenType.Gray))
testRiverHexBoard.getHex(0, 3)?.tokens.push(new Token(TokenType.Gray))
testRiverHexBoard.getHex(0, 3)?.tokens.push(new Token(TokenType.Gray))
testRiverHexBoard.getHex(0, 4)?.tokens.push(new Token(TokenType.Gray))
testRiverHexBoard.getHex(0, 4)?.tokens.push(new Token(TokenType.Gray))
testRiverHexBoard.getHex(4, 1)?.tokens.push(new Token(TokenType.Gray))

// Add some tree tokens to the board
testRiverHexBoard.getHex(0, 1)?.tokens.push(new Token(TokenType.Brown))
testRiverHexBoard.getHex(0, 1)?.tokens.push(new Token(TokenType.Green))
testRiverHexBoard.getHex(1, 0)?.tokens.push(new Token(TokenType.Brown))
testRiverHexBoard.getHex(1, 0)?.tokens.push(new Token(TokenType.Brown))
testRiverHexBoard.getHex(1, 0)?.tokens.push(new Token(TokenType.Green))
testRiverHexBoard.getHex(4, 2)?.tokens.push(new Token(TokenType.Green))
testRiverHexBoard.getHex(4, -2)?.tokens.push(new Token(TokenType.Brown))
testRiverHexBoard.getHex(4, -2)?.tokens.push(new Token(TokenType.Brown))

// Add some field tokens to the board
testRiverHexBoard.getHex(0, 2)?.tokens.push(new Token(TokenType.Yellow))
testRiverHexBoard.getHex(1, 1)?.tokens.push(new Token(TokenType.Yellow))
testRiverHexBoard.getHex(3, -1)?.tokens.push(new Token(TokenType.Yellow))
testRiverHexBoard.getHex(4, -1)?.tokens.push(new Token(TokenType.Yellow))
testRiverHexBoard.getHex(4, 0)?.tokens.push(new Token(TokenType.Yellow))

// Add some building tokens to the board
testRiverHexBoard.getHex(2, 2)?.tokens.push(new Token(TokenType.Gray))
testRiverHexBoard.getHex(2, 2)?.tokens.push(new Token(TokenType.Red))
testRiverHexBoard.getHex(2, 3)?.tokens.push(new Token(TokenType.Brown))
testRiverHexBoard.getHex(2, 3)?.tokens.push(new Token(TokenType.Red))
testRiverHexBoard.getHex(2, -1)?.tokens.push(new Token(TokenType.Red))
testRiverHexBoard.getHex(2, -1)?.tokens.push(new Token(TokenType.Red))

// Add some river tokens to the board
testIslandHexBoard.getHex(0, 1)?.tokens.push(new Token(TokenType.Blue))
testIslandHexBoard.getHex(1, 0)?.tokens.push(new Token(TokenType.Blue))
testIslandHexBoard.getHex(1, 1)?.tokens.push(new Token(TokenType.Blue))
testIslandHexBoard.getHex(1, 2)?.tokens.push(new Token(TokenType.Blue))

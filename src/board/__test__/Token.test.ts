import Token, { TokenType } from '../Token'

describe('Token', () => {
  let token1: Token
  let token2: Token

  beforeEach(() => {
    token1 = new Token(TokenType.Blue)
    token2 = new Token(TokenType.Red)
  })

  it('should initialize with correct id and value', () => {
    expect(token1.id).toBe(1)
    expect(token1.type).toBe(TokenType.Blue)
    expect(token2.id).toBe(2)
    expect(token2.type).toBe(TokenType.Red)
  })

  it('should return correct type', () => {
    expect(token1.type).toBe(TokenType.Blue)
    expect(token2.type).toBe(TokenType.Red)
  })

  it('should return correct string representation', () => {
    expect(token1.toString()).toBe(TokenType.Blue)
    expect(token2.toString()).toBe(TokenType.Red)
  })

  it('should correctly compare two tokens', () => {
    const anotherToken = new Token(TokenType.Blue)
    expect(token1.equals(token1)).toBe(true)
    expect(token1.equals(token2)).toBe(false)
    expect(token1.equals(anotherToken)).toBe(false)
  })
})

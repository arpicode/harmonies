import DraftTable from '../DraftTable'
import Token, { TokenType } from '../Token'
import TokenHolder from '../TokenHolder'

describe('TokenHolder', () => {
  let tokenHolder: TokenHolder
  let token: Token

  beforeEach(() => {
    tokenHolder = new TokenHolder()
    token = new Token(TokenType.Blue)
  })

  it('should add a token correctly', () => {
    tokenHolder.add(token)
    expect(tokenHolder.size()).toBe(1)
    expect(tokenHolder.tokens).toContain(token)
  })

  it('should throw an error when adding a token beyond MAX_SLOT_SIZE', () => {
    for (let i = 0; i < DraftTable.MAX_SLOT_SIZE; i++) {
      tokenHolder.add(new Token(TokenType.Gray))
    }
    expect(() => tokenHolder.add(token)).toThrow('Too many tokens in the holder')
  })

  it('should add multiple tokens correctly', () => {
    const tokens = [new Token(TokenType.Red), new Token(TokenType.Yellow)]
    tokenHolder.addMany(tokens)
    expect(tokenHolder.size()).toBe(2)
    expect(tokenHolder.tokens).toEqual(expect.arrayContaining(tokens))
  })

  it('should throw an error when adding multiple tokens beyond MAX_SLOT_SIZE', () => {
    for (let i = 0; i < DraftTable.MAX_SLOT_SIZE - 1; i++) {
      tokenHolder.add(new Token(TokenType.Red))
    }
    expect(() => tokenHolder.addMany([new Token(TokenType.Red), new Token(TokenType.Red)])).toThrow(
      'Too many tokens in the holder'
    )
  })

  it('should soft remove a token correctly', () => {
    tokenHolder.add(token)
    tokenHolder.softRemove(token)
    expect(tokenHolder.size()).toBe(0)
    expect(tokenHolder.tokens).not.toContain(token)
  })

  it('should restore all soft removed tokens correctly', () => {
    tokenHolder.add(token)
    tokenHolder.softRemove(token)
    tokenHolder.restoreAll()
    expect(tokenHolder.size()).toBe(1)
    expect(tokenHolder.tokens).toContain(token)
  })

  it('should return the correct size', () => {
    expect(tokenHolder.size()).toBe(0)
    tokenHolder.add(token)
    expect(tokenHolder.size()).toBe(1)
  })

  it('should return the correct tokens array', () => {
    expect(tokenHolder.tokens).toEqual([])
    tokenHolder.add(token)
    expect(tokenHolder.tokens).toEqual([token])
  })
})

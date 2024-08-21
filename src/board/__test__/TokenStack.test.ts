import Token, { TokenType } from '../Token'
import TokenStack from '../TokenStack'

describe('TokenStack', () => {
  let tokenStack: TokenStack
  let river: Token
  let mountain: Token
  let wood: Token
  let leaves: Token
  let field: Token
  let bricks: Token

  beforeEach(() => {
    tokenStack = new TokenStack()
    river = new Token(TokenType.Blue)
    mountain = new Token(TokenType.Gray)
    wood = new Token(TokenType.Brown)
    leaves = new Token(TokenType.Green)
    field = new Token(TokenType.Yellow)
    bricks = new Token(TokenType.Red)
  })

  it('should initialize with an empty stack', () => {
    expect(tokenStack.size()).toBe(0)
  })

  it('should push tokens into the stack', () => {
    expect(tokenStack.size()).toBe(0)
    tokenStack.push(wood)
    expect(tokenStack.size()).toBe(1)
    tokenStack.push(wood)
    expect(tokenStack.size()).toBe(2)
    tokenStack.push(leaves)
    expect(tokenStack.size()).toBe(3)
  })

  it('should pop tokens from the stack', () => {
    tokenStack.push(wood)
    tokenStack.push(wood)
    tokenStack.push(leaves)
    expect(tokenStack.size()).toBe(3)
    const token = tokenStack.pop()
    expect(token?.type).toBe(TokenType.Green)
    expect(tokenStack.size()).toBe(2)
    const anotherToken = tokenStack.pop()
    expect(anotherToken?.type).toBe(TokenType.Brown)
    expect(tokenStack.size()).toBe(1)
  })

  it('should return the last token without removing it', () => {
    tokenStack.push(wood)
    tokenStack.push(wood)
    tokenStack.push(leaves)
    expect(tokenStack.size()).toBe(3)
    const token = tokenStack.peek()
    expect(token?.type).toBe(TokenType.Green)
    expect(tokenStack.size()).toBe(3)
  })

  it('should check if the stack is empty', () => {
    expect(tokenStack.isEmpty()).toBe(true)
    tokenStack.push(wood)
    expect(tokenStack.isEmpty()).toBe(false)
    tokenStack.pop()
    expect(tokenStack.isEmpty()).toBe(true)
  })

  it('should clear the stack', () => {
    tokenStack.push(wood)
    tokenStack.push(wood)
    tokenStack.push(leaves)
    expect(tokenStack.size()).toBe(3)
    tokenStack.clear()
    expect(tokenStack.size()).toBe(0)
  })

  it('should count tokens of a specific type', () => {
    tokenStack.push(wood)
    tokenStack.push(wood)
    tokenStack.push(leaves)
    expect(tokenStack.countTokensOfType(TokenType.Brown)).toBe(2)
    expect(tokenStack.countTokensOfType(TokenType.Green)).toBe(1)
    expect(tokenStack.countTokensOfType(TokenType.Gray)).toBe(0)
    tokenStack.clear()
    tokenStack.push(mountain)
    tokenStack.push(mountain)
    tokenStack.push(mountain)
    expect(tokenStack.countTokensOfType(TokenType.Gray)).toBe(3)
  })

  describe('TokenStack validation', () => {
    it('should correctly validate if a token is placeable', () => {
      tokenStack.push(river)
      expect(tokenStack.isTokenPlaceable(mountain)).toBe(false)
      expect(tokenStack.isTokenPlaceable(wood)).toBe(false)
      expect(tokenStack.isTokenPlaceable(leaves)).toBe(false)
      expect(tokenStack.isTokenPlaceable(field)).toBe(false)
      expect(tokenStack.isTokenPlaceable(bricks)).toBe(false)
      tokenStack.clear()
      tokenStack.push(wood)
      expect(tokenStack.isTokenPlaceable(mountain)).toBe(false)
      expect(tokenStack.isTokenPlaceable(wood)).toBe(true)
      expect(tokenStack.isTokenPlaceable(leaves)).toBe(true)
      expect(tokenStack.isTokenPlaceable(field)).toBe(false)
      expect(tokenStack.isTokenPlaceable(bricks)).toBe(true)
    })

    it('should return true for mountain combination when conditions are met', () => {
      tokenStack.push(mountain)
      expect(tokenStack.isCombinationOfType('mountain')).toBe(true)
      tokenStack.push(mountain)
      expect(tokenStack.isCombinationOfType('mountain')).toBe(true)
      tokenStack.push(mountain)
      expect(tokenStack.isCombinationOfType('mountain')).toBe(true)
    })

    it('should return false for mountain combination when conditions are not met', () => {
      tokenStack.push(wood)
      expect(tokenStack.isCombinationOfType('mountain')).toBe(false)
      tokenStack.push(bricks)
      expect(tokenStack.isCombinationOfType('mountain')).toBe(false)
    })

    it('should return true for tree combination when tree of 1', () => {
      tokenStack.push(leaves)
      expect(tokenStack.isCombinationOfType('tree')).toBe(true)
    })

    it('should return true for tree combination when tree of 2', () => {
      tokenStack.push(wood)
      expect(tokenStack.isCombinationOfType('tree')).toBe(false)
      tokenStack.push(leaves)
      expect(tokenStack.isCombinationOfType('tree')).toBe(true)
    })

    it('should return true for tree combination when tree of 3', () => {
      tokenStack.push(wood)
      tokenStack.push(wood)
      expect(tokenStack.isCombinationOfType('tree')).toBe(false)
      tokenStack.push(leaves)
      expect(tokenStack.isCombinationOfType('tree')).toBe(true)
    })

    it('should return false for tree combination when conditions are not met', () => {
      tokenStack.push(wood)
      expect(tokenStack.isCombinationOfType('tree')).toBe(false)
    })

    it('should return true for building combination when conditions are met', () => {
      tokenStack.push(bricks)
      tokenStack.push(bricks)
      expect(tokenStack.isCombinationOfType('building')).toBe(true)
      tokenStack.clear()
      tokenStack.push(bricks)
      tokenStack.push(bricks)
      expect(tokenStack.isCombinationOfType('building')).toBe(true)
      tokenStack.clear()
      tokenStack.push(bricks)
      tokenStack.push(bricks)
      expect(tokenStack.isCombinationOfType('building')).toBe(true)
    })

    it('should throw an error for invalid token combinations', () => {
      expect(tokenStack.size()).toBe(0)
      tokenStack.push(river)
      expect(() => tokenStack.push(mountain)).toThrowError(TokenStack.INVALID_COMBINATION_ERROR)
      expect(tokenStack.size()).toBe(1)
    })

    it('should not throw an error for single token', () => {
      expect(() => tokenStack.push(river)).not.toThrowError('Invalid token combination')
      expect(tokenStack.size()).toBe(1)
      expect(tokenStack.isCombinationOfType('river')).toBe(true)
      tokenStack.pop()
      expect(() => tokenStack.push(mountain)).not.toThrowError('Invalid token combination')
      expect(tokenStack.size()).toBe(1)
      expect(tokenStack.isCombinationOfType('mountain')).toBe(true)
      tokenStack.pop()
      expect(() => tokenStack.push(wood)).not.toThrowError('Invalid token combination')
      expect(tokenStack.size()).toBe(1)
      expect(tokenStack.isCombinationOfType('wood')).toBe(true)
      expect(tokenStack.isCombinationOfType('tree')).toBe(false)
      tokenStack.pop()
      expect(() => tokenStack.push(leaves)).not.toThrowError('Invalid token combination')
      expect(tokenStack.size()).toBe(1)
      expect(tokenStack.isCombinationOfType('tree')).toBe(true)
      tokenStack.pop()
      expect(() => tokenStack.push(field)).not.toThrowError('Invalid token combination')
      expect(tokenStack.size()).toBe(1)
      expect(tokenStack.isCombinationOfType('field')).toBe(true)
      tokenStack.pop()
      expect(() => tokenStack.push(bricks)).not.toThrowError('Invalid token combination')
      expect(tokenStack.size()).toBe(1)
      expect(tokenStack.isCombinationOfType('bricks')).toBe(true)
      expect(tokenStack.isCombinationOfType('building')).toBe(false)
    })
  })

  describe('equals', () => {
    it('should return true for empty token stacks', () => {
      const sourceTokenStack = new TokenStack()
      const targetTokenStack = new TokenStack()
      expect(sourceTokenStack.equals(targetTokenStack)).toBe(true)
    })

    it('should return true for equal token stacks', () => {
      const sourceTokenStack = new TokenStack()
      const targetTokenStack = new TokenStack()
      sourceTokenStack.push(wood)
      sourceTokenStack.push(leaves)
      targetTokenStack.push(wood)
      targetTokenStack.push(leaves)
      expect(sourceTokenStack.equals(targetTokenStack)).toBe(true)
    })

    it.skip('should return true for equal building combinations', () => {
      const sourceTokenStack = new TokenStack()
      const targetTokenStack1 = new TokenStack()
      const targetTokenStack2 = new TokenStack()
      sourceTokenStack.push(bricks) // A
      sourceTokenStack.push(bricks)
      targetTokenStack1.push(wood) // B
      targetTokenStack1.push(bricks)
      targetTokenStack2.push(mountain) // C
      targetTokenStack2.push(bricks)
      // A = B and A = C => B = C
      expect(sourceTokenStack.equals(targetTokenStack1)).toBe(true)
      expect(sourceTokenStack.equals(targetTokenStack2)).toBe(true)
      expect(targetTokenStack1.equals(targetTokenStack2)).toBe(true)
    })

    it('should return false for different token stacks', () => {
      const sourceTokenStack = new TokenStack()
      const targetTokenStack = new TokenStack()
      sourceTokenStack.push(wood)
      sourceTokenStack.push(leaves)
      targetTokenStack.push(wood)
      targetTokenStack.push(wood)
      expect(sourceTokenStack.equals(targetTokenStack)).toBe(false)
    })
  })
})

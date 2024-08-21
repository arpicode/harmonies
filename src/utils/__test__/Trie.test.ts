import { TokenType } from '../../board/Token'
import Trie from '../Trie'

describe('Trie', () => {
  let trie: Trie

  beforeEach(() => {
    trie = new Trie()
  })

  it('should initialize with an empty root node', () => {
    // Since we can't access private properties, we assume the Trie is empty
    // by checking that no valid combinations exist initially.
    expect(trie.isValidTokenCombination([])).toBe(false)
    expect(trie.isValidTokenCombination([TokenType.Blue])).toBe(false)
  })

  it('should insert a combination of tokens into the Trie', () => {
    const combination = [TokenType.Blue, TokenType.Gray, TokenType.Brown]
    trie.insert(combination)

    expect(trie.isValidTokenCombination(combination)).toBe(true)
    expect(trie.isValidTokenCombination(combination.reverse())).toBe(false)
  })

  it('should return true for valid token combinations', () => {
    const combination = [TokenType.Blue, TokenType.Gray, TokenType.Brown]
    trie.insert(combination)
    expect(trie.isValidTokenCombination(combination)).toBe(true)
  })

  it('should return false for invalid token combinations', () => {
    const validCombination = [TokenType.Blue, TokenType.Gray, TokenType.Brown]
    const invalidCombination = [TokenType.Blue, TokenType.Red, TokenType.Brown]
    trie.insert(validCombination)
    expect(trie.isValidTokenCombination(invalidCombination)).toBe(false)
  })

  it('should return false for partially matching combinations', () => {
    const combination = [TokenType.Blue, TokenType.Gray, TokenType.Brown]
    const partialCombination = [TokenType.Blue, TokenType.Gray]
    trie.insert(combination)
    expect(trie.isValidTokenCombination(partialCombination)).toBe(false)
  })
})

import Stack from '../utils/Stack'
import Trie from '../utils/Trie'
import { arraysEqual } from '../utils/utils'
import Token, { TokenType } from './Token'

type ValidCombinationKeys = 'empty' | 'river' | 'tree' | 'field' | 'mountain' | 'building' | 'wood' | 'bricks'

export default class TokenStack extends Stack<Token> {
  public static readonly INVALID_COMBINATION_ERROR = 'Invalid token combination'
  public static readonly trie = new Trie()

  private static readonly VALID_COMBINATIONS: Record<ValidCombinationKeys, TokenType[][]> = {
    empty: [[]],
    river: [[TokenType.Blue]],
    tree: [[TokenType.Green], [TokenType.Brown, TokenType.Green], [TokenType.Brown, TokenType.Brown, TokenType.Green]],
    field: [[TokenType.Yellow]],
    mountain: [[TokenType.Gray], [TokenType.Gray, TokenType.Gray], [TokenType.Gray, TokenType.Gray, TokenType.Gray]],
    building: [
      [TokenType.Gray, TokenType.Red],
      [TokenType.Brown, TokenType.Red],
      [TokenType.Red, TokenType.Red],
    ],
    wood: [[TokenType.Brown], [TokenType.Brown, TokenType.Brown]],
    bricks: [[TokenType.Red]],
  }

  private _currentCombination: TokenType[] = []

  static {
    TokenStack._initializeTrie()
  }

  private static _initializeTrie(): void {
    Object.keys(TokenStack.VALID_COMBINATIONS).forEach((key) => {
      const combinations = TokenStack.VALID_COMBINATIONS[key as ValidCombinationKeys]
      combinations.forEach((combination) => {
        TokenStack.trie.insert(combination)
      })
    })
  }

  push(token: Token): void {
    const currentCombination = this._currentCombination.concat(token.type)
    this._validateCombination(currentCombination)
    super.push(token)
    this._currentCombination = currentCombination
  }

  pop(): Token | undefined {
    const token = super.pop()
    if (token) {
      this._currentCombination.pop()
    }
    return token
  }

  clear(): void {
    super.clear()
    this._currentCombination = []
  }

  isTokenPlaceable(token: Token): boolean {
    const tokenCombinationToValidate = this._currentCombination.concat(token.type)
    return TokenStack.trie.isValidTokenCombination(tokenCombinationToValidate)
  }

  countTokensOfType(tokenType: TokenType): number {
    return this.toArray().filter((token) => token.type === tokenType).length
  }

  isCombinationOfType(key: ValidCombinationKeys): boolean {
    return this._isValidTokenCombination(key)
  }

  toString(): string {
    if (this.isEmpty()) {
      return '<empty>'
    }
    return `[${this.toArray()
      .map((token) => token.type)
      .join(', ')}]`
  }

  equals(other: TokenStack): boolean {
    const currentCombination = this._currentCombination
    const otherCombination = other.toArray().map((token) => token.type)
    return arraysEqual(currentCombination, otherCombination)
  }

  private _validateCombination(combination: TokenType[]): void {
    if (!TokenStack.trie.isValidTokenCombination(combination)) {
      throw new Error(`${TokenStack.INVALID_COMBINATION_ERROR}: ${combination.join(', ')}`)
    }
  }

  // TODO: make use of the trie to validate the combination
  private _isValidTokenCombination(key: ValidCombinationKeys): boolean {
    const currentCombination = this._currentCombination
    return TokenStack.VALID_COMBINATIONS[key].some((combination) => arraysEqual(combination, currentCombination))
  }
}

import { Hex } from './Hex'
import ITokenManager from './interfaces/ITokenManager'
import { TokenType } from './Token'

export default class HexTokenManager implements ITokenManager {
  private readonly _hexMap: Map<string, Hex>

  constructor(hexMap: Map<string, Hex>) {
    this._hexMap = hexMap
  }

  /**
   * Calculates the total number of tokens of a specific type across all hexes.
   * @param tokenType - The type of token to count.
   * @returns The total count of tokens of the specified type.
   */
  calculateTokensOfType(tokenType: TokenType): number {
    let count = 0
    for (const hex of this._hexMap.values()) {
      count += hex.tokens.countTokensOfType(tokenType)
    }
    return count
  }

  /**
   * Calculates the count of each token type across all hexes.
   * @returns A map of token types to their respective counts.
   */
  calculateTokenTypeCounts(): Map<TokenType, number> {
    const tokenTypeCount = new Map<TokenType, number>()

    for (const tokenType of Object.values(TokenType)) {
      tokenTypeCount.set(tokenType, this.calculateTokensOfType(tokenType))
    }

    return tokenTypeCount
  }

  /**
   * Calculates the total number of tokens across all hexes.
   * @returns The total count of tokens.
   */
  calculateTotalTokenCount(): number {
    let count = 0
    for (const hex of this._hexMap.values()) {
      count += hex.tokens.size()
    }
    return count
  }
}

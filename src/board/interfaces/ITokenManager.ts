import { TokenType } from '../Token'

export default interface ITokenManager {
  calculateTokensOfType(tokenType: TokenType): number
  calculateTokenTypeCounts(): Map<TokenType, number>
  calculateTotalTokenCount(): number
}

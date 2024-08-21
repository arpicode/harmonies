import { Hex } from './Hex'
import { TokenType } from './Token'

export default interface IPathFinder {
  findNeighbors(hex: Hex): Hex[]
  findAllChains(tokenType: TokenType): Hex[][]
  findLongestShortestPathBetweenMostDistantHexesOfType(tokenType: TokenType): Hex[]
  findAllChainsExcludingTokenOfType(tokenType: TokenType): Hex[][]
  // findHexesWithThreeDifferentNeighbors(tokenType: TokenType): Hex[]
  findHexesMatchingNeighborCondition(predicate: (hex: Hex, neighborTokenTypes: Set<TokenType>) => boolean): Hex[]
}

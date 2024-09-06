import { Hex } from './Hex'
import IPathFinder from './interfaces/IPathFinder'
import { TokenType } from './Token'

/**
 * Class responsible for finding paths and chains of hexes on the hex board.
 */
export default class HexPathFinder implements IPathFinder {
  private readonly _hexMap: Map<string, Hex>

  /**
   * Creates an instance of HexPathFinder.
   * @param hexMap - A map of hexes keyed by their axial coordinates.
   */
  constructor(hexMap: Map<string, Hex>) {
    this._hexMap = hexMap
  }

  /**
   * Finds the neighboring hexes of a given hex.
   * @param hex - The `hex` for which to find neighbors.
   * @returns An array of neighboring hexes.
   */
  findNeighbors(hex: Hex): Hex[] {
    const neighbors: Hex[] = []
    for (let direction = 0; direction < 6; direction++) {
      const neighbor = hex.neighbor(direction)
      const neighborHex = this._hexMap.get(neighbor.id)

      if (neighborHex) neighbors.push(neighborHex)
    }
    return neighbors
  }

  /**
   * Performs a depth-first search (DFS) to find a chain of hexes starting from a given hex.
   * @param startHex - The starting hex for the DFS.
   * @param visited - A set of visited hexes.
   * @param shouldVisit - A predicate that determines if a hex should be visited.
   * @returns An array of hexes forming a chain.
   */
  private _findConnectedHexes(startHex: Hex, visited: Set<string>, shouldVisit: (hex: Hex) => boolean): Hex[] {
    const stack: Hex[] = [startHex]
    const chain: Hex[] = []

    while (stack.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const currentHex = stack.pop()! // We know stack is not empty

      if (!visited.has(currentHex.id)) {
        visited.add(currentHex.id)
        chain.push(currentHex)

        for (const neighbor of this.findNeighbors(currentHex)) {
          if (shouldVisit(neighbor)) stack.push(neighbor)
        }
      }
    }

    return chain
  }

  /**
   * Finds chains of hexes based on the provided conditions.
   * @param shouldStartChain - A predicate that determines if a hex should start a chain.
   * @param shouldVisitNeighbor - A predicate that determines if a neighboring hex should be visited.
   * @returns An array of chains, each chain being an array of hexes.
   */
  private _findChains(
    shouldStartChain: (hex: Hex) => boolean,
    shouldVisitNeighbor: (neighbor: Hex) => boolean
  ): Hex[][] {
    const visited = new Set<string>()
    const chains: Hex[][] = []

    for (const hex of this._hexMap.values()) {
      if (shouldStartChain(hex) && !visited.has(hex.id)) {
        const chain = this._findConnectedHexes(hex, visited, shouldVisitNeighbor)

        if (chain.length > 0) chains.push(chain)
      }
    }

    return chains
  }

  /**
   * Finds all chains of hexes that contain a specific token type.
   * A chain represents a connected group of hexes.
   * @param tokenType - The token type to look for in the chains.
   * @returns An array of chains, each chain being an array of hexes.
   */
  findAllChains(tokenType: TokenType): Hex[][] {
    return this._findChains(
      (hex) => hex.tokens.peek()?.type === tokenType,
      (neighbor) => neighbor.tokens.peek()?.type === tokenType
    )
  }

  /**
   * Finds all chains of hexes that do not contain a specific token type.
   * @param tokenType - The token type to exclude from the chains.
   * @returns An array of chains, each chain being an array of hexes.
   */
  findAllChainsExcludingTokenOfType(tokenType: TokenType = TokenType.Blue): Hex[][] {
    return this._findChains(
      (hex) => hex.tokens.peek()?.type !== tokenType,
      (neighbor) => neighbor.tokens.peek()?.type !== tokenType
    )
  }

  /**
   * Finds the longest shortest path between the most distant hexes of a specific token type.
   * @param tokenType - The token type to look for in the hexes.
   * @returns An array of hexes forming the longest shortest path.
   */
  findLongestShortestPathBetweenMostDistantHexesOfType(tokenType: TokenType): Hex[] {
    const chains = this.findAllChains(tokenType)
    let longestShortestPath: Hex[] = []

    for (const chain of chains) {
      for (let i = 0; i < chain.length; i++) {
        for (let j = i + 1; j < chain.length; j++) {
          const startHex = chain[i]
          const endHex = chain[j]

          const path = this._findShortestPath(startHex, endHex, tokenType)

          if (path.length > longestShortestPath.length) longestShortestPath = path
        }
      }
    }

    return longestShortestPath
  }

  /**
   * Performs a breadth-first search (BFS) to find the shortest path between two hexes.
   * @param startHex - The starting hex for the BFS.
   * @param endHex - The ending hex for the BFS.
   * @param tokenType - The token type to look for in the hexes.
   * @returns An array of hexes forming the shortest path.
   */
  private _findShortestPath(startHex: Hex, endHex: Hex, tokenType: TokenType): Hex[] {
    const queue: [Hex, Hex[]][] = [[startHex, [startHex]]]
    const visited = new Set<Hex>()
    visited.add(startHex)

    while (queue.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const [currentHex, path] = queue.shift()! // We know queue is not empty

      if (currentHex === endHex) return path

      for (const neighbor of this.findNeighbors(currentHex)) {
        if (!visited.has(neighbor) && neighbor.tokens.peek()?.type === tokenType) {
          visited.add(neighbor)
          queue.push([neighbor, path.concat(neighbor)])
        }
      }
    }

    return []
  }

  /**
   * Finds hexes that match a specific condition based on their neighbors.
   * @param predicate - A `predicate` that defines the condition to match.
   * @returns An array of hexes that match the condition.
   */
  findHexesMatchingNeighborCondition(predicate: (hex: Hex, neighborTokenTypes: Set<TokenType>) => boolean): Hex[] {
    const result: Hex[] = []

    for (const hex of this._hexMap.values()) {
      const neighborTokenTypes = this._getUniqueNeighborTokenTypes(hex)

      if (predicate(hex, neighborTokenTypes)) result.push(hex)
    }

    return result
  }

  /**
   * Finds the unique token types of the neighboring hexes of a given hex.
   * @param hex - The `hex` for which to find unique neighbor token types.
   * @returns A set of unique token types of the neighboring hexes.
   */
  private _getUniqueNeighborTokenTypes(hex: Hex): Set<TokenType> {
    const neighborTokenTypes = new Set<TokenType>()
    const neighbors = this.findNeighbors(hex)

    for (const neighbor of neighbors) {
      const neighborToken = neighbor.tokens.peek()

      if (neighborToken) neighborTokenTypes.add(neighborToken.type)
    }

    return neighborTokenTypes
  }
}

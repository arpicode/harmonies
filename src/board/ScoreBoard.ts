import { Hex } from './Hex'
import { HexBoard } from './HexBoard'
import { TokenType } from './Token'

const TREE_SCORES = [1, 3, 7]
const MOUNTAIN_SCORES = [1, 3, 7]
const FIELD_CHAIN_SCORE = 5
const BUILDING_SCORE = 5
const RIVER_TOKEN_SCORE = 4
const ISLAND_SCORE = 5

export default class ScoreBoard {
  private _hexBoard: HexBoard

  constructor(hexBoard: HexBoard) {
    this._hexBoard = hexBoard
  }

  private _calculateTreeScore(tokenType: TokenType, scoreMapping: number[]) {
    const chains = this._hexBoard.hexPathFinder.findAllChains(tokenType)
    let result = 0

    for (const chain of chains) {
      chain.forEach((hex) => {
        const size = hex.tokens.size()
        if (size > 0 && size <= scoreMapping.length) {
          result += scoreMapping[size - 1]
        }
      })
    }

    return result
  }

  treeScore() {
    return this._calculateTreeScore(TokenType.Green, TREE_SCORES)
  }

  mountainScore() {
    const chains = this._hexBoard.hexPathFinder.findAllChains(TokenType.Gray)
    let result = 0

    for (const chain of chains) {
      if (chain.length < 2) continue

      chain.forEach((hex) => {
        const size = hex.tokens.size()
        if (size > 0 && size <= MOUNTAIN_SCORES.length) {
          result += MOUNTAIN_SCORES[size - 1]
        }
      })
    }

    return result
  }

  fieldScore() {
    const fieldChains = this._hexBoard.hexPathFinder.findAllChains(TokenType.Yellow)
    return fieldChains.filter((chain) => chain.length > 1).length * FIELD_CHAIN_SCORE
  }

  buildingScore() {
    const validatedBuildings = this._findAllValidatedBuildings()
    return validatedBuildings.length * BUILDING_SCORE
  }

  private _findAllValidatedBuildings(): Hex[] {
    return this._hexBoard.hexPathFinder.findHexesMatchingNeighborCondition((hex, neighborTokenTypes) => {
      return hex.tokens.isCombinationOfType('building') && neighborTokenTypes.size >= 3
    })
  }

  riverScore() {
    if (this._hexBoard.type === 'river') {
      const longestRiver = this._hexBoard.hexPathFinder.findLongestShortestPathBetweenMostDistantHexesOfType(
        TokenType.Blue
      )
      const length = longestRiver.length

      if (length <= 1) return 0
      if (length <= 6) return [0, 0, 2, 5, 8, 11, 15][length]

      return 15 + (length - 6) * RIVER_TOKEN_SCORE
    }

    return this._hexBoard.hexPathFinder.findAllChainsExcludingTokenOfType(TokenType.Blue).length * ISLAND_SCORE
  }

  totalScore() {
    return this.treeScore() + this.mountainScore() + this.fieldScore() + this.buildingScore() + this.riverScore()
  }

  toString() {
    const total = {
      tree: this.treeScore(),
      mountain: this.mountainScore(),
      field: this.fieldScore(),
      building: this.buildingScore(),
      river: this.riverScore(),
    } as Record<string, number>

    total.total = Object.values(total).reduce((acc, score) => acc + score, 0)

    return JSON.stringify(total)
  }
}

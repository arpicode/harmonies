import { Hex } from './Hex'
import { HexBoard } from './HexBoard'
import PickedCardsHolder from './PickedCardsHolder'
import { TokenType } from './Token'

const TREE_SCORES = [1, 3, 7]
const MOUNTAIN_SCORES = [1, 3, 7]
const FIELD_CHAIN_SCORE = 5
const BUILDING_SCORE = 5
const RIVER_TOKEN_SCORE = 4
const ISLAND_SCORE = 5

export default class ScoreBoard {
  private _hexBoard: HexBoard
  private _pickedCardsHolder: PickedCardsHolder

  constructor(hexBoard: HexBoard, pickedCardsHolder: PickedCardsHolder) {
    this._hexBoard = hexBoard
    this._pickedCardsHolder = pickedCardsHolder
  }

  private _calculateTokenScore(tokenType: TokenType, scoreMapping: number[], minChainLength = 1) {
    const chains = this._hexBoard.hexPathFinder.findAllChains(tokenType)
    let result = 0

    for (const chain of chains) {
      if (chain.length < minChainLength) continue

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
    return this._calculateTokenScore(TokenType.Green, TREE_SCORES)
  }

  mountainScore() {
    return this._calculateTokenScore(TokenType.Gray, MOUNTAIN_SCORES, 2)
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

  animalCardsScores(): Record<string, number> {
    const scores = {} as Record<string, number>

    const allCards = [...this._pickedCardsHolder.pickedCards, ...this._pickedCardsHolder.completedCards]

    allCards.forEach((animalCard) => {
      const score = animalCard.value()
      scores[animalCard.name] = score
    })

    scores.total = Object.values(scores).reduce((acc, score) => acc + score, 0)

    return scores
  }

  tokensScores() {
    const scores = {
      tree: this.treeScore(),
      mountain: this.mountainScore(),
      field: this.fieldScore(),
      building: this.buildingScore(),
      river: this.riverScore(),
    } as Record<string, number>

    scores.total = Object.values(scores).reduce((acc, score) => acc + score, 0)

    return scores
  }

  totalScore() {
    const tokensScores = this.tokensScores()
    const animalCardsScores = this.animalCardsScores()

    return tokensScores.total + animalCardsScores.total
  }

  toString() {
    const tokensScores = this.tokensScores()
    const animalCardsScores = this.animalCardsScores()

    const totalScore = tokensScores.total + animalCardsScores.total

    const result = {
      tokens: tokensScores,
      animals: animalCardsScores,
      total: totalScore,
    }

    return JSON.stringify(result, null, 2)
  }
}

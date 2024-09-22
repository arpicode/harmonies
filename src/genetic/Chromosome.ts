import PickedCardsHolder from '~/board/PickedCardsHolder'
import Bag from '../board/Bag'
import { Hex } from '../board/Hex'
import { HexBoard } from '../board/HexBoard'
import ScoreBoard from '../board/ScoreBoard'
import Token, { startingTokensMap } from '../board/Token'

export default class Chromosome extends HexBoard {
  private _bag: Bag<Token>
  private _turns = 0
  public initialTokenTypesCount = new Map<string, number>()

  constructor(col: number, row: number) {
    super(col, row, 'river')
    this._bag = new Bag<Token>()
    startingTokensMap.forEach((count, type) => {
      for (let i = 0; i < count; i++) {
        this._bag.add(new Token(type))
      }
    })
    this._bag.shuffle()
  }

  initialize(turns: number): void {
    for (let i = 0; i < turns; i++) {
      const emptyHexes = this.getEmptyHexes()
      if (emptyHexes.length < 3 || this._bag.isEmpty()) break
      this._randomlyPlaceTokens(3)
      for (let i = 0; i < 3; i++) {
        this._bag.draw(3)
      }
      this._turns++
    }
  }

  evaluateFitness(): number {
    const scoreBoard = new ScoreBoard(this, new PickedCardsHolder())
    return scoreBoard.totalScore()
  }

  hasEqualTokenTypesCount(other: Chromosome): boolean {
    const thisTokenTypeCount = this.tokenManager.calculateTokenTypeCounts()
    const otherTokenTypeCount = other.tokenManager.calculateTokenTypeCounts()

    // Check if both maps have the same keys
    if (thisTokenTypeCount.size !== otherTokenTypeCount.size) return false

    for (const [tokenType, count] of thisTokenTypeCount) {
      if (otherTokenTypeCount.get(tokenType) !== count) return false
    }

    return true
  }

  private _randomlyPlaceTokens(n: number): void {
    const tokens = this._bag.draw(n)
    let placedTokens = 0
    const emptyHexesCount = this.getEmptyHexes().length

    // Ensure there are at most n empty hexes before placing tokens
    if (emptyHexesCount < n) {
      throw new Error(`Not enough empty hexes to place ${n} tokens`)
    }

    while (placedTokens < n) {
      const token = tokens[placedTokens]
      const hex = this._getRandomHex()

      if (hex.tokens.isTokenPlaceable(token)) {
        hex.tokens.push(token)
        placedTokens++
      }
    }
  }

  private _getRandomHex(): Hex {
    const hexes = Array.from(this.hexes.values())
    return hexes[Math.floor(Math.random() * hexes.length)]
  }
}

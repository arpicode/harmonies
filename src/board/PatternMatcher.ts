import { HexBoard } from './HexBoard'
import IPatternMatcher from './IPatternMatcher'
import { Hex } from './Hex'

export default class PatternMatcher implements IPatternMatcher {
  private _hexes: Map<string, Hex>

  constructor(hexes: Map<string, Hex>) {
    this._hexes = hexes
  }

  hasPattern(pattern: HexBoard): boolean {
    const patternHexes = Array.from(pattern.hexes.values()).filter((hex) => !hex.tokens.isEmpty())

    if (patternHexes.length === 0) return false

    const rotatedPatterns = this._generateRotatedPatterns(patternHexes)

    for (const hex of this._hexes.values()) {
      if (this._doesPatternExistAtPosition(hex, rotatedPatterns)) {
        return true
      }
    }

    return false
  }

  findAllMatchingPatterns(pattern: HexBoard): Hex[][] {
    const patternHexes = Array.from(pattern.hexes.values()).filter((hex) => !hex.tokens.isEmpty())

    if (patternHexes.length === 0) return []

    const rotatedPatterns = this._generateRotatedPatterns(patternHexes)

    const matchedHexGroups: Hex[][] = []
    for (const hex of this._hexes.values()) {
      const matchesAtPosition = this._findMatchesAtPosition(hex, rotatedPatterns)
      matchedHexGroups.push(...matchesAtPosition)
    }

    matchedHexGroups.forEach((matchedHexes, index) => {
      console.log(
        `Pattern matched at hexes [Match ${index + 1}]: ${matchedHexes.map((hex) => hex.toString()).join(', ')}`
      )
    })

    return matchedHexGroups
  }

  private _generateRotatedPatterns(patternHexes: Hex[]): Hex[][] {
    return Array.from({ length: 6 }, (_, i) => patternHexes.map((hex) => hex.rotate(i)))
  }

  private _findMatchesAtPosition(boardHex: Hex, rotatedPatterns: Hex[][]): Hex[][] {
    return rotatedPatterns
      .filter((rotatedPattern) => this._isReferenceHexMatch(boardHex, rotatedPattern[0]))
      .map((rotatedPattern) => this._matchPattern(boardHex, rotatedPattern))
      .filter((matchedHexes) => matchedHexes.length > 0)
  }

  private _doesPatternExistAtPosition(boardHex: Hex, rotatedPatterns: Hex[][]): boolean {
    return rotatedPatterns.some((rotatedPattern) => {
      if (!this._isReferenceHexMatch(boardHex, rotatedPattern[0])) {
        return false
      }
      return this._isPatternMatching(boardHex, rotatedPattern)
    })
  }

  private _isReferenceHexMatch(boardHex: Hex, referenceHex: Hex): boolean {
    return (
      boardHex.tokens.equals(referenceHex.tokens) ||
      (boardHex.tokens.isCombinationOfType('building') && referenceHex.tokens.isCombinationOfType('building'))
    )
  }

  private _matchPattern(boardHex: Hex, rotatedPattern: Hex[]): Hex[] {
    const matchedHexes: Hex[] = []

    for (const patternHex of rotatedPattern) {
      const { q, r } = this._calculateTargetHexCoordinates(boardHex, patternHex, rotatedPattern[0])
      const targetHex = this._hexes.get(`${q},${r}`)

      if (!this._isHexMatch(targetHex, patternHex)) {
        return [] // Early exit if any pattern hex doesn't match
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      matchedHexes.push(targetHex!) // Safe to push since we've already checked if it's a match
    }

    return matchedHexes
  }

  private _isPatternMatching(boardHex: Hex, rotatedPattern: Hex[]): boolean {
    for (const patternHex of rotatedPattern) {
      const { q, r } = this._calculateTargetHexCoordinates(boardHex, patternHex, rotatedPattern[0])
      const targetHex = this._hexes.get(`${q},${r}`)

      if (!this._isHexMatch(targetHex, patternHex)) {
        return false // Early exit if any pattern hex doesn't match
      }
    }

    return true
  }

  private _calculateTargetHexCoordinates(boardHex: Hex, patternHex: Hex, referenceHex: Hex): { q: number; r: number } {
    return {
      q: boardHex.q + (patternHex.q - referenceHex.q),
      r: boardHex.r + (patternHex.r - referenceHex.r),
    }
  }

  private _isHexMatch(targetHex: Hex | undefined, patternHex: Hex): boolean {
    return (
      targetHex !== undefined &&
      (targetHex.tokens.equals(patternHex.tokens) ||
        (targetHex.tokens.isCombinationOfType('building') && patternHex.tokens.isCombinationOfType('building')))
    )
  }
}

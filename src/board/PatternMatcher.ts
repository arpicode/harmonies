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

    if (patternHexes.length === 0) return true

    const patternKeyHex = patternHexes[0]

    const rotatedPatterns = this._generateRotatedPatterns(patternHexes)
    const matchedHexGroups: Hex[][] = []

    for (const hex of this._hexes.values()) {
      const matchedHexes = this._doesPatternMatchAtPosition(hex, rotatedPatterns, patternKeyHex)
      if (matchedHexes.length > 0) {
        matchedHexGroups.push(matchedHexes)
      }
    }

    matchedHexGroups.forEach((matchedHexes, index) => {
      console.log(`Pattern matched at hexes [Match ${index + 1}]: ${matchedHexes.map((h) => h.toString()).join(', ')}`)
    })

    return matchedHexGroups.length > 0
  }

  private _generateRotatedPatterns(patternHexes: Hex[]): Hex[][] {
    const rotations = []

    for (let i = 0; i < 6; i++) {
      const rotatedPattern = patternHexes.map((hex) => {
        return hex.rotate(i)
      })
      rotations.push(rotatedPattern)
    }

    return rotations
  }

  private _doesPatternMatchAtPosition(sourceHex: Hex, rotatedPatterns: Hex[][], patternKeyHex: Hex): Hex[] {
    for (const rotatedPattern of rotatedPatterns) {
      // The key hex in the rotated pattern should match with the sourceHex
      const rotatedKeyHex = rotatedPattern[0] // Assuming first hex is always the key

      if (!sourceHex.tokens.equals(rotatedKeyHex.tokens)) {
        continue
      }

      const matchedHexes: Hex[] = []
      const isMatch = rotatedPattern.every((hex) => {
        const q = sourceHex.q + (hex.q - rotatedKeyHex.q)
        const r = sourceHex.r + (hex.r - rotatedKeyHex.r)
        const targetHex = this._hexes.get(`${q},${r}`)

        if (
          !targetHex ||
          (!targetHex.tokens.equals(hex.tokens) &&
            !(targetHex.tokens.isCombinationOfType('building') && hex.tokens.isCombinationOfType('building')))
        ) {
          return false
        }

        matchedHexes.push(targetHex)

        return true
      })

      if (isMatch) {
        console.log(
          `Pattern matched using source hex: ${sourceHex.toString()} for pattern starting at: ${patternKeyHex.toString()}`
        )
        return matchedHexes
      }
    }

    return []
  }
}

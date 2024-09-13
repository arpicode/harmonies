import { HexBoard } from './HexBoard'
import IPatternMatcher from './interfaces/IPatternMatcher'
import { Hex } from './Hex'

export default class PatternMatcher implements IPatternMatcher {
  private _hexes: Map<string, Hex>

  constructor(hexes: Map<string, Hex>) {
    this._hexes = hexes
  }

  /**
   * Checks if the given pattern exists on the board.
   *
   * This method searches for the given pattern on the board by generating all possible
   * rotations of the pattern and checking if any of these rotations exist at any position
   * on the board.
   *
   * @param pattern - The pattern to check against the board.
   * @returns `true` if the pattern exists on the board, `false` otherwise.
   */
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

  /**
   * Finds all matching patterns on the board.
   *
   * This method searches for all occurrences of the given pattern on the board by generating
   * all possible rotations of the pattern and checking for matches at each position on the board.
   * It returns an array of arrays, where each inner array contains the hexes that match the pattern
   * at a specific position.
   *
   * @param pattern - The pattern to match against the board.
   * @returns An array of arrays of hexes, where each inner array represents a match of the pattern on the board.
   */
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

  /**
   * Finds all hexes on the board that match the spawn hex in the given pattern.
   *
   * This method searches for hexes on the board that correspond to the spawn hex
   * in the provided pattern. The method generates all possible rotations of the pattern and
   * checks for matches at each position on the board. If a match is found, the
   * corresponding hex on the board is added to the result.
   *
   * @param pattern - The pattern to match against the board.
   * @returns An array of unique hexes on the board that match the spawn hex in the pattern.
   */
  findSpawnHexFromMatchingPatterns(pattern: HexBoard): Hex[] {
    const spawnHexInPattern = Array.from(pattern.hexes.values()).find((hex) => hex.isSpawn)

    if (!spawnHexInPattern) return []

    // Generate rotated patterns for the entire pattern
    const patternHexes = Array.from(pattern.hexes.values()).filter((hex) => !hex.tokens.isEmpty())
    const rotatedPatterns = this._generateRotatedPatterns(patternHexes)

    const matchedSpawnHexes: Hex[] = []
    for (const hex of this._hexes.values()) {
      const matchesAtPosition = this._findMatchesAtPosition(hex, rotatedPatterns)
      for (const match of matchesAtPosition) {
        // Find the corresponding hex on the board that matches the pattern's spawn hex and add it to the result if not already present
        const spawnHexIndex = patternHexes.indexOf(spawnHexInPattern)
        if (spawnHexIndex !== -1) {
          if (!matchedSpawnHexes.some((hex) => hex.equals(match[spawnHexIndex])))
            matchedSpawnHexes.push(match[spawnHexIndex])
        }
      }
    }

    matchedSpawnHexes.forEach((hex, index) => {
      console.log(`Spawn hex matched at hex [Match ${index + 1}]: ${hex.toString()}`)
    })

    return matchedSpawnHexes
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

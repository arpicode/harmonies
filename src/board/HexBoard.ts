import { Hex } from './Hex'
import ITokenManager from './ITokenManager'
import HexTokenManager from './HexTokenManager'
import IPathFinder from './IPathFinder'
import HexPathFinder from './HexPathFinder'

export type HexBoardType = 'river' | 'island' | 'custom'

/**
 * Represents the hex-based board for the game.
 */
export class HexBoard {
  public readonly cols: number
  public readonly rows: number
  public readonly type: HexBoardType
  public readonly hexes = new Map<string, Hex>()
  public readonly tokenManager: ITokenManager
  public readonly hexPathFinder: IPathFinder

  /**
   * Creates an instance of HexBoard.
   * @param numCols - The number of columns in the hex board.
   * @param numRows - The number of rows in the hex board.
   * @param type - The type of the hex board, either 'river' or 'island'.
   * @param tokenManager - Optional custom token manager.
   * @param pathFinder - Optional custom path finder.
   */
  constructor(
    numCols: number,
    numRows: number,
    type: HexBoardType = 'river',
    tokenManager?: ITokenManager,
    pathFinder?: IPathFinder
  ) {
    this.cols = numCols
    this.rows = numRows
    this.type = type
    this._generateHexes()
    this.tokenManager = tokenManager ?? new HexTokenManager(this.hexes)
    this.hexPathFinder = pathFinder ?? new HexPathFinder(this.hexes)
  }

  private _generateHexes(): void {
    for (let col = 0; col < this.cols; col++) {
      for (let row = 0; row < this.rows; row++) {
        this._processHex(col, row)
      }
    }
  }

  private _processHex(col: number, row: number): void {
    if (this._isValidHex(col, row)) this._createAndStoreHex(col, row)
  }

  private _createAndStoreHex(col: number, row: number): void {
    const cubeCoords = Hex.oddQToCube(col, row)
    const hex = new Hex(cubeCoords.q, cubeCoords.r, cubeCoords.s)
    this.hexes.set(hex.id, hex)
  }

  /**
   * Checks if a hex is valid based on its column and row.
   * (Will remove the last row hex for every 2 columns.)
   * @param col - The column of the hex.
   * @param row - The row of the hex.
   * @returns `true` if the hex is valid, `false` otherwise.
   */
  private _isValidHex(col: number, row: number): boolean {
    return !(col % 2 === 1 && row === this.rows - 1)
  }

  /**
   * Adds a hex to the hex map.
   * @param q - The `q` coordinate of the hex.
   * @param r - The `r` coordinate of the hex.
   */
  addHex(q: number, r: number): void {
    const hex = new Hex(q, r, -q - r)
    this.hexes.set(hex.id, hex)
  }

  /**
   * Retrieves a hex from the hex map based on its q and r coordinates.
   * @param q - The `q` coordinate of the hex.
   * @param r - The `r` coordinate of the hex.
   * @returns The hex if found, `undefined` otherwise.
   */
  getHex(q: number, r: number): Hex | undefined {
    return this.hexes.get(`${q},${r}`)
  }

  /**
   * Retrieves all empty hexes from the hex map.
   * @returns An array of empty hexes.
   */
  getEmptyHexes(): Hex[] {
    return Array.from(this.hexes.values()).filter((hex) => hex.tokens.isEmpty())
  }

  /**
   * Returns a string representation of the hex board.
   * @returns A string representation of the hex board.
   */
  toString(): string {
    let result = ''
    for (const [key, hex] of this.hexes) {
      result += `${key}: ${hex}\n`
    }
    return result
  }

  serialize(): string {
    const hexes = Array.from(this.hexes.values())
    const board = hexes
      .filter((hex) => !hex.tokens.isEmpty())
      .map((hex) => {
        return { q: hex.q, r: hex.r, tokens: hex.tokens.toArray().map((t) => t.type) }
      })
    return JSON.stringify(board, null, 2)
  }

  /**
   * Checks if the current HexBoard contains the pattern formed by non-empty hexes in the 'other' HexBoard.
   * The pattern is considered to match if it can be found in any orientation.
   * @param other - The `other` HexBoard containing the pattern to search for.
   * @returns `true` if the pattern is found, `false` otherwise.
   */
  public hasPattern(other: HexBoard): boolean {
    const patternHexes = Array.from(other.hexes.values()).filter((hex) => !hex.tokens.isEmpty())

    if (patternHexes.length === 0) return true

    const patternKeyHex = patternHexes[0]

    const rotatedPatterns = this._generateRotatedPatterns(patternHexes)
    const matchedHexGroups: Hex[][] = []

    for (const hex of this.hexes.values()) {
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
        const rotatedHex = hex.rotate(i)
        rotatedHex.tokens = hex.tokens // Copy tokens from the original hex
        return rotatedHex
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
        const targetHex = this.getHex(sourceHex.q + (hex.q - rotatedKeyHex.q), sourceHex.r + (hex.r - rotatedKeyHex.r))

        if (!targetHex?.tokens.equals(hex.tokens)) {
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

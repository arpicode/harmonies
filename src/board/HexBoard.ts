import { Hex } from './Hex'
import ITokenManager from './ITokenManager'
import HexTokenManager from './HexTokenManager'
import IPathFinder from './IPathFinder'
import HexPathFinder from './HexPathFinder'
import IPatternMatcher from './IPatternMatcher'
import PatternMatcher from './PatternMatcher'
import Token, { TokenType } from './Token'

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
  public readonly patternMatcher: IPatternMatcher

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
    pathFinder?: IPathFinder,
    patternMatcher?: IPatternMatcher
  ) {
    this.cols = numCols
    this.rows = numRows
    this.type = type
    this._generateHexes()
    this.tokenManager = tokenManager ?? new HexTokenManager(this.hexes)
    this.hexPathFinder = pathFinder ?? new HexPathFinder(this.hexes)
    this.patternMatcher = patternMatcher ?? new PatternMatcher(this.hexes)
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
   * @param tokenTypes - Optional token types to add to the hex.
   */
  addHex(q: number, r: number, tokenTypes?: TokenType[]): void {
    const hex = new Hex(q, r, -q - r)
    if (tokenTypes) {
      tokenTypes.forEach((type) => hex.tokens.push(new Token(type)))
    }
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
   * Checks if the current HexBoard contains the pattern formed by non-empty hexes in the `other` HexBoard.
   * The pattern is considered to match if it can be found in any orientation.
   * @param other - The `other` HexBoard containing the pattern to search for.
   * @returns `true` if the pattern is found, `false` otherwise.
   */
  public hasPattern(other: HexBoard): boolean {
    return this.patternMatcher.hasPattern(other)
  }

  /**
   * Finds all matching patterns in the current HexBoard that match the pattern formed by non-empty hexes in the `other` HexBoard.
   * @param other - The `other` HexBoard containing the pattern to search for.
   * @returns An array of arrays of hexes that match the pattern.
   */
  public findAllMatchingPatterns(other: HexBoard): Hex[][] {
    return this.patternMatcher.findAllMatchingPatterns(other)
  }
}

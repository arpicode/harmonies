import { IAnimalPatternHex } from './AnimalCard'
import Token from './Token'
import TokenStack from './TokenStack'

export interface IOffsetCoord {
  col: number
  row: number
}

export interface IAxialCoord {
  q: number
  r: number
}

export interface ICubeCoord extends IAxialCoord {
  s: number
}

/**
 * Represents a hexagon on a hex-based grid.
 */
export class Hex {
  public static directions: Hex[]
  public static diagonals: Hex[]
  public static rotations: ((q: number, r: number, s: number) => Hex)[]
  public readonly tokens = new TokenStack()
  public readonly id: string
  private _offsetCoords: IOffsetCoord

  constructor(public q: number, public r: number, public s: number) {
    if (q + r + s !== 0) throw new Error('Invalid cube coordinates: q + r + s must be 0')
    this.id = `${q},${r}`
    this._offsetCoords = this.cubeToOddQ()
  }

  public static fromJson(json: IAnimalPatternHex): Hex {
    const hex = new Hex(json.q, json.r, -json.q - json.r)
    json.tokenTypes.forEach((tokenType) => hex.tokens.push(new Token(tokenType)))
    return hex
  }

  /**
   * Adds another hexagon to this hexagon.
   * @param other - The hexagon to add.
   * @returns The resulting hexagon.
   */
  add(other: Hex): Hex {
    return new Hex(this.q + other.q, this.r + other.r, this.s + other.s)
  }

  /**
   * Subtracts another hexagon from this hexagon.
   * @param other - The hexagon to subtract.
   * @returns The resulting hexagon.
   */
  subtract(other: Hex): Hex {
    return new Hex(this.q - other.q, this.r - other.r, this.s - other.s)
  }

  /**
   * Scales the hexagon by a factor.
   * @param k - The scaling factor.
   * @returns The resulting hexagon.
   */
  scale(k: number): Hex {
    return new Hex(this.q * k, this.r * k, this.s * k)
  }

  /**
   * Rotates the hexagon by a given number of 60-degree steps around the origin counter-clockwise.
   * The origin is the hexagon at (0, 0, 0).
   * @param steps - The number of 60-degree steps to rotate.
   * @returns A new rotated hexagon.
   */
  rotate(steps: number): Hex {
    const rotatedHex = Hex.rotations[steps % 6](this.q, this.r, this.s)
    this.tokens.toArray().forEach((token) => rotatedHex.tokens.push(token))

    return rotatedHex
  }

  /**
   * Rotates the hexagon to the left.
   * @returns The resulting hexagon.
   */
  rotateLeft(): Hex {
    return new Hex(-this.s, -this.q, -this.r)
  }

  /**
   * Rotates the hexagon to the right.
   * @returns The resulting hexagon.
   */
  rotateRight(): Hex {
    return new Hex(-this.r, -this.s, -this.q)
  }

  /**
   * Calculates the distance to another hexagon.
   * @param other - The hexagon to measure the distance to.
   * @returns The distance to the hexagon.
   */
  distance(other: Hex): number {
    const diff = this.subtract(other)
    return Math.max(Math.abs(diff.q), Math.abs(diff.r), Math.abs(diff.s))
  }

  /**
   * Gets the neighboring hexagon in a given direction.
   *
   * ```plaintext
   * The directions are as follows:
   * 0: East
   * 1: Southeast
   * 2: Southwest
   * 3: West
   * 4: Northwest
   * 5: Northeast
   * ```
   * @param direction - The direction index.
   * @returns The neighboring hexagon.
   * @throws Will throw an error if the direction is invalid.
   */
  neighbor(direction: number): Hex {
    if (direction < 0 || direction >= Hex.directions.length) {
      throw new Error(`Invalid direction: ${direction}. Must be between 0 and ${Hex.directions.length - 1}.`)
    }
    const dir = Hex.directions[direction]
    return this.add(dir)
  }

  /**
   * Gets the diagonal neighboring hexagon in a given direction.
   *
   * ```plaintext
   * The directions are as follows:
   * 0: East-Northeast
   * 1: Southeast
   * 2: Southwest
   * 3: West-Southwest
   * 4: Northwest
   * 5: Northeast
   * ```
   * @param direction - The direction index.
   * @returns The diagonal neighboring hexagon.
   * @throws Will throw an error if the direction is invalid.
   */
  diagonalNeighbor(direction: number): Hex {
    if (direction < 0 || direction >= Hex.diagonals.length) {
      throw new Error(`Invalid direction: ${direction}. Must be between 0 and ${Hex.diagonals.length - 1}.`)
    }
    const dir = Hex.diagonals[direction]
    return this.add(dir)
  }

  /**
   * Converts cube coordinates to odd-q offset coordinates.
   * {@link https://www.redblobgames.com/grids/hexagons/#conversions}
   * @returns The offset coordinates.
   */
  cubeToOddQ(): IOffsetCoord {
    const col = this.q
    // x & 1 returns 1 if x is odd and 0 if x is even <=> x % 2
    const row = this.r + (this.q - (this.q & 1)) / 2
    return { col, row }
  }

  /**
   * Converts odd-q offset coordinates to cube coordinates.
   * {@link https://www.redblobgames.com/grids/hexagons/#conversions}
   * @param col - The column coordinate.
   * @param row - The row coordinate.
   * @returns The cube coordinates.
   */
  static oddQToCube(col: number, row: number): ICubeCoord {
    const q = col
    const r = row - (col - (col & 1)) / 2
    const s = -q - r
    return { q, r, s }
  }

  /**
   * Returns a string representation of the hexagon.
   * @returns The string representation.
   */
  toString(): string {
    return `Hex(${this.q}, ${this.r}, ${this.s}) tokens: ${this.tokens}`
  }

  /**
   * Checks if another hexagon is equal to this hexagon.
   * @param other - The hexagon to compare.
   * @returns True if the hexagons are equal, false otherwise.
   */
  equals(other: Hex): boolean {
    return this.q === other.q && this.r === other.r && this.s === other.s
  }

  /**
   * Gets the offset coordinates of the hexagon.
   * @returns The offset coordinates.
   */
  get offsetCoords(): IOffsetCoord {
    return this._offsetCoords
  }

  /**
   * Gets the axial coordinates of the hexagon.
   * @returns The axial coordinates.
   */
  get axialCoords(): IAxialCoord {
    return { q: this.q, r: this.r }
  }

  /**
   * Gets the cube coordinates of the hexagon.
   * @returns The cube coordinates.
   */
  get cubeCoords() {
    return {
      q: Object.is(this.q, -0) ? 0 : this.q,
      r: Object.is(this.r, -0) ? 0 : this.r,
      s: Object.is(this.s, -0) ? 0 : this.s,
    }
  }
}

Hex.directions = [
  new Hex(1, 0, -1),
  new Hex(1, -1, 0),
  new Hex(0, -1, 1),
  new Hex(-1, 0, 1),
  new Hex(-1, 1, 0),
  new Hex(0, 1, -1),
] as const

Hex.diagonals = [
  new Hex(2, -1, -1),
  new Hex(1, -2, 1),
  new Hex(-1, -1, 2),
  new Hex(-2, 1, 1),
  new Hex(-1, 2, -1),
  new Hex(1, 1, -2),
] as const

Hex.rotations = [
  (q: number, r: number, s: number) => new Hex(q, r, s),
  (q: number, r: number, s: number) => new Hex(-s, -q, -r),
  (q: number, r: number, s: number) => new Hex(r, s, q),
  (q: number, r: number, s: number) => new Hex(-q, -r, -s),
  (q: number, r: number, s: number) => new Hex(s, q, r),
  (q: number, r: number, s: number) => new Hex(-r, -s, -q),
] as const

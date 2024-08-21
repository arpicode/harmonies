export enum TokenType {
  Blue = 'River',
  Gray = 'Mountain',
  Brown = 'Wood',
  Green = 'Leaves',
  Yellow = 'Field',
  Red = 'Bricks',
}

export const startingTokensMap = new Map<TokenType, number>([
  [TokenType.Blue, 23],
  [TokenType.Gray, 23],
  [TokenType.Brown, 21],
  [TokenType.Green, 19],
  [TokenType.Yellow, 19],
  [TokenType.Red, 15],
])

export default class Token {
  private static nextId = 1

  private _hasAnimal: boolean

  readonly id: number
  readonly type: TokenType

  /**
   * Creates a default instance of Token with no animal.
   * @param type - The type of the token.
   */
  constructor(type: TokenType) {
    this.id = Token.nextId++
    this.type = type
    this._hasAnimal = false
  }

  /**
   * Gets whether the token has an animal.
   * @returns True if the token has an animal, otherwise false.
   */
  public get hasAnimal(): boolean {
    return this._hasAnimal
  }

  /**
   * Sets whether the token has an animal.
   * @param value - True if the token has an animal, otherwise false.
   */
  public set hasAnimal(value: boolean) {
    this._hasAnimal = value
  }

  /**
   * Returns a string representation of the token.
   * @returns A string representing the token.
   */
  toString(): string {
    return this.type
  }

  /**
   * Checks if this token is equal to another token.
   * @param other - The other token to compare.
   * @returns True if the tokens are equal, otherwise false.
   */
  equals(other: Token): boolean {
    return this.id === other.id && this.type === other.type
  }
}

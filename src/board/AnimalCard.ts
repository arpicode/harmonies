import { TokenType } from './Token'

import { Hex } from './Hex'
import { HexBoard } from './HexBoard'

export interface IAnimalPatternHex {
  q: number
  r: number
  tokenTypes: TokenType[]
  isSpawn?: boolean
}

export interface IAnimal {
  name: string
  ecosystem: string
  image: string
  points: number[]
  pattern: IAnimalPatternHex[]
}

export type IAnimalCards = Record<string, IAnimal>

export default class AnimalCard {
  public readonly name: string
  public readonly ecosystem: string
  public readonly image: string
  public readonly points: number[]
  public readonly pattern: HexBoard
  public animalTokenCount: number
  public timestamp?: number

  constructor(animal: IAnimal) {
    const { name, ecosystem, image, points, pattern } = animal
    this.name = name
    this.ecosystem = ecosystem
    this.image = image
    this.points = points
    this.pattern = new HexBoard(0, 0, 'custom')
    this.animalTokenCount = points.length

    pattern.forEach((animalPatternHex) => {
      const hex = Hex.fromJson(animalPatternHex)
      this.pattern.hexes.set(hex.id, hex)
    })
  }

  isCompleted(): boolean {
    return this.animalTokenCount === 0
  }

  removeAnimalToken(): void {
    this.animalTokenCount--
  }

  value(): number {
    return this.points[this.points.length - this.animalTokenCount]
  }
}

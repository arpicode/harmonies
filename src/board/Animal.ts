import { TokenType } from './Token'

import { Hex } from './Hex'
import { HexBoard } from './HexBoard'

export interface IAnimalPattern {
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
  pattern: IAnimalPattern[]
}

export type IAnimalCards = Record<string, IAnimal>

export default class Animal {
  public readonly name: string
  public readonly ecosystem: string
  public readonly image: string
  public readonly points: number[]
  public readonly pattern: HexBoard
  public timestamp?: number

  constructor(animal: IAnimal) {
    const { name, ecosystem, image, points, pattern } = animal
    this.name = name
    this.ecosystem = ecosystem
    this.image = image
    this.points = points
    this.pattern = new HexBoard(0, 0, 'custom')

    pattern.forEach((animalPattern) => {
      const hex = Hex.fromJson(animalPattern)
      this.pattern.hexes.set(hex.id, hex)
    })
  }
}

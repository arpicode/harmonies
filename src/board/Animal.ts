import { TokenType } from './Token'

import animalsJson from '../animals.json'
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
  image?: string
  points: number[]
  pattern: IAnimalPattern[]
}

export type Animals = Record<string, IAnimal>

const animals = animalsJson as Animals

export default class Animal {
  public readonly name: string
  public readonly ecosystem: string
  public readonly image?: string
  public readonly points: number[]
  public readonly pattern: HexBoard

  constructor(key: keyof Animals) {
    const { name, ecosystem, image, points, pattern: animalPatterns } = animals[key]
    this.name = name
    this.ecosystem = ecosystem
    this.image = image
    this.points = points
    this.pattern = new HexBoard(0, 0, 'custom')

    animalPatterns.forEach((animalPattern) => {
      const hex = Hex.fromJson(animalPattern)
      this.pattern.hexes.set(hex.id, hex)
    })
  }
}

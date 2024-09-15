import AnimalCard, { IAnimalCards } from '../AnimalCard'
import { HexBoard } from '../HexBoard'
import Token, { TokenType } from '../Token'
import TokenStack from '../TokenStack'

import animalsJson from '../../animals.json'
const animals = animalsJson as IAnimalCards

describe('Animal', () => {
  let animal: AnimalCard

  describe('constructor', () => {
    beforeAll(() => {
      animal = new AnimalCard(animals.bee)
    })

    it('should initialize name correctly', () => {
      expect(animal.name).toBe('Abeille')
    })

    it('should initialize ecosystem correctly', () => {
      expect(animal.ecosystem).toBe('Leaves')
    })

    it('should initialize points correctly', () => {
      expect(animal.points).toEqual([18, 8])
    })

    it('should initialize image correctly', () => {
      expect(animal.image).toBe('animals/bee.webp')
    })

    it('should initialize pattern as a HexBoard', () => {
      expect(animal.pattern).toBeInstanceOf(HexBoard)
    })

    it('should set hexes in pattern correctly', () => {
      const pattern = animal.pattern
      expect(pattern.hexes.size).toBe(4)

      const tree = new TokenStack([new Token(TokenType.Brown), new Token(TokenType.Green)])
      expect(pattern.getHex(0, 0)?.tokens.equals(tree)).toBe(true)

      const field = new TokenStack([new Token(TokenType.Yellow)])
      expect(pattern.getHex(1, 0)?.tokens.equals(field)).toBe(true)
      expect(pattern.getHex(-1, 1)?.tokens.equals(field)).toBe(true)
      expect(pattern.getHex(0, 1)?.tokens.equals(field)).toBe(true)
    })
  })

  describe('isCompleted', () => {
    it('should return false when card is not completed', () => {
      animal = new AnimalCard(animals.bee)
      expect(animal.isCompleted()).toBe(false)
    })

    it('should return true when card is completed', () => {
      animal = new AnimalCard(animals.bee)
      animal.removeAnimalToken()
      animal.removeAnimalToken()
      expect(animal.isCompleted()).toBe(true)
    })
  })

  describe('value', () => {
    it('should return the correct point value based on animalTokenCount', () => {
      animal = new AnimalCard(animals.bee)
      expect(animal.value()).toBe(18)
      animal.removeAnimalToken()
      expect(animal.value()).toBe(8)
    })

    it('should set isCompleted to true when animalTokenCount reaches 0', () => {
      animal = new AnimalCard(animals.bee)
      animal.removeAnimalToken()
      animal.removeAnimalToken()
      expect(animal.isCompleted()).toBe(true)
    })
  })
})

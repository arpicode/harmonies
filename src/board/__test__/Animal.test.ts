import Animal, { IAnimalCards } from '../Animal'
import { HexBoard } from '../HexBoard'
import Token, { TokenType } from '../Token'
import TokenStack from '../TokenStack'

import animalsJson from '../../animals.json'
const animals = animalsJson as IAnimalCards

describe('Animal', () => {
  let animal: Animal

  describe('constructor', () => {
    beforeAll(() => {
      animal = new Animal(animals.bee)
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
      expect(animal.image).toBe('animals/bee.png')
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
})

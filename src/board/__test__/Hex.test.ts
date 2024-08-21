import { describe, it, expect } from 'vitest'
import { Hex } from '../Hex'
import Token, { TokenType } from '../Token'

// Utility function to compare two objects deeply
const isEqual = (obj1: unknown, obj2: unknown) => JSON.stringify(obj1) === JSON.stringify(obj2)

describe('Hex', () => {
  describe('constructor', () => {
    it('should create a hex with valid coordinates', () => {
      const hex = new Hex(1, -1, 0)
      expect(hex.q).toBe(1)
      expect(hex.r).toBe(-1)
      expect(hex.s).toBe(0)
    })

    it('should throw an error for invalid coordinates', () => {
      expect(() => new Hex(1, 1, 1)).toThrow('Invalid cube coordinates: q + r + s must be 0')
    })
  })

  describe('subtract', () => {
    it('should subtract two hexes correctly', () => {
      const hex1 = new Hex(3, -1, -2)
      const hex2 = new Hex(1, -1, 0)
      const result = hex1.subtract(hex2)
      expect(result.cubeCoords).toEqual({ q: 2, r: 0, s: -2 })
    })
  })

  describe('scale', () => {
    it('should scale a hex correctly', () => {
      const hex = new Hex(1, -1, 0)
      const result = hex.scale(3)
      expect(result.cubeCoords).toEqual({ q: 3, r: -3, s: 0 })
    })
  })

  describe('rotateLeft', () => {
    it('should rotate a hex to the left correctly', () => {
      const hex = new Hex(1, -1, 0)
      const result = hex.rotateLeft()
      expect(result.cubeCoords).toEqual({ q: 0, r: -1, s: 1 })
    })
  })

  describe('rotateRight', () => {
    it('should rotate a hex to the right correctly', () => {
      const hex = new Hex(1, -1, 0)
      const result = hex.rotateRight()
      expect(result.cubeCoords).toEqual({ q: 1, r: 0, s: -1 })
    })
  })

  describe('distance', () => {
    it('should calculate the distance between two hexes correctly', () => {
      const hex1 = new Hex(3, -1, -2)
      const hex2 = new Hex(1, -1, 0)
      const result = hex1.distance(hex2)
      expect(result).toBe(2)
    })
  })

  describe('neighbor', () => {
    it('should return the correct neighbor hex', () => {
      const hex = new Hex(0, 0, 0)
      const neighbor = hex.neighbor(0)
      expect(isEqual(neighbor.cubeCoords, { q: 1, r: 0, s: -1 })).toBe(true)
    })

    it('should throw an error for invalid direction', () => {
      const hex = new Hex(0, 0, 0)
      expect(() => hex.neighbor(6)).toThrow('Invalid direction')
    })
  })

  describe('diagonalNeighbor', () => {
    it('should return the correct diagonal neighbor hex', () => {
      const hex = new Hex(0, 0, 0)
      const diagonalNeighbor = hex.diagonalNeighbor(0)
      expect(isEqual(diagonalNeighbor.cubeCoords, { q: 2, r: -1, s: -1 })).toBe(true)
    })

    it('should throw an error for invalid direction', () => {
      const hex = new Hex(0, 0, 0)
      expect(() => hex.diagonalNeighbor(6)).toThrow('Invalid direction')
    })
  })

  describe('cubeToOddQ', () => {
    it('should convert cube coordinates to offset coordinates', () => {
      const hex = new Hex(1, -1, 0)
      const offset = hex.cubeToOddQ()
      expect(offset).toEqual({ col: 1, row: -1 })
    })
  })

  describe('oddQToCube', () => {
    it('should convert offset coordinates to cube coordinates', () => {
      const cube = Hex.oddQToCube(1, -1)
      expect(cube).toEqual({ q: 1, r: -1, s: 0 })
    })
  })

  describe('getters', () => {
    it('should return the correct offset coordinates', () => {
      const hex = new Hex(1, -1, 0)
      expect(hex.offsetCoords).toEqual({ col: 1, row: -1 })
    })

    it('should return the correct axial coordinates', () => {
      const hex = new Hex(1, -1, 0)
      expect(hex.axialCoords).toEqual({ q: 1, r: -1 })
    })

    it('should return the correct cube coordinates', () => {
      const hex = new Hex(1, -1, -0)
      expect(hex.cubeCoords).toEqual({ q: 1, r: -1, s: 0 })
      expect(hex.cubeCoords.q).toBe(1)
      expect(hex.cubeCoords.r).toBe(-1)
      expect(hex.cubeCoords.s).toBe(0)
    })

    it('should return the correct content', () => {
      const hex = new Hex(0, 0, 0)
      expect(hex.tokens.isEmpty()).toBe(true)
    })

    it('should set and return the correct content', () => {
      const hex1 = new Hex(0, 0, 0)
      const hex2 = new Hex(1, -1, 0)
      hex1.tokens.push(new Token(TokenType.Blue))
      hex2.tokens.push(new Token(TokenType.Red))
      const token = hex2.tokens.peek()
      if (token) {
        token.hasAnimal = true
      }

      expect(hex1.tokens.size()).toBe(1)
      expect(hex2.tokens.size()).toBe(1)

      const hex1Tokens = hex1.tokens.pop()
      expect(hex1Tokens?.id).toBe(1)
      expect(hex1Tokens?.type).toBe(TokenType.Blue)
      expect(hex1Tokens?.hasAnimal).toBe(false)

      const hex2Tokens = hex2.tokens.pop()
      expect(hex2Tokens?.id).toBe(2)
      expect(hex2Tokens?.type).toBe(TokenType.Red)
      expect(hex2Tokens?.hasAnimal).toBe(true)
    })
  })

  describe('toString', () => {
    it('should return the correct string representation of an empty hex', () => {
      const hex = new Hex(1, -1, 0)
      expect(hex.toString()).toBe('Hex(1, -1, 0) tokens: <empty>')
    })

    it('should return the correct string representation of a hex with tokens', () => {
      const hex = new Hex(1, -1, 0)
      hex.tokens.push(new Token(TokenType.Brown))
      expect(hex.toString()).toBe('Hex(1, -1, 0) tokens: [Wood]')
      hex.tokens.push(new Token(TokenType.Brown))
      expect(hex.toString()).toBe('Hex(1, -1, 0) tokens: [Wood, Wood]')
      hex.tokens.push(new Token(TokenType.Green))
      expect(hex.toString()).toBe('Hex(1, -1, 0) tokens: [Wood, Wood, Leaves]')
    })
  })

  describe('equals', () => {
    it('should return true for equal hexes', () => {
      const hex1 = new Hex(1, -1, 0)
      const hex2 = new Hex(1, -1, 0)
      expect(hex1.equals(hex2)).toBe(true)
    })

    it('should return false for unequal hexes', () => {
      const hex1 = new Hex(1, -1, 0)
      const hex2 = new Hex(0, 0, 0)
      expect(hex1.equals(hex2)).toBe(false)
    })
  })

  describe('static arrays', () => {
    it('should have the correct _directions array', () => {
      const directions = [
        new Hex(1, 0, -1),
        new Hex(1, -1, 0),
        new Hex(0, -1, 1),
        new Hex(-1, 0, 1),
        new Hex(-1, 1, 0),
        new Hex(0, 1, -1),
      ]
      expect(Hex.directions).toEqual(directions)
    })

    it('should have the correct _diagonals array', () => {
      const diagonals = [
        new Hex(2, -1, -1),
        new Hex(1, -2, 1),
        new Hex(-1, -1, 2),
        new Hex(-2, 1, 1),
        new Hex(-1, 2, -1),
        new Hex(1, 1, -2),
      ]
      expect(Hex.diagonals).toEqual(diagonals)
    })
  })
})

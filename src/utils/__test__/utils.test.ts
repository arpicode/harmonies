import { arraysEqual, mapKeysToArray, mapValuesToArray } from '../utils'

describe('utils', () => {
  describe('arraysEqual', () => {
    it('should return true for two equal arrays', () => {
      const arr1 = [1, 2, 3]
      const arr2 = [1, 2, 3]
      expect(arraysEqual(arr1, arr2)).toBe(true)
    })

    it('should return false for arrays of different lengths', () => {
      const arr1 = [1, 2, 3]
      const arr2 = [1, 2]
      expect(arraysEqual(arr1, arr2)).toBe(false)
    })

    it('should return false for arrays with same length but different elements', () => {
      const arr1 = [1, 2, 3]
      const arr2 = [1, 2, 4]
      expect(arraysEqual(arr1, arr2)).toBe(false)
    })

    it('should return true for two empty arrays', () => {
      const arr1: number[] = []
      const arr2: number[] = []
      expect(arraysEqual(arr1, arr2)).toBe(true)
    })
  })

  describe('mapKeysToArray', () => {
    it('should return an array of keys from a map', () => {
      const map = new Map<string, number>([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ])
      expect(mapKeysToArray(map)).toEqual(['a', 'b', 'c'])
    })

    it('should return an empty array for an empty map', () => {
      const map = new Map<string, number>()
      expect(mapKeysToArray(map)).toEqual([])
    })
  })

  describe('mapValuesToArray', () => {
    it('should return an array of values from a map', () => {
      const map = new Map<string, number>([
        ['a', 1],
        ['b', 2],
        ['c', 3],
      ])
      expect(mapValuesToArray(map)).toEqual([1, 2, 3])
    })

    it('should return an empty array for an empty map', () => {
      const map = new Map<string, number>()
      expect(mapValuesToArray(map)).toEqual([])
    })
  })
})

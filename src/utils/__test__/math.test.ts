import { combination } from '../math'

interface args {
  n: number
  k: number
  expected: number
}

describe('combination', () => {
  it.each`
    n      | k    | expected
    ${5}   | ${2} | ${10}
    ${6}   | ${2} | ${15}
    ${120} | ${3} | ${280840}
  `('should return $expected for combination($n, $k)', ({ n, k, expected }: args) => {
    expect(combination(n, k)).toBe(expected)
  })

  // Edge cases
  it('should return 0 when k < 0', () => {
    expect(combination(5, -1)).toBe(0)
  })

  it('should return 0 when n < 0', () => {
    expect(combination(-5, 2)).toBe(0)
  })

  it('should return 0 when k > n', () => {
    expect(combination(5, 6)).toBe(0)
  })

  it('should return 1 when k = 0', () => {
    expect(combination(5, 0)).toBe(1)
  })

  it('should return 1 when k = n', () => {
    expect(combination(5, 5)).toBe(1)
  })

  it('should handle boundary values', () => {
    expect(combination(0, 0)).toBe(1)
    expect(combination(1, 1)).toBe(1)
    expect(combination(1, 0)).toBe(1)
    expect(combination(0, 1)).toBe(0)
  })

  it('should handle large numbers correctly', () => {
    expect(combination(1000, 2)).toBe(499500)
  })

  it('should handle very large values of n and k', () => {
    expect(combination(10000, 2)).toBe(49995000)
    expect(combination(10000, 9999)).toBe(10000)
  })

  it('should return 0 for non-integer inputs', () => {
    expect(combination(5.5, 2)).toBe(0)
    expect(combination(5, 2.5)).toBe(0)
  })

  it('should use memoized results for repeated calls', () => {
    const spy = vi.spyOn(global.Math, 'min')
    expect(spy).toHaveBeenCalledTimes(0)
    expect(combination(10, 5)).toBe(252)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(combination(10, 5)).toBe(252)
    expect(spy).toHaveBeenCalledTimes(1)
    spy.mockRestore()
  })
})

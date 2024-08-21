const memo: Record<string, number> = {}

export function combination(n: number, k: number): number {
  if (!Number.isInteger(n) || !Number.isInteger(k)) return 0
  const key = `${n},${k}`
  if (key in memo) return memo[key]
  if (k === 0 || k === n) return 1
  if (n < 0 || k < 0 || k > n) return 0

  // iterative approach to avoid call stack limit
  const minK = Math.min(k, n - k) // Take advantage of symmetry
  let result = 1
  for (let i = 0; i < minK; i++) {
    result *= n - i
    result /= i + 1
  }

  memo[key] = result
  return result
}

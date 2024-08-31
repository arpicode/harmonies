/**
 * Compares two arrays for equality. Shallow comparison is performed.
 *
 * @typeParam  T - The type of elements in the arrays.
 * @param  arr1 - The first array to compare.
 * @param  arr2 - The second array to compare.
 * @returns `true` if the arrays are equal, otherwise `false`.
 *
 * @example
 * ```typescript
 * const arr1 = [1, 2, 3];
 * const arr2 = [1, 2, 3];
 * const result = arraysEqual(arr1, arr2); // true
 * ```
 */
export function arraysEqual<T>(arr1: T[], arr2: T[]): boolean {
  return arr1.length === arr2.length && arr1.every((value, index) => value === arr2[index])
}

/**
 * Converts the keys of a Map to an array.
 *
 * @typeParam K - The type of keys in the map.
 * @typeParam V - The type of values in the map.
 * @param map - The map whose keys are to be converted.
 * @returns An array containing the keys of the map.
 *
 * @example
 * ```typescript
 * const map = new Map<string, number>([['a', 1], ['b', 2], ['c', 3]]);
 * const keys = mapKeysToArray(map); // ['a', 'b', 'c']
 * ```
 */
export function mapKeysToArray<K, V>(map: Map<K, V>): K[] {
  return Array.from(map.keys())
}

/**
 * Converts the values of a Map to an array.
 *
 * @typeParam K - The type of keys in the map.
 * @typeParam V - The type of values in the map.
 * @param map - The map whose values are to be converted.
 * @returns An array containing the values of the map.
 *
 * @example
 * ```typescript
 * const map = new Map<string, number>([['a', 1], ['b', 2], ['c', 3]]);
 * const values = mapValuesToArray(map); // [1, 2, 3]
 * ```
 */
export function mapValuesToArray<K, V>(map: Map<K, V>): V[] {
  return Array.from(map.values())
}

export const SVG_NAMESPACE = 'http://www.w3.org/2000/svg'

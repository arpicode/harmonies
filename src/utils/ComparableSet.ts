type Hash = string

/**
 * Interface representing a comparable object.
 */
export interface IComparable<T> {
  /**
   * Checks if this object is equal to another object.
   * @param other - The other object to compare with.
   * @returns `true` if the objects are equal, otherwise `false`.
   */
  equals(other: T): boolean

  /**
   * Generates a hash code for this object.
   * @returns A string representing the hash code.
   */
  hashCode(): Hash
}

/**
 * A set-like collection that uses a map to store comparable objects.
 * @typeParam T - The type of elements in the set, which must implement the `IComparable` interface.
 */
export default class ComparableSet<T extends IComparable<T>> {
  private map = new Map<Hash, T[]>()
  private _size = 0

  constructor(iterable?: Iterable<T>) {
    if (iterable) {
      for (const item of iterable) {
        this.add(item)
      }
    }
  }

  /**
   * Adds a new element to the set if it does not already exist.
   * @param value - The element to add.
   * @returns The `ComparableSet` instance.
   */
  add(value: T): this {
    const key = value.hashCode()
    const existingItems = this.map.get(key) ?? []

    if (!existingItems.some((item) => item.equals(value))) {
      existingItems.push(value)
      this.map.set(key, existingItems)
      this._size++
    }

    return this
  }

  /**
   * Adds multiple elements to the set.
   * @param values - An iterable of elements to add.
   * @returns The `ComparableSet` instance.
   */
  addMany(values: Iterable<T>): this {
    for (const value of values) {
      this.add(value)
    }

    return this
  }

  /**
   * Checks if the set contains a specific element.
   * @param value - The element to check.
   * @returns `true` if the set contains the element, otherwise `false`.
   */
  has(value: T): boolean {
    const key = value.hashCode()
    const existingItems = this.map.get(key) ?? []

    return existingItems.some((item) => item.equals(value))
  }

  /**
   * Removes an element from the set.
   * @param value - The element to remove.
   * @returns `true` if the element was removed, otherwise `false`.
   */
  delete(value: T): boolean {
    const key = value.hashCode()
    const existingItems = this.map.get(key) ?? []

    const index = existingItems.findIndex((item) => item.equals(value))
    if (index !== -1) {
      existingItems.splice(index, 1)
      if (existingItems.length === 0) {
        this.map.delete(key)
      } else {
        this.map.set(key, existingItems)
      }
      this._size--
      return true
    }

    return false
  }

  /**
   * Removes all elements from the set.
   */
  clear(): void {
    this.map.clear()
    this._size = 0
  }

  /**
   * Returns the number of elements in the set.
   * @returns The number of elements in the set.
   */
  get size(): number {
    return this._size
  }

  /**
   * Allows the set to be iterated over using a `for...of` loop.
   * @returns An `iterator` for the set.
   */
  *[Symbol.iterator](): IterableIterator<T> {
    for (const items of this.map.values()) {
      yield* items
    }
  }
}

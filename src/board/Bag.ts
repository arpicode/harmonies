/**
 * A generic class representing a bag that can hold items of any type.
 * Provides methods to add, draw, shuffle, and clear items.
 *
 * @typeParam T - The type of items held in the bag.
 */
export default class Bag<T> {
  /**
   * Error message thrown when attempting to draw more items than are available in the bag.
   */
  public static readonly NOT_ENOUGH_ITEMS_ERROR_MESSAGE = 'Cannot draw more items than there are in the bag'

  private _items: T[] = []

  /**
   * Adds an item to the bag.
   *
   * @param item - The `item` to add to the bag.
   */
  add(item: T) {
    this._items.push(item)
  }

  /**
   * Checks if the bag is empty.
   *
   * @returns True if the bag is empty, false otherwise.
   */
  isEmpty(): boolean {
    return this._items.length === 0
  }

  /**
   * Gets the number of items in the bag.
   *
   * @returns The number of items in the bag.
   */
  size(): number {
    return this._items.length
  }

  /**
   * Draws a specified number of items from the bag.
   *
   * @param n - The number of items to draw.
   * @returns An array containing the drawn items.
   * @throws `RangeError` If the number `n` of items to draw is greater than the number of items in the bag.
   */
  draw(n: number): T[] {
    if (n > this._items.length) throw new RangeError(Bag.NOT_ENOUGH_ITEMS_ERROR_MESSAGE)

    const result = this._items.slice(0, n)
    this._items = this._items.slice(n)
    return result
  }

  /**
   * Shuffles the items in the bag using the Fisher-Yates algorithm.
   */
  shuffle() {
    for (let i = this._items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[this._items[i], this._items[j]] = [this._items[j], this._items[i]]
    }
  }

  /**
   * Clears all items from the bag.
   */
  clear() {
    this._items = []
  }

  toString(): string {
    return this._items.toString()
  }

  get items(): T[] {
    return this._items
  }
}

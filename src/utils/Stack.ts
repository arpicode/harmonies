export default class Stack<T> {
  protected items: T[] = []

  constructor(items: T[] = []) {
    this.items = items
  }

  /**
   * Adds an item to the stack.
   * @param item - The item to be added.
   */
  push(item: T) {
    this.items.push(item)
  }

  /**
   * Removes and returns the last item from the stack.
   * @returns The last item in the stack, or undefined if the stack is empty.
   */
  pop(): T | undefined {
    return this.items.pop()
  }

  /**
   * Returns the last item without removing it.
   * @returns The last item in the stack, or undefined if the stack is empty.
   */
  peek(): T | undefined {
    if (this.isEmpty()) return

    return this.items[this.items.length - 1]
  }

  /**
   * Checks if the stack is empty.
   * @returns True if the stack is empty, false otherwise.
   */
  isEmpty(): boolean {
    return this.items.length === 0
  }

  /**
   * Returns the number of items in the stack.
   * @returns The size of the stack.
   */
  size(): number {
    return this.items.length
  }

  /**
   * Empties the stack.
   */
  clear() {
    this.items = []
  }

  /**
   * Returns an array containing all the items in the stack.
   * @returns An array containing all the items in the stack.
   */
  toArray(): T[] {
    return [...this.items]
  }
}

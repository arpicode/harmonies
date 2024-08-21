export default class Stack<T> {
  private stack: T[] = []

  constructor(items: T[] = []) {
    this.stack = items
  }

  /**
   * Adds an item to the stack.
   * @param item - The item to be added.
   */
  push(item: T) {
    this.stack.push(item)
  }

  /**
   * Removes and returns the last item from the stack.
   * @returns The last item in the stack, or undefined if the stack is empty.
   */
  pop(): T | undefined {
    return this.stack.pop()
  }

  /**
   * Returns the last item without removing it.
   * @returns The last item in the stack, or undefined if the stack is empty.
   */
  peek(): T | undefined {
    if (this.isEmpty()) return

    return this.stack[this.stack.length - 1]
  }

  /**
   * Checks if the stack is empty.
   * @returns True if the stack is empty, false otherwise.
   */
  isEmpty(): boolean {
    return this.stack.length === 0
  }

  /**
   * Returns the number of items in the stack.
   * @returns The size of the stack.
   */
  size(): number {
    return this.stack.length
  }

  /**
   * Empties the stack.
   */
  clear() {
    this.stack = []
  }

  /**
   * Returns an array containing all the items in the stack.
   * @returns An array containing all the items in the stack.
   */
  toArray(): T[] {
    return this.stack
  }
}

import Stack from '../Stack'

describe('Stack', () => {
  let stack: Stack<number>

  beforeEach(() => {
    stack = new Stack<number>()
  })

  it('should initialize with an empty stack', () => {
    expect(stack.isEmpty()).toBe(true)
    expect(stack.size()).toBe(0)
  })

  it('should push items onto the stack', () => {
    stack.push(1)
    expect(stack.isEmpty()).toBe(false)
    expect(stack.size()).toBe(1)
    expect(stack.peek()).toBe(1)
  })

  it('should pop items from the stack', () => {
    stack.push(1)
    stack.push(2)
    expect(stack.pop()).toBe(2)
    expect(stack.size()).toBe(1)
    expect(stack.pop()).toBe(1)
    expect(stack.isEmpty()).toBe(true)
  })

  it('should peek the last item without removing it', () => {
    stack.push(1)
    expect(stack.peek()).toBe(1)
    expect(stack.size()).toBe(1)
    stack.push(2)
    expect(stack.peek()).toBe(2)
    expect(stack.size()).toBe(2)
    stack.pop()
    expect(stack.peek()).toBe(1)
    expect(stack.size()).toBe(1)
  })

  it('should check if the stack is empty', () => {
    expect(stack.isEmpty()).toBe(true)
    stack.push(1)
    expect(stack.isEmpty()).toBe(false)
  })

  it('should return the correct size of the stack', () => {
    expect(stack.size()).toBe(0)
    stack.push(1)
    stack.push(2)
    expect(stack.size()).toBe(2)
  })

  it('should clear the stack', () => {
    stack.push(1)
    stack.push(2)
    stack.clear()
    expect(stack.isEmpty()).toBe(true)
    expect(stack.size()).toBe(0)
  })
})

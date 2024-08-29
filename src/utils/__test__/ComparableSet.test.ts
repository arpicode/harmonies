import ComparableSet, { IComparable } from '../ComparableSet'

class MockComparable implements IComparable<MockComparable> {
  constructor(private id: number) {}

  equals(other: MockComparable): boolean {
    return this.id === other.id
  }

  hashCode(): string {
    return this.id.toString()
  }
}

class MockComparableWithCollision implements IComparable<MockComparableWithCollision> {
  constructor(private id: number, private hash: string) {}

  equals(other: MockComparableWithCollision): boolean {
    return this.id === other.id
  }

  hashCode(): string {
    return this.hash
  }
}

describe('ComparableSet', () => {
  let set: ComparableSet<MockComparable>
  let item1: MockComparable
  let item2: MockComparable

  beforeEach(() => {
    set = new ComparableSet<MockComparable>()
    item1 = new MockComparable(1)
    item2 = new MockComparable(2)
  })

  it('should initialize an empty set', () => {
    expect(set.size).toBe(0)
  })

  it('should initialize with an iterable', () => {
    const iterableSet = new ComparableSet<MockComparable>([item1, item2])
    expect(iterableSet.size).toBe(2)
    expect(iterableSet.has(item1)).toBe(true)
    expect(iterableSet.has(item2)).toBe(true)
  })

  it('should add an element to the set', () => {
    set.add(item1)
    expect(set.size).toBe(1)
    expect(set.has(item1)).toBe(true)
  })

  it('should not add duplicate elements', () => {
    set.add(item1)
    set.add(item1)
    expect(set.size).toBe(1)
  })

  it('should add multiple elements', () => {
    set.addMany([item1, item2])
    expect(set.size).toBe(2)
    expect(set.has(item1)).toBe(true)
    expect(set.has(item2)).toBe(true)
  })

  it('should check if an element exists', () => {
    set.add(item1)
    expect(set.has(item1)).toBe(true)
    expect(set.has(item2)).toBe(false)
  })

  it('should delete an element', () => {
    set.add(item1)
    expect(set.delete(item1)).toBe(true)
    expect(set.size).toBe(0)
    expect(set.has(item1)).toBe(false)
  })

  it('should not delete a non-existent element', () => {
    expect(set.delete(item1)).toBe(false)
  })

  it('should clear all elements', () => {
    set.addMany([item1, item2])
    set.clear()
    expect(set.size).toBe(0)
    expect(set.has(item1)).toBe(false)
    expect(set.has(item2)).toBe(false)
  })

  it('should return the correct size', () => {
    expect(set.size).toBe(0)
    set.add(item1)
    expect(set.size).toBe(1)
  })

  it('should be iterable', () => {
    set.addMany([item1, item2])
    const items = Array.from(set)
    expect(items).toContain(item1)
    expect(items).toContain(item2)
  })

  it('should support for...of loops', () => {
    set.addMany([item1, item2])
    const items: MockComparable[] = []

    for (const item of set) {
      items.push(item)
    }

    expect(items).toContain(item1)
    expect(items).toContain(item2)
  })

  it('should handle different but equal objects correctly', () => {
    const item1Copy = new MockComparable(1)
    set.add(item1)
    set.add(item1Copy)
    expect(set.size).toBe(1)
    expect(set.has(item1)).toBe(true)
    expect(set.has(item1Copy)).toBe(true)
  })

  it('should handle hash collisions correctly', () => {
    const item1Collision = new MockComparableWithCollision(1, 'hash')
    const item2Collision = new MockComparableWithCollision(2, 'hash')
    const collisionSet = new ComparableSet<MockComparableWithCollision>()
    collisionSet.add(item1Collision)
    collisionSet.add(item2Collision)
    expect(collisionSet.size).toBe(2)
    expect(collisionSet.has(item1Collision)).toBe(true)
    expect(collisionSet.has(item2Collision)).toBe(true)
  })
})

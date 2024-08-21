import Bag from '../Bag'

describe('Bag', () => {
  let bag: Bag<number>

  beforeEach(() => {
    bag = new Bag<number>()
  })

  it('should add items to the bag', () => {
    bag.add(1)
    expect(bag.size()).toBe(1)
    bag.add(2)
    expect(bag.size()).toBe(2)
  })

  it('should check if the bag is empty', () => {
    expect(bag.isEmpty()).toBe(true)
    bag.add(1)
    expect(bag.isEmpty()).toBe(false)
  })

  it('should draw items from the bag', () => {
    bag.add(1)
    bag.add(2)
    bag.add(3)
    const drawnItems = bag.draw(2)
    expect(drawnItems).toEqual([1, 2])
    expect(bag.size()).toBe(1)
  })

  it('should throw an error when drawing more items than available', () => {
    bag.add(1)
    expect(() => bag.draw(2)).toThrow('Cannot draw more items than there are in the bag')
  })

  it('should shuffle the items in the bag', () => {
    const bag = new Bag<number>()
    const items = Array.from({ length: 10 }, (_, i) => i + 1)
    items.forEach((item) => bag.add(item))

    const initialOrder = [...bag.items]

    const attempts = 10
    let isShuffled = false
    for (let i = 0; i < attempts; i++) {
      bag.shuffle()

      const shuffledOrder = [...bag.items]

      expect(shuffledOrder).toHaveLength(initialOrder.length)
      expect(new Set(shuffledOrder)).toEqual(new Set(initialOrder))

      if (shuffledOrder.toString() !== initialOrder.toString()) {
        isShuffled = true
        break
      }
    }

    if (!isShuffled) {
      console.warn(`The bag was not shuffled after ${attempts} attempts, this is likely a false negative`)
    }

    expect(isShuffled).toBe(true)
  })

  it('should return the correct count of items in the bag', () => {
    expect(bag.size()).toBe(0)
    bag.add(1)
    expect(bag.size()).toBe(1)
    bag.add(2)
    expect(bag.size()).toBe(2)
  })

  it('should clear the bag', () => {
    bag.add(1)
    bag.add(2)
    bag.clear()
    expect(bag.size()).toBe(0)
  })

  it('should return the items in the bag as a string', () => {
    bag.add(1)
    bag.add(2)
    expect(bag.toString()).toBe('1,2')
  })
})

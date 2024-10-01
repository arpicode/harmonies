import AnimalCard, { IAnimalCards } from '../AnimalCard'
import AnimalCardDeck from '../AnimalCardDeck'
import animalsJson from '../../animals.json'

const animals = animalsJson as IAnimalCards

describe('AnimalCardDeck', () => {
  let deck: AnimalCardDeck
  const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(vi.fn())

  beforeEach(() => {
    deck = new AnimalCardDeck(animals)
  })

  afterEach(() => {
    consoleLogSpy.mockClear()
  })

  it('should initialize the deck with animal cards', () => {
    expect(deck.size()).toBe(Object.keys(animals).length - deck.drawnCards.length)
    console.log(deck.size())
  })

  it('should draw an animal card from the deck', () => {
    const initialSize = deck.size()
    deck.drawnCards.splice(0, deck.drawnCards.length) // remove all cards from the drawn cards array
    const drawnCard = deck.draw()
    expect(deck.size()).toBe(initialSize - 1)
    expect(deck.drawnCards).toHaveLength(1)
    expect(drawnCard).toBeInstanceOf(AnimalCard)
    expect(consoleLogSpy).not.toHaveBeenCalled()
  })

  it('should not draw a card when the drawn cards array is full', () => {
    const initialSize = deck.size()
    const drawnCardsSize = deck.drawnCards.length
    const drawnCard = deck.draw()
    expect(deck.size()).toBe(initialSize)
    expect(deck.drawnCards).toHaveLength(drawnCardsSize)
    expect(drawnCard).toBeNull()
    expect(consoleLogSpy).toHaveBeenCalledWith('%c[Info] %cNo new card drawn', 'color: #2cc2e8;', 'color: #8ecfe0;')
  })

  it('should remove a drawn card by name', () => {
    const cardName = deck.drawnCards[0].name
    const initialDrawnCardsSize = deck.drawnCards.length
    const removedCard = deck.removeDrawnCardByName(cardName)
    expect(deck.drawnCards).toHaveLength(initialDrawnCardsSize - 1)
    expect(removedCard.name).toBe(cardName)
  })

  it('should throw an error when removing a card by name that is not in the drawn cards', () => {
    expect(() => deck.removeDrawnCardByName('non-existing')).toThrow('Card name non-existing not found')
  })

  it('should throw an error when drawing from an empty deck', () => {
    deck.clear()
    expect(() => deck.draw()).toThrow('Deck is empty')
  })

  it('should shuffle the deck', () => {
    const initialOrder = deck.toArray()

    const attempts = 10
    let isShuffled = false
    for (let i = 0; i < attempts; i++) {
      deck.shuffle()

      const shuffledOrder = deck.toArray()

      expect(shuffledOrder).toHaveLength(initialOrder.length)
      expect(new Set(shuffledOrder)).toEqual(new Set(initialOrder))

      if (JSON.stringify(shuffledOrder) !== JSON.stringify(initialOrder)) {
        isShuffled = true
        break
      }
    }
    deck.shuffle()
    expect(isShuffled).toBe(true)
  })
})

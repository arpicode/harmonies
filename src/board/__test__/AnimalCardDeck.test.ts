import AnimalCard, { IAnimalCards } from '../AnimalCard'
import AnimalCardDeck from '../AnimalCardDeck'
import animalsJson from '../../animals.json'

const animals = animalsJson as IAnimalCards

describe('AnimalCardDeck', () => {
  let deck: AnimalCardDeck

  beforeEach(() => {
    deck = new AnimalCardDeck(animals)
  })

  it('should initialize the deck with animal cards', () => {
    expect(deck.size()).toBeGreaterThan(0)
  })

  it('should draw an animal card from the deck', () => {
    const initialSize = deck.size()
    const drawnCardsSize = deck.drawnCards.length
    deck.draw()
    expect(deck.size()).toBe(initialSize - 1)
    expect(deck.drawnCards).toHaveLength(drawnCardsSize + 1)
    expect(deck.drawnCards[deck.drawnCards.length - 1]).toBeInstanceOf(AnimalCard)
  })

  it('should remove a drawn card by name', () => {
    const cardName = deck.drawnCards[0].name
    const initialDrawnCardsSize = deck.drawnCards.length
    const removedCard = deck.removeDrawnCardByName(cardName)
    expect(deck.drawnCards).toHaveLength(initialDrawnCardsSize - 1)
    expect(removedCard.name).toBe(cardName)
  })

  it('should throw an error when removing a card by name that is not in the drawn cards', () => {
    expect(() => deck.removeDrawnCardByName('non-existing')).toThrow('Card name not found')
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

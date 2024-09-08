import Stack from '../utils/Stack'
import Animal, { IAnimalCards } from './Animal'

export default class AnimalCardDeck extends Stack<Animal> {
  public static readonly MAX_DRAWN_CARDS = 5
  public readonly drawnCards: Animal[] = []
  private timestampGenerator: Generator<number, void>

  constructor(json: IAnimalCards) {
    super()
    this.timestampGenerator = this.createTimestampGenerator()
    this._initialize(json)
  }

  private _initialize(json: IAnimalCards) {
    Object.keys(json).forEach((key) => {
      const animal = new Animal(json[key])
      this.push(animal)
    })
    this.shuffle()
    for (let i = 0; i < AnimalCardDeck.MAX_DRAWN_CARDS; i++) {
      this.draw()
    }
  }

  private *createTimestampGenerator(): Generator<number, void> {
    let counter = 0
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    while (true) {
      /* Needed to keep the generator running */
      yield Date.now() + counter++
    }
  }

  draw(): void {
    if (this.isEmpty()) throw new Error('Deck is empty')
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const drawnCard = this.pop()! // we know it's not empty
    const newTimestamp = this.timestampGenerator.next().value
    if (newTimestamp) {
      drawnCard.timestamp = newTimestamp
      this.drawnCards.push(drawnCard)
    }
  }

  shuffle() {
    for (let i = this.items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[this.items[i], this.items[j]] = [this.items[j], this.items[i]]
    }
  }

  removeDrawnCardByName(name: string): Animal {
    const index = this.drawnCards.findIndex((card) => card.name === name)
    const removedCard = this.drawnCards.splice(index, 1)[0]
    return removedCard
  }
}

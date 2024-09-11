import AnimalCard from './AnimalCard'

export default class PickedCardsHolder {
  public static readonly MAX_PICKED_CARDS = 4
  public readonly pickedCards: AnimalCard[] = []
  public readonly completedCards: AnimalCard[] = []

  public add(card: AnimalCard): boolean {
    if (!this.isFull) {
      this.pickedCards.push(card)
      return true
    }
    return false
  }

  public removeAnimalToken(cardName: string): void {
    this.pickedCards.forEach((card) => {
      if (card.name === cardName) {
        card.removeAnimalToken()
      }
    })
  }

  public transferCompletedCards(): void {
    this.pickedCards.forEach((card) => {
      if (card.isCompleted()) {
        this.completedCards.push(card)
        this.pickedCards.splice(this.pickedCards.indexOf(card), 1)
      }
    })
  }

  get isFull(): boolean {
    return this.pickedCards.length >= PickedCardsHolder.MAX_PICKED_CARDS
  }
}

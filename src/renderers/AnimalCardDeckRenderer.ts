import Animal from '../board/Animal'
import AnimalCardDeck from '../board/AnimalCardDeck'

export default class AnimalCardDeckRenderer {
  private _animalCardDeck: AnimalCardDeck
  constructor(animalCardDeck: AnimalCardDeck) {
    this._animalCardDeck = animalCardDeck
    this._initialize()
  }

  render(): void {
    const animalCardsContainer = document.querySelector('.animal-cards-container')
    if (!animalCardsContainer) throw new Error('Animal cards container not found')
    this._animalCardDeck.drawnCards.forEach((animal) => {
      const cardElement = this._createCardElement(animal)
      cardElement.setAttribute('data-timestamp', `${animal.timestamp}`)
      animalCardsContainer.appendChild(cardElement)
    })
  }

  private _initialize(): void {
    const animalDeckModal = this._getAnimalDeckModal()
    const cardsWrapper = this._createCardsWrapper()
    const animalCardsContainer = this._createAnimalCardsContainer()
    const cardPicker = this._createCardPicker()
    const footer = this._createModalFooter()

    animalDeckModal.appendChild(cardsWrapper)
    cardsWrapper.appendChild(animalCardsContainer)
    cardsWrapper.appendChild(cardPicker)
    animalDeckModal.appendChild(footer)
  }
  private _getAnimalDeckModal(): HTMLDialogElement {
    const animalDeckModal = document.querySelector('.animal-deck-modal')
    if (!animalDeckModal) throw new Error('Animal deck modal not found')
    return animalDeckModal as HTMLDialogElement
  }
  private _createCardsWrapper(): HTMLDivElement {
    const cardsWrapper = document.createElement('div')
    cardsWrapper.classList.add('cards-wrapper')
    return cardsWrapper
  }

  private _createAnimalCardsContainer(): HTMLDivElement {
    const animalCardsContainer = document.createElement('div')
    animalCardsContainer.classList.add('animal-cards-container')
    return animalCardsContainer
  }

  private _createCardElement(animal: Animal): HTMLImageElement {
    const cardElement = document.createElement('img')
    cardElement.classList.add('animal-card')
    cardElement.src = animal.image ?? ''
    cardElement.alt = animal.name
    cardElement.draggable = true
    return cardElement
  }

  private _createCardPicker(): HTMLDivElement {
    const cardPicker = document.createElement('div')
    cardPicker.classList.add('card-picker')
    return cardPicker
  }

  private _createModalFooter(): HTMLElement {
    const footer = document.createElement('footer')

    const confirmPickBtn = document.createElement('button')
    confirmPickBtn.classList.add('confirm-pick-btn')
    confirmPickBtn.disabled = true
    confirmPickBtn.textContent = 'Confirmer'
    footer.appendChild(confirmPickBtn)

    const cancelPickBtn = document.createElement('button')
    cancelPickBtn.classList.add('cancel-pick-btn')
    cancelPickBtn.disabled = true
    cancelPickBtn.textContent = 'Annuler'
    footer.appendChild(cancelPickBtn)

    const closeDeckBtn = document.createElement('button')
    closeDeckBtn.classList.add('close-deck-btn')
    closeDeckBtn.textContent = 'Fermer'
    footer.appendChild(closeDeckBtn)

    return footer
  }
}

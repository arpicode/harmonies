import AnimalCard from '../../board/AnimalCard'
import AnimalCardDeck from '../../board/AnimalCardDeck'
import GameState from '../GameState'
import IRenderer from '../interfaces/IRenderer'

export default class AnimalCardDeckRenderer implements IRenderer {
  private readonly _gameState: GameState
  private _animalCardDeck: AnimalCardDeck

  constructor(gameState: GameState) {
    console.time('[Initialize] AnimalCardDeckRenderer')
    this._gameState = gameState
    this._animalCardDeck = gameState.animalCardDeck
    this._initializeAnimalCardDeckDOM()
    this._gameState.on('animalCardDeckUpdated', () => this.render())
    console.timeEnd('[Initialize] AnimalCardDeckRenderer')
  }

  render(): void {
    console.time('[Render] AnimalCardDeckRenderer')
    const cardsWrapper = document.querySelector('.cards-wrapper')
    if (!cardsWrapper) throw new Error('Animal cards wrapper not found')
    let remainingCards = cardsWrapper.querySelectorAll<HTMLImageElement>('.card-wrapper .animal-card')
    const animalCardNames = Array.from(remainingCards).map((card) => card.alt)
    for (const animal of this._animalCardDeck.drawnCards) {
      if (animalCardNames.includes(animal.name)) continue
      const cardElement = this._createCardElement(animal)
      cardsWrapper.insertBefore(cardElement, cardsWrapper.lastChild)
    }

    // TODO: use proper notification
    const cardPicker = document.querySelector<HTMLDivElement>('.card-picker')
    if (!cardPicker) throw new Error('Card picker not found')
    remainingCards = cardsWrapper.querySelectorAll<HTMLImageElement>('.card-wrapper .animal-card')
    if (remainingCards.length < AnimalCardDeck.MAX_DRAWN_CARDS) {
      cardPicker.style.display = 'none'
    } else {
      cardPicker.style.display = 'grid'
    }
    console.timeEnd('[Render] AnimalCardDeckRenderer')
  }

  private _initializeAnimalCardDeckDOM(): void {
    const animalDeckModal = this._getAnimalDeckModal()
    const cardsWrapper = this._createCardsWrapper()
    const cardPicker = this._createCardPicker()
    const footer = this._createModalFooter()

    animalDeckModal.appendChild(cardsWrapper)
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

  private _createCardWrapper(): HTMLDivElement {
    const cardWrapper = document.createElement('div')
    cardWrapper.classList.add('card-wrapper')
    return cardWrapper
  }

  private _createCardElement(animal: AnimalCard): HTMLDivElement {
    const cardWrapper = this._createCardWrapper()
    const cardElement = document.createElement('img')
    cardElement.classList.add('animal-card')
    cardElement.src = animal.image
    cardElement.alt = animal.name
    cardElement.draggable = true
    cardElement.dataset.timestamp = `${animal.timestamp}`

    cardWrapper.appendChild(cardElement)
    cardWrapper.dataset.wrapperFor = animal.name
    return cardWrapper
  }

  private _createCardPicker(): HTMLDivElement {
    const cardPicker = document.createElement('div')
    cardPicker.classList.add('card-picker')
    return cardPicker
  }

  private _createModalFooter(): HTMLElement {
    const footer = document.createElement('footer')
    footer.classList.add('modal-footer')

    const createButton = (className: string, textContent: string, disabled = false): HTMLButtonElement => {
      const button = document.createElement('button')
      button.classList.add('button', className)
      button.textContent = textContent
      button.disabled = disabled
      return button
    }

    footer.appendChild(createButton('confirm-pick-button', 'Confirmer', true))
    footer.appendChild(createButton('cancel-pick-button', 'Annuler', true))
    footer.appendChild(createButton('close-deck-button', 'Fermer'))

    return footer
  }
}

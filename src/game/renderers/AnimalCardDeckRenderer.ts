import AnimalCard from '../../board/AnimalCard'
import AnimalCardDeck from '../../board/AnimalCardDeck'
import GameState from '../GameState'
import IRenderer from './interfaces/IRenderer'

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
    const animalCardsContainer = document.querySelector('.animal-cards-container')
    if (!animalCardsContainer) throw new Error('Animal cards container not found')
    const animalCardNames = Array.from(animalCardsContainer.querySelectorAll<HTMLImageElement>('.animal-card')).map(
      (card) => card.alt
    )
    for (const animal of this._animalCardDeck.drawnCards) {
      if (animalCardNames.includes(animal.name)) continue
      const cardElement = this._createCardElement(animal)
      cardElement.setAttribute('data-timestamp', `${animal.timestamp}`)
      animalCardsContainer.appendChild(cardElement)
    }
    console.timeEnd('[Render] AnimalCardDeckRenderer')
  }

  private _initializeAnimalCardDeckDOM(): void {
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

  private _createCardElement(animal: AnimalCard): HTMLImageElement {
    const cardElement = document.createElement('img')
    cardElement.classList.add('animal-card')
    cardElement.src = animal.image
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

    const createButton = (className: string, textContent: string, disabled = false): HTMLButtonElement => {
      const button = document.createElement('button')
      button.classList.add(className)
      button.textContent = textContent
      button.disabled = disabled
      return button
    }

    footer.appendChild(createButton('confirm-pick-btn', 'Confirmer', true))
    footer.appendChild(createButton('cancel-pick-btn', 'Annuler', true))
    footer.appendChild(createButton('close-deck-btn', 'Fermer'))

    return footer
  }
}

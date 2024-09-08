import GameState from '../GameState'
import IInputHandler from './interfaces/IInputHandler'

export enum AnimalCardDeckSelectors {
  SHOW_BUTTON = '.show-deck-btn',
  CLOSE_BUTTON = '.animal-deck-modal .close-deck-btn',
  CONFIRM_BUTTON = '.animal-deck-modal .confirm-pick-btn',
  CANCEL_BUTTON = '.animal-deck-modal .cancel-pick-btn',
  CARD_PICKER = '.animal-deck-modal .card-picker',
  PICKED_CARD = '.animal-deck-modal .card-picker .animal-card',
  ANIMAL_DECK_MODAL = '.animal-deck-modal',
  ANIMAL_CARDS_CONTAINER = '.animal-deck-modal .animal-cards-container',
  REMAINING_ANIMAL_CARDS = '.animal-deck-modal .animal-cards-container .animal-card',
  ANIMAL_CARDS = '.animal-deck-modal .animal-card',
  DRAGGING = '.dragging',
  DRAG_OVER = '.drag-over',
}

class DOMSelectorError extends Error {
  constructor(selector: string) {
    super()
    this.name = 'DOMSelectorError'
    this.message = `Element with selector "${selector}" not found`
  }
}

export default class AnimalCardDeckInputHandler implements IInputHandler {
  private readonly _gameState: GameState
  private _animalCards: NodeListOf<HTMLImageElement>
  private readonly _openButton: HTMLButtonElement
  private readonly _closeButton: HTMLButtonElement
  private readonly _confirmButton: HTMLButtonElement
  private readonly _cancelButton: HTMLButtonElement
  private readonly _cardPicker: HTMLDivElement
  private readonly _animalDeckModal: HTMLDialogElement
  private readonly _animalCardsContainer: HTMLDivElement

  constructor(gameState: GameState) {
    this._gameState = gameState
    this._animalCards = document.querySelectorAll(AnimalCardDeckSelectors.ANIMAL_CARDS)
    this._openButton = this._querySelector<HTMLButtonElement>(AnimalCardDeckSelectors.SHOW_BUTTON)
    this._closeButton = this._querySelector<HTMLButtonElement>(AnimalCardDeckSelectors.CLOSE_BUTTON)
    this._confirmButton = this._querySelector<HTMLButtonElement>(AnimalCardDeckSelectors.CONFIRM_BUTTON)
    this._cancelButton = this._querySelector<HTMLButtonElement>(AnimalCardDeckSelectors.CANCEL_BUTTON)
    this._cardPicker = this._querySelector<HTMLDivElement>(AnimalCardDeckSelectors.CARD_PICKER)
    this._animalDeckModal = this._querySelector<HTMLDialogElement>(AnimalCardDeckSelectors.ANIMAL_DECK_MODAL)
    this._animalCardsContainer = this._querySelector<HTMLDivElement>(AnimalCardDeckSelectors.ANIMAL_CARDS_CONTAINER)
  }

  private _querySelector<T extends HTMLElement>(selector: AnimalCardDeckSelectors): T {
    const element = document.querySelector<T>(selector)
    if (!element) throw new DOMSelectorError(selector)
    return element
  }

  initialize() {
    this._animalCards = document.querySelectorAll(AnimalCardDeckSelectors.ANIMAL_CARDS)
    this._bindEvents()
  }

  private _bindEvents() {
    this._openButton.addEventListener('click', this._handleOpenDeck)
    this._closeButton.addEventListener('click', this._handleCloseDeck)
    this._confirmButton.addEventListener('click', this._handleConfirmPick)
    this._cancelButton.addEventListener('click', this._handleCancelPick)

    this._animalCards.forEach((card) => {
      card.addEventListener('dragstart', () => this._handleCardDragStart(card))
      card.addEventListener('dragend', () => this._handleCardDragEnd(card))
    })

    this._cardPicker.addEventListener('dragover', (event) => this._handleCardPickerDragOver(event))
    this._cardPicker.addEventListener('dragenter', this._handleCardPickerDragEnter)
    this._cardPicker.addEventListener('dragleave', this._handleCardPickerDragLeave)
    this._cardPicker.addEventListener('drop', this._handleCardPickerDrop)
  }

  private _handleOpenDeck = () => {
    this._animalDeckModal.showModal()
  }

  private _handleCloseDeck = () => {
    this._animalDeckModal.close()
    this._cancelPick()
  }

  private _handleConfirmPick = () => {
    const pickedCardElement = document.querySelector<HTMLImageElement>(AnimalCardDeckSelectors.PICKED_CARD)
    if (!pickedCardElement) return

    this._cardPicker.classList.remove(AnimalCardDeckSelectors.DRAG_OVER.replace('.', ''))

    if (this._gameState.pickedCardsHolder.isFull) {
      this._cancelPick()
      console.warn('Picked cards holder is full')
      return
    }
    const pickedCard = this._gameState.animalCardDeck.removeDrawnCardByName(pickedCardElement.alt)
    this._gameState.pickedCardsHolder.add(pickedCard)

    pickedCardElement.remove()
    console.log(this._gameState.pickedCardsHolder.pickedCards)
    this._gameState.notifyPickedCardsHolderUpdate()
    this._gameState.notifyAnimalCardDeckUpdate()

    this._animalCards = document.querySelectorAll(AnimalCardDeckSelectors.REMAINING_ANIMAL_CARDS)
    this._updateCardsDraggableState(true)
    this._updateButtonsDisabledState(true)
  }

  private _handleCancelPick = () => {
    this._cancelPick()
  }

  private _handleCardDragStart = (card: HTMLImageElement) => {
    card.classList.add(AnimalCardDeckSelectors.DRAGGING.replace('.', ''))
  }

  private _handleCardDragEnd = (card: HTMLImageElement) => {
    card.classList.remove(AnimalCardDeckSelectors.DRAGGING.replace('.', ''))
  }

  private _handleCardPickerDragOver = (event: DragEvent) => {
    event.preventDefault()
  }

  private _handleCardPickerDragEnter = () => {
    this._cardPicker.classList.add(AnimalCardDeckSelectors.DRAG_OVER.replace('.', ''))
  }

  private _handleCardPickerDragLeave = () => {
    this._cardPicker.classList.remove(AnimalCardDeckSelectors.DRAG_OVER.replace('.', ''))
  }

  private _handleCardPickerDrop = () => {
    const draggedCard = document.querySelector(AnimalCardDeckSelectors.DRAGGING)
    if (!draggedCard) return
    this._cardPicker.appendChild(draggedCard)
    this._updateCardsDraggableState(false)

    this._updateButtonsDisabledState(false)
  }

  private _cancelPick() {
    const pickedCard = document.querySelector<HTMLImageElement>(AnimalCardDeckSelectors.PICKED_CARD)
    if (!pickedCard) return
    this._cardPicker.classList.remove(AnimalCardDeckSelectors.DRAG_OVER.replace('.', ''))
    const sortedCards = this._sortElementsByTimestamp(this._animalCards)
    sortedCards.forEach((card) => {
      card.setAttribute('draggable', 'true')
      this._animalCardsContainer.appendChild(card)
    })

    this._updateButtonsDisabledState(true)
  }

  private _updateButtonsDisabledState(isDisabled: boolean) {
    this._cancelButton.disabled = isDisabled
    this._confirmButton.disabled = isDisabled
  }

  private _updateCardsDraggableState(isDraggable: boolean) {
    this._animalCards.forEach((card) => {
      card.setAttribute('draggable', isDraggable ? 'true' : 'false')
    })
  }

  private _sortElementsByTimestamp(elements: NodeListOf<Element>) {
    return Array.from(elements)
      .map((element) => ({
        element,
        timestamp: parseInt(element.getAttribute('data-timestamp') ?? '0'),
      }))
      .sort((a, b) => a.timestamp - b.timestamp)
      .map((item) => item.element)
  }
}

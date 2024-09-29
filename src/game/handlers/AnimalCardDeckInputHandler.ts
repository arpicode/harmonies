import AnimalCard from '~/board/AnimalCard'
import GameState from '../GameState'
import IInputHandler from '../interfaces/IInputHandler'

export enum AnimalCardDeckSelectors {
  SHOW_BUTTON = '.show-cards-button',
  CLOSE_BUTTON = '.animal-deck-modal .close-deck-button',
  CONFIRM_BUTTON = '.animal-deck-modal .confirm-pick-button',
  CANCEL_BUTTON = '.animal-deck-modal .cancel-pick-button',
  CARD_PICKER = '.animal-deck-modal .card-picker',
  PICKED_CARD = '.animal-deck-modal .card-picker .animal-card',
  ANIMAL_DECK_MODAL = '.animal-deck-modal',
  ANIMAL_CARDS_WRAPPER = '.animal-deck-modal .cards-wrapper',
  REMAINING_ANIMAL_CARDS = '.animal-deck-modal .card-wrapper .animal-card',
  ANIMAL_CARDS = '.animal-deck-modal .animal-card',
  DRAGGING = '.dragging',
  DRAG_OVER = '.drag-over',
  LAST_DRAWN_CARD = '.animal-deck-modal > .card-wrapper:nth-child(5) > .animal-card',
}

class AnimalCardDeckDOMException extends Error {
  constructor(selector: string) {
    super()
    this.name = 'AnimalCardDeckDOMException'
    this.message = `Element with selector "${selector}" not found`
  }
}

export default class AnimalCardDeckInputHandler implements IInputHandler {
  private readonly _gameState: GameState
  private readonly _animalDeckModal: HTMLDialogElement
  private readonly _cardPicker: HTMLDivElement
  private readonly _openButton: HTMLButtonElement
  private readonly _closeButton: HTMLButtonElement
  private readonly _confirmButton: HTMLButtonElement
  private readonly _cancelButton: HTMLButtonElement
  private _animalCards: NodeListOf<HTMLImageElement>

  constructor(gameState: GameState) {
    this._gameState = gameState
    this._animalDeckModal = this._querySelector<HTMLDialogElement>(AnimalCardDeckSelectors.ANIMAL_DECK_MODAL)
    this._cardPicker = this._querySelector<HTMLDivElement>(AnimalCardDeckSelectors.CARD_PICKER)
    this._openButton = this._querySelector<HTMLButtonElement>(AnimalCardDeckSelectors.SHOW_BUTTON)
    this._closeButton = this._querySelector<HTMLButtonElement>(AnimalCardDeckSelectors.CLOSE_BUTTON)
    this._confirmButton = this._querySelector<HTMLButtonElement>(AnimalCardDeckSelectors.CONFIRM_BUTTON)
    this._cancelButton = this._querySelector<HTMLButtonElement>(AnimalCardDeckSelectors.CANCEL_BUTTON)
    this._animalCards = document.querySelectorAll(AnimalCardDeckSelectors.REMAINING_ANIMAL_CARDS)
    this._gameState.on('animalCardDeckDraw', (animalCard: AnimalCard) => this._bindEventsToNewDrawnCard(animalCard))
  }

  private _querySelector<T extends HTMLElement>(selector: AnimalCardDeckSelectors): T {
    const element = document.querySelector<T>(selector)
    if (!element) throw new AnimalCardDeckDOMException(selector)
    return element
  }

  initialize() {
    this._animalCards = document.querySelectorAll(AnimalCardDeckSelectors.REMAINING_ANIMAL_CARDS)
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
    this._gameState.emit('animalDeckOpened')
    this._animalDeckModal.showModal()
  }

  private _handleCloseDeck = () => {
    this._animalDeckModal.close()
    this._cancelPick()
    this._gameState.emit('animalDeckClosed')
  }

  private _handleConfirmPick = () => {
    const pickedCardElement = document.querySelector<HTMLImageElement>(AnimalCardDeckSelectors.PICKED_CARD)
    if (!pickedCardElement) return

    const oldCardWrapper = document.querySelector<HTMLDivElement>(
      `.card-wrapper[data-wrapper-for="${pickedCardElement.alt}"]`
    )
    if (!oldCardWrapper) {
      console.error('%c[InvalidDOM] %cInvalid data-wrapper-for', 'color: #ff4d4f;', 'color: #ff7a45;')
      return
    }

    this._cardPicker.classList.remove(AnimalCardDeckSelectors.DRAG_OVER.replace('.', ''))

    if (this._gameState.pickedCardsHolder.isFull) {
      this._cancelPick()
      console.warn('Picked cards holder is full')
      return
    }
    const pickedCard = this._gameState.animalCardDeck.removeDrawnCardByName(pickedCardElement.alt)
    this._gameState.pickedCardsHolder.add(pickedCard)

    pickedCardElement.remove()
    oldCardWrapper.remove()
    this._animalDeckModal.close()

    this._gameState.emit('animalDeckClosed')
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
    if (draggedCard) {
      this._cardPicker.appendChild(draggedCard)
      this._updateCardsDraggableState(false)
      this._updateButtonsDisabledState(false)
    }
  }

  private _cancelPick() {
    const pickedCard = document.querySelector<HTMLImageElement>(AnimalCardDeckSelectors.PICKED_CARD)
    if (!pickedCard) return

    this._cardPicker.classList.remove(AnimalCardDeckSelectors.DRAG_OVER.replace('.', ''))
    this._updateCardsDraggableState(true)

    const pickedCardName = pickedCard.alt
    const cardWrapper = document.querySelector<HTMLDivElement>(`.card-wrapper[data-wrapper-for="${pickedCardName}"]`)
    if (!cardWrapper) {
      console.error('%c[InvalidDOM] %cInvalid data-wrapper-for', 'color: #ff4d4f;', 'color: #ff7a45;')
      return
    }
    cardWrapper.appendChild(pickedCard)
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

  private _bindEventsToNewDrawnCard(animalCard: AnimalCard) {
    const newCard = document.querySelector<HTMLImageElement>(`[data-wrapper-for="${animalCard.name}"] .animal-card`)
    if (!newCard) {
      console.error('%c[InvalidDOM] %cInvalid data-wrapper-for', 'color: #ff4d4f;', 'color: #ff7a45;')
      return
    }

    newCard.addEventListener('dragstart', () => this._handleCardDragStart(newCard))
    newCard.addEventListener('dragend', () => this._handleCardDragEnd(newCard))
  }
}

import GameState, { RendererEvent } from '../GameState'
import IInputHandler from '../interfaces/IInputHandler'

export enum PickedCardsHolderSelector {
  PICKED_CARDS_HOLDER = '.picked-cards-wrapper',
  CARD_ACTION_BUTTONS = '.picked-cards-wrapper .card-action-button',
}

class PickedCardsHolderDOMException extends Error {
  constructor(selector: string) {
    super()
    this.name = 'PickedCardsHolderDOMException'
    this.message = `Element with selector "${selector}" not found`
  }
}

export default class PickedCardsHolderInputHandler implements IInputHandler {
  private readonly _gameState: GameState
  private readonly _pickedCardsHolder: HTMLDivElement
  private _cardActionButtons: NodeListOf<HTMLButtonElement>

  constructor(gameState: GameState) {
    this._gameState = gameState
    this._pickedCardsHolder = this._querySelector<HTMLDivElement>(PickedCardsHolderSelector.PICKED_CARDS_HOLDER)
    this._cardActionButtons = document.querySelectorAll(PickedCardsHolderSelector.CARD_ACTION_BUTTONS)
  }

  private _querySelector<T extends HTMLElement>(selector: PickedCardsHolderSelector): T {
    const element = document.querySelector<T>(selector)
    if (!element) throw new PickedCardsHolderDOMException(selector)
    return element
  }

  initialize() {
    this._bindEvents()
  }

  private _bindEvents() {
    this._pickedCardsHolder.addEventListener('click', this._handlePlaceCardAction)
  }

  private _handlePlaceCardAction = (event: Event) => {
    const target = event.target as HTMLButtonElement
    const targetCardName = target.getAttribute('data-button-for')

    if (targetCardName) {
      const animalCard = this._gameState.pickedCardsHolder.pickedCards.find((card) => card.name === targetCardName)
      if (!animalCard) {
        console.error('%c[InvalidDOM] %cInvalid data-button-for', 'color: #ff4d4f;', 'color: #ff7a45;')
        return
      }

      if (this._hasCancelStateButtons()) {
        if (target.getAttribute('data-state') === 'cancel') {
          this._gameState.emit(RendererEvent.PLACE_ANIMAL_CANCEL, animalCard)
        }
        return
      }

      const spawnHexes = this._gameState.hexBoard.findSpawnHexFromMatchingPatterns(animalCard.pattern)
      if (spawnHexes.length === 0) {
        console.log('%c[Info] %cNo animal spawn hexes found', 'color: #2cc2e8;', 'color: #8ecfe0;')
        return
      }

      this._gameState.emit(RendererEvent.PLACE_ANIMAL_START, animalCard, spawnHexes)
    }
  }

  private _hasCancelStateButtons() {
    this._cardActionButtons = document.querySelectorAll(PickedCardsHolderSelector.CARD_ACTION_BUTTONS)
    return Array.from(this._cardActionButtons).some((btn) => btn.getAttribute('data-state') === 'cancel')
  }
}

import GameState from '../GameState'
import IInputHandler from '../interfaces/IInputHandler'

export enum GameSelectors {
  GAME_WRAPPER = '.game-wrapper',
  END_TURN_BUTTON = '.end-turn-button',
}

class EndTurnButtonDOMException extends Error {
  constructor(selector: string) {
    super()
    this.name = 'EndTurnButtonDOMException'
    this.message = `Element with selector "${selector}" not found`
  }
}

export default class EndTurnButtonInputHandler implements IInputHandler {
  private readonly _gameState: GameState
  private readonly _endTurnButton: HTMLButtonElement

  constructor(gameState: GameState) {
    this._gameState = gameState
    this._endTurnButton = this._querySelector<HTMLButtonElement>(GameSelectors.END_TURN_BUTTON)
  }

  private _querySelector<T extends HTMLElement>(selector: GameSelectors): T {
    const element = document.querySelector<T>(selector)
    if (!element) throw new EndTurnButtonDOMException(selector)
    return element
  }

  public initialize() {
    this._bindEvents()
  }

  private _bindEvents() {
    this._endTurnButton.addEventListener('click', this._handleEndTurn)
  }

  private _handleEndTurn = () => {
    if (this._gameState.isGameOver()) {
      console.log('Game over')
      this._gameState.endTurnButton.disabled = true
      // TODO: notify game over
      this._gameState.notifyEndTurnButtonUpdated()
      return
    }
    if (this._gameState.gameMode === 'solo') this._gameState.draftTable.clear()
    this._gameState.draftTable.refill()
    this._gameState.notifyDraftTableUpdate()

    const drawnCard = this._gameState.animalCardDeck.draw()
    if (drawnCard !== null) {
      console.log(
        `%c[Info] %cNew card drawn: %c${drawnCard.name}`,
        'color: #2cc2e8;',
        'color: #8ecfe0;',
        'color: #8ecfe0;font-weight: bold;'
      )
      this._gameState.notifyAnimalCardDeckUpdate()
      this._gameState.notifyAnimalCardDeckDraw(drawnCard)
    }

    this._gameState.endTurnButton.disabled = true
    this._gameState.notifyEndTurnButtonUpdated()
  }
}

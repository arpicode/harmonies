import EndTurnButton from '~/board/EndTurnButton'
import GameState, { RendererEvent } from '../GameState'
import IRenderer from '../interfaces/IRenderer'

export default class EndTurnButtonRenderer implements IRenderer {
  private readonly _gameState: GameState
  private readonly _endTurnButton: EndTurnButton

  constructor(gameState: GameState) {
    console.time('[Initialize] EndTurnButton')
    this._gameState = gameState
    this._endTurnButton = gameState.endTurnButton
    this._initializeEndTurnButtonDOM()
    this._gameState.on(RendererEvent.END_TURN_BUTTON_UPDATED, () => this.render())
    console.timeEnd('[Initialize] EndTurnButton')
  }

  render(): void {
    console.time('[Render] EndTurnButton')
    const endTurnButtonElement = document.querySelector<HTMLButtonElement>('.end-turn-button')
    if (!endTurnButtonElement) throw new Error('End turn button not found')
    endTurnButtonElement.innerHTML = this._endTurnButton.text
    endTurnButtonElement.disabled = this._endTurnButton.disabled
    console.timeEnd('[Render] EndTurnButton')
  }

  private _initializeEndTurnButtonDOM() {
    const endTurnButtonWrapper = document.querySelector<HTMLButtonElement>('.button-menu')
    if (!endTurnButtonWrapper) throw new Error('End turn button wrapper not found')
    const endTurnButtonElement = this._createEndTurnButtonElement(this._endTurnButton)
    endTurnButtonWrapper.appendChild(endTurnButtonElement)
  }

  private _createEndTurnButtonElement(button: EndTurnButton): HTMLButtonElement {
    const buttonElement = document.createElement('button')
    buttonElement.classList.add('button', 'end-turn-button')
    buttonElement.innerHTML = button.text
    return buttonElement
  }
}

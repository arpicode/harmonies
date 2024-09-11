import GameState from '../GameState'
import IInputHandler from './interfaces/IInputHandler'

export default class DraftTableInputHandler implements IInputHandler {
  private _gameState: GameState

  constructor(gameState: GameState) {
    this._gameState = gameState
  }

  initialize() {
    const draftTable = document.querySelector('#draft-table')
    if (!draftTable) throw new Error('Draft table not found')
    this._bindEvents(draftTable as SVGElement)
  }

  private _bindEvents(draftTable: SVGElement) {
    draftTable.addEventListener('click', (event) => this._handleClick(event))
  }

  private _handleClick(event: Event) {
    const target = event.target as SVGElement
    if (!target.classList.contains('draft-table-slot')) return
    if (this._gameState.draftTable.draftedTokens.size() !== 0) {
      console.log('Tokens already picked up')
      return
    }

    const parent = target.parentElement
    const dataSlotIndex = target.getAttribute('data-slot-index')
    if (!dataSlotIndex) {
      console.error('No slot index')
      return
    }
    const slotIndex = parseInt(dataSlotIndex, 10)
    const slotTokens = parent?.querySelector(`[data-slot-tokens-index="${slotIndex}"]`)
    if (!slotTokens) {
      console.error(`No slot index ${slotIndex}`)
      return
    }
    slotTokens.innerHTML = ''
    this._gameState.draftTable.pickUp(slotIndex)
    this._gameState.notifyDraftTableUpdate()
    this._bindEventsToTokensInTokenHolder()
  }

  private _bindEventsToTokensInTokenHolder() {
    const tokens = document.querySelectorAll('.token-holder-slot')
    tokens.forEach((token) => {
      token.addEventListener('dragstart', () => {
        token.classList.add('dragging')
      })
      token.addEventListener('dragend', () => {
        token.classList.remove('dragging')
      })
    })
  }
}

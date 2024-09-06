import { HexBoardType } from '../board/HexBoard'
import { initializeAnimalCards } from '../main-utils'
import GameRenderer from './renderers/GameRenderer'
import GameState from './GameState'
import InputHandler from './handlers/InputHandler'

export type GameMode = 'solo' | 'multiplayer'

export default class Game {
  private _gameState: GameState
  private _gameRenderer: GameRenderer
  private _inputHandler: InputHandler

  constructor(gameMode: GameMode, hexBoardType: HexBoardType) {
    this._gameState = new GameState(gameMode, hexBoardType)
    this._gameRenderer = new GameRenderer(this._gameState)
    this._inputHandler = new InputHandler(this._gameState)

    this._gameRenderer.render()
    initializeAnimalCards(this._gameState.hexBoard)
    this._inputHandler.initialize()
  }

  get gameState(): GameState {
    return this._gameState
  }
}

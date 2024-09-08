import { HexBoardType } from '../board/HexBoard'
import GameRenderer from './renderers/GameRenderer'
import GameState from './GameState'
import GameInputHandler from './handlers/GameInputHandler'

export type GameMode = 'solo' | 'multiplayer'

export default class Game {
  private _gameState: GameState
  private _gameRenderer: GameRenderer
  private _inputHandler: GameInputHandler

  constructor(gameMode: GameMode, hexBoardType: HexBoardType) {
    this._gameState = new GameState(gameMode, hexBoardType)
    this._gameRenderer = new GameRenderer(this._gameState)
    this._inputHandler = new GameInputHandler(this._gameState)

    this._gameRenderer.render()
    this._inputHandler.initialize()
  }

  get gameState(): GameState {
    return this._gameState
  }
}

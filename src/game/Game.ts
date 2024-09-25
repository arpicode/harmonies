import { HexBoardType } from '../board/HexBoard'
import IRenderer from './interfaces/IRenderer'
import IInputHandler from './interfaces/IInputHandler'
import GameRenderer from './GameRenderer'
import GameState from './GameState'
import GameInputHandler from './GameInputHandler'

export type GameMode = 'solo' | 'multiplayer'

export default class Game {
  private _gameState: GameState
  private _gameRenderer: IRenderer
  private _inputHandler: IInputHandler

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

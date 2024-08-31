import { HexBoardType } from '../board/HexBoard'
import { initializeAnimalCards } from '../main-utils'
import GameRenderer from './GameRenderer'
import GameState from './GameState'

export type GameMode = 'solo' | 'multiplayer'

export default class Game {
  private _gameState: GameState
  private _gameRenderer: GameRenderer

  constructor(gameMode: GameMode, hexBoardType: HexBoardType) {
    this._gameState = new GameState(gameMode, hexBoardType)
    this._gameRenderer = new GameRenderer(this._gameState)
    this._gameRenderer.render()
    initializeAnimalCards(this._gameState.hexBoard)
  }

  get gameState(): GameState {
    return this._gameState
  }
}

import { HexBoardType } from '../board/HexBoard'
import IRenderer from './interfaces/IRenderer'
import IInputHandler from './interfaces/IInputHandler'
import GameRenderer from './GameRenderer'
import GameState from './GameState'
import GameInputHandler from './GameInputHandler'
import HexBoardRenderer from './renderers/HexBoardRenderer'
import DraftTableRenderer from './renderers/DraftTableRenderer'
import AnimalCardDeckRenderer from './renderers/AnimalCardDeckRenderer'
import PickedCardsHolderRenderer from './renderers/PickedCardsHolderRenderer'
import ScoreBoardRenderer from './renderers/ScoreBoardRenderer'
import EndTurnButtonRenderer from './renderers/EndTurnButtonRenderer'
import HexBoardInputHandler from './handlers/HexBoardInputHandler'
import DraftTableInputHandler from './handlers/DraftTableInputHandler'
import AnimalCardDeckInputHandler from './handlers/AnimalCardDeckInputHandler'
import PickedCardsHolderInputHandler from './handlers/PickedCardsHolderInputHandler'
import ScoreBoardInputHandler from './handlers/ScoreBoardInputHandler'
import EndTurnButtonInputHandler from './handlers/EndTurnButtonInputHandler'

export type GameMode = 'solo' | 'multiplayer'

export default class Game {
  private _gameState: GameState
  private _gameRenderer: IRenderer
  private _inputHandler: IInputHandler

  constructor(gameMode: GameMode, hexBoardType: HexBoardType) {
    this._gameState = new GameState(gameMode, hexBoardType)

    const gameRenderers: IRenderer[] = [
      new HexBoardRenderer(this._gameState),
      new DraftTableRenderer(this._gameState),
      new AnimalCardDeckRenderer(this._gameState),
      new PickedCardsHolderRenderer(this._gameState),
      new ScoreBoardRenderer(this._gameState),
      new EndTurnButtonRenderer(this._gameState),
    ]

    const gameInputHandlers: IInputHandler[] = [
      new HexBoardInputHandler(this._gameState),
      new DraftTableInputHandler(this._gameState),
      new AnimalCardDeckInputHandler(this._gameState),
      new PickedCardsHolderInputHandler(this._gameState),
      new ScoreBoardInputHandler(),
      new EndTurnButtonInputHandler(this._gameState),
    ]

    this._gameRenderer = new GameRenderer(gameRenderers)
    this._inputHandler = new GameInputHandler(gameInputHandlers)

    this._gameRenderer.render()
    this._inputHandler.initialize()
  }

  get gameState(): GameState {
    return this._gameState
  }
}

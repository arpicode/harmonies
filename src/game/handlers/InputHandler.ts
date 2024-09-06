import DraftTableInputHandler from './DraftTableInputHandler'
import GameState from '../GameState'
import HexBoardInputHandler from './HexBoardInputHandler'
import IInputHandler from './interfaces/IInputHandler'

export default class InputHandler implements IInputHandler {
  private readonly _draftTableInputHandler: DraftTableInputHandler
  private readonly _hexBoardInputHandler: HexBoardInputHandler

  constructor(gameState: GameState) {
    this._draftTableInputHandler = new DraftTableInputHandler(gameState)
    this._hexBoardInputHandler = new HexBoardInputHandler(gameState)
  }

  // Initialize event listeners
  initialize() {
    this._draftTableInputHandler.initialize()
    this._hexBoardInputHandler.initialize()
  }
}

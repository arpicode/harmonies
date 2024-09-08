import DraftTableInputHandler from './DraftTableInputHandler'
import GameState from '../GameState'
import HexBoardInputHandler from './HexBoardInputHandler'
import IInputHandler from './interfaces/IInputHandler'
import AnimalCardDeckInputHandler from './AnimalCardDeckInputHandler'

export default class GameInputHandler implements IInputHandler {
  private readonly _draftTableInputHandler: DraftTableInputHandler
  private readonly _hexBoardInputHandler: HexBoardInputHandler
  private readonly _animalCardDeckInputHandler: AnimalCardDeckInputHandler

  constructor(gameState: GameState) {
    this._draftTableInputHandler = new DraftTableInputHandler(gameState)
    this._hexBoardInputHandler = new HexBoardInputHandler(gameState)
    this._animalCardDeckInputHandler = new AnimalCardDeckInputHandler(gameState)
  }

  // Initialize event listeners
  initialize() {
    this._draftTableInputHandler.initialize()
    this._hexBoardInputHandler.initialize()
    this._animalCardDeckInputHandler.initialize()
  }
}

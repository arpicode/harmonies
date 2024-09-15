import DraftTableInputHandler from './DraftTableInputHandler'
import GameState from '../GameState'
import HexBoardInputHandler from './HexBoardInputHandler'
import IInputHandler from './interfaces/IInputHandler'
import AnimalCardDeckInputHandler from './AnimalCardDeckInputHandler'
import PickedCardsHolderInputHandler from './PickedCardsHolderInputHandler'

export default class GameInputHandler implements IInputHandler {
  private readonly _draftTableInputHandler: IInputHandler
  private readonly _hexBoardInputHandler: IInputHandler
  private readonly _animalCardDeckInputHandler: IInputHandler
  private readonly _pickedCardsHolderInputHandler: IInputHandler

  constructor(gameState: GameState) {
    this._draftTableInputHandler = new DraftTableInputHandler(gameState)
    this._hexBoardInputHandler = new HexBoardInputHandler(gameState)
    this._animalCardDeckInputHandler = new AnimalCardDeckInputHandler(gameState)
    this._pickedCardsHolderInputHandler = new PickedCardsHolderInputHandler(gameState)
  }

  // Initialize event listeners
  initialize() {
    this._draftTableInputHandler.initialize()
    this._hexBoardInputHandler.initialize()
    this._animalCardDeckInputHandler.initialize()
    this._pickedCardsHolderInputHandler.initialize()
    document.addEventListener('contextmenu', (event) => {
      if (event.target instanceof HTMLImageElement || event.target instanceof SVGElement) event.preventDefault()
    })
  }
}

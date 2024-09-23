import DraftTableInputHandler from './DraftTableInputHandler'
import GameState from '../GameState'
import HexBoardInputHandler from './HexBoardInputHandler'
import IInputHandler from './interfaces/IInputHandler'
import AnimalCardDeckInputHandler from './AnimalCardDeckInputHandler'
import PickedCardsHolderInputHandler from './PickedCardsHolderInputHandler'
import ScoreBoardInputHandler from './ScoreBoardInputHanlder'

export default class GameInputHandler implements IInputHandler {
  private readonly _draftTableInputHandler: IInputHandler
  private readonly _hexBoardInputHandler: IInputHandler
  private readonly _animalCardDeckInputHandler: IInputHandler
  private readonly _pickedCardsHolderInputHandler: IInputHandler
  private readonly _scoreBoardInputHandler: IInputHandler

  constructor(gameState: GameState) {
    this._draftTableInputHandler = new DraftTableInputHandler(gameState)
    this._hexBoardInputHandler = new HexBoardInputHandler(gameState)
    this._animalCardDeckInputHandler = new AnimalCardDeckInputHandler(gameState)
    this._pickedCardsHolderInputHandler = new PickedCardsHolderInputHandler(gameState)
    this._scoreBoardInputHandler = new ScoreBoardInputHandler()
  }

  // Initialize event listeners
  initialize() {
    this._draftTableInputHandler.initialize()
    this._hexBoardInputHandler.initialize()
    this._animalCardDeckInputHandler.initialize()
    this._pickedCardsHolderInputHandler.initialize()
    this._scoreBoardInputHandler.initialize()
    /* c8 ignore start */
    document.addEventListener('contextmenu', (event) => {
      if (event.target instanceof HTMLImageElement || event.target instanceof SVGElement) event.preventDefault()
    })
    /* c8 ignore end */
  }
}

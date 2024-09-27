import DraftTableInputHandler from './handlers/DraftTableInputHandler'
import GameState from './GameState'
import HexBoardInputHandler from './handlers/HexBoardInputHandler'
import IInputHandler from './interfaces/IInputHandler'
import AnimalCardDeckInputHandler from './handlers/AnimalCardDeckInputHandler'
import PickedCardsHolderInputHandler from './handlers/PickedCardsHolderInputHandler'
import ScoreBoardInputHandler from './handlers/ScoreBoardInputHanlder'
import EndTurnButtonInputHandler from './handlers/EndTurnButtonInputHandler'

export default class GameInputHandler implements IInputHandler {
  private readonly _draftTableInputHandler: IInputHandler
  private readonly _hexBoardInputHandler: IInputHandler
  private readonly _animalCardDeckInputHandler: IInputHandler
  private readonly _pickedCardsHolderInputHandler: IInputHandler
  private readonly _scoreBoardInputHandler: IInputHandler
  private readonly _endTurnButtonInputHandler: IInputHandler

  constructor(gameState: GameState) {
    this._draftTableInputHandler = new DraftTableInputHandler(gameState)
    this._hexBoardInputHandler = new HexBoardInputHandler(gameState)
    this._animalCardDeckInputHandler = new AnimalCardDeckInputHandler(gameState)
    this._pickedCardsHolderInputHandler = new PickedCardsHolderInputHandler(gameState)
    this._scoreBoardInputHandler = new ScoreBoardInputHandler()
    this._endTurnButtonInputHandler = new EndTurnButtonInputHandler(gameState)
  }

  initialize() {
    this._draftTableInputHandler.initialize()
    this._hexBoardInputHandler.initialize()
    this._animalCardDeckInputHandler.initialize()
    this._pickedCardsHolderInputHandler.initialize()
    this._scoreBoardInputHandler.initialize()
    this._endTurnButtonInputHandler.initialize()
    /* c8 ignore start */
    document.addEventListener('contextmenu', (event) => {
      if (event.target instanceof HTMLImageElement || event.target instanceof SVGElement) event.preventDefault()
    })
    /* c8 ignore end */
  }
}

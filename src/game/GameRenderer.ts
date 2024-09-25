import AnimalCardDeckRenderer from './renderers/AnimalCardDeckRenderer'
import DraftTableRenderer from './renderers/DraftTableRenderer'
import HexBoardRenderer from './renderers/HexBoardRenderer'
import IRenderer from './interfaces/IRenderer'
import GameState from './GameState'
import PickedCardsHolderRenderer from './renderers/PickedCardsHolderRenderer'
import ScoreBoardRenderer from './renderers/ScoreBoardRenderer'

export default class GameRenderer implements IRenderer {
  private readonly _hexBoardRenderer: IRenderer
  private readonly _draftTableRenderer: IRenderer
  private readonly _animalCardDeckRenderer: IRenderer
  private readonly _pickedCardsHolderRenderer: IRenderer
  private readonly _scoreBoardRenderer: IRenderer

  constructor(gameState: GameState) {
    this._hexBoardRenderer = new HexBoardRenderer(gameState)
    this._draftTableRenderer = new DraftTableRenderer(gameState)
    this._animalCardDeckRenderer = new AnimalCardDeckRenderer(gameState)
    this._pickedCardsHolderRenderer = new PickedCardsHolderRenderer(gameState)
    this._scoreBoardRenderer = new ScoreBoardRenderer(gameState)
  }

  render() {
    this._hexBoardRenderer.render()
    this._draftTableRenderer.render()
    this._animalCardDeckRenderer.render()
    this._pickedCardsHolderRenderer.render()
    this._scoreBoardRenderer.render()
  }
}

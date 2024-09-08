import AnimalCardDeckRenderer from './AnimalCardDeckRenderer'
import DraftTableRenderer from './DraftTableRenderer'
import HexBoardRenderer from './HexBoardRenderer'
import IRenderer from './interfaces/IRenderer'
import GameState from '../GameState'
import PickedCardsHolderRenderer from './PickedCardsHolderRenderer'

export default class GameRenderer implements IRenderer {
  private readonly _hexBoardRenderer: HexBoardRenderer
  private readonly _draftTableRenderer: DraftTableRenderer
  private readonly _animalCardDeckRenderer: AnimalCardDeckRenderer
  private readonly _pickedCardsHolderRenderer: PickedCardsHolderRenderer

  constructor(gameState: GameState) {
    this._hexBoardRenderer = new HexBoardRenderer(gameState)
    this._draftTableRenderer = new DraftTableRenderer(gameState)
    this._animalCardDeckRenderer = new AnimalCardDeckRenderer(gameState)
    this._pickedCardsHolderRenderer = new PickedCardsHolderRenderer(gameState)
  }

  render() {
    this._hexBoardRenderer.render()
    this._draftTableRenderer.render()
    this._animalCardDeckRenderer.render()
    this._pickedCardsHolderRenderer.render()
  }
}

import ScoreBoard from '../board/ScoreBoard'
import AnimalCardDeckRenderer from '../renderers/AnimalCardDeckRenderer'
import DraftTableRenderer from '../renderers/DraftTableRenderer'
import HexBoardRenderer from '../renderers/HexBoardRenderer'
import GameState from './GameState'

export default class GameRenderer {
  private readonly _gameState: GameState
  private readonly _hexBoardRenderer: HexBoardRenderer
  private readonly _draftTableRenderer: DraftTableRenderer
  private readonly _animalCardDeckRenderer: AnimalCardDeckRenderer

  constructor(gameState: GameState) {
    this._gameState = gameState
    this._hexBoardRenderer = new HexBoardRenderer(gameState.hexBoard, gameState.layout)
    this._draftTableRenderer = new DraftTableRenderer(gameState.draftTable)
    this._animalCardDeckRenderer = new AnimalCardDeckRenderer(gameState.animalCardDeck)
  }

  render() {
    this._hexBoardRenderer.afterHexClick = () => {
      const score = new ScoreBoard(this._gameState.hexBoard)
      console.log('Score:', score.toString())
    }
    this._hexBoardRenderer.render()
    this._draftTableRenderer.render()
    this._animalCardDeckRenderer.render()
  }
}

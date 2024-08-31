import ScoreBoard from '../board/ScoreBoard'
import DraftTableRenderer from '../renderers/DraftTableRenderer'
import HexBoardRenderer from '../renderers/HexBoardRenderer'
import GameState from './GameState'

export default class GameRenderer {
  private readonly _gameState: GameState
  private readonly _hexBoardRenderer: HexBoardRenderer
  private readonly _draftTableRenderer: DraftTableRenderer

  constructor(gameState: GameState) {
    this._gameState = gameState
    this._hexBoardRenderer = new HexBoardRenderer(gameState.hexBoard, gameState.layout)
    this._draftTableRenderer = new DraftTableRenderer(gameState.draftTable)
  }

  render() {
    this._hexBoardRenderer.afterHexClick = () => {
      const score = new ScoreBoard(this._gameState.hexBoard)
      console.log('Score:', score.toString())
    }
    this._hexBoardRenderer.render()
    this._draftTableRenderer.render()
  }
}

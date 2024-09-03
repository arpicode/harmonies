import { MockInstance } from 'vitest'
import { HexBoardType } from '../../board/HexBoard'
import Game, { GameMode } from '../Game'

describe('Game', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let consoleLogSpy: MockInstance

  beforeEach(() => {
    document.body.innerHTML = `
      <div class="game-zone">
        <div class="game-zone-left">
          <figure class="draft-table-container orientation-player-1"></figure>
        </div>
        <figure class="game-board-container"></figure>
      </div>
      <dialog class="animal-deck-modal"></dialog>`

    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {
      /* empty body */
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it.each`
    gameMode         | boardType
    ${'multiplayer'} | ${'river'}
    ${'multiplayer'} | ${'island'}
    ${'multiplayer'} | ${'custom'}
    ${'solo'}        | ${'river'}
    ${'solo'}        | ${'island'}
    ${'solo'}        | ${'custom'}
  `(
    'should create a $gameMode with $boardType board game',
    ({ gameMode, boardType }: { gameMode: GameMode; boardType: HexBoardType }) => {
      const game = new Game(gameMode, boardType)
      expect(game.gameState).toBeDefined()
    }
  )
})

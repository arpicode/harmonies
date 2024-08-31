import { MockInstance } from 'vitest'
import { HexBoardType } from '../../board/HexBoard'
import Game, { GameMode } from '../Game'
import HexBoardRenderer from '../../renderers/HexBoardRenderer'

describe('Game', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let consoleLogSpy: MockInstance
  let gameBoardWrapper: HTMLElement

  beforeEach(() => {
    gameBoardWrapper = document.createElement('div')
    gameBoardWrapper.className = HexBoardRenderer.GAME_BOARD_WRAPPER_CLASS
    document.body.appendChild(gameBoardWrapper)

    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {
      /* empty body */
    })
  })

  afterEach(() => {
    document.body.innerHTML = ''
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

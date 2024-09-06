import { MockInstance } from 'vitest'
import { HexBoardType } from '../../board/HexBoard'
import Game, { GameMode } from '../Game'
import { dom } from './dom'

describe('Game', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let consoleLogSpy: MockInstance

  beforeEach(() => {
    document.body.innerHTML = dom

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

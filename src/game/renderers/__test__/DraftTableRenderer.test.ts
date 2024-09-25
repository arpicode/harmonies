import DraftTable from '../../../board/DraftTable'
import { dom } from '../../../dom'
import { GameMode } from '../../Game'
import GameState from '../../GameState'
import DraftTableRenderer from '../DraftTableRenderer'

describe('DraftTableRenderer', () => {
  let draftTableRenderer: DraftTableRenderer
  let gameState: GameState
  const consoleTimeSpy = vi.spyOn(console, 'time').mockImplementation(vi.fn())
  const consoleTimeEndSpy = vi.spyOn(console, 'timeEnd').mockImplementation(vi.fn())

  afterEach(() => {
    vi.clearAllMocks()
  })

  const initializeDraftTable = (gameMode: GameMode): void => {
    document.body.innerHTML = dom
    gameState = new GameState(gameMode, 'river')
    draftTableRenderer = new DraftTableRenderer(gameState)
  }

  it.each`
    gameMode
    ${'solo'}
    ${'multiplayer'}
  `('should create a DraftTableRenderer instance', ({ gameMode }: { gameMode: GameMode }) => {
    initializeDraftTable(gameMode)
    expect(draftTableRenderer).toBeInstanceOf(DraftTableRenderer)
    expect(consoleTimeSpy).toHaveBeenCalledTimes(1)
    expect(consoleTimeEndSpy).toHaveBeenCalledTimes(1)
  })

  it.each`
    gameMode
    ${'solo'}
    ${'multiplayer'}
  `('should throw an error if draft table wrapper is not found', ({ gameMode }: { gameMode: GameMode }) => {
    document.body.innerHTML = ''
    expect(() => {
      new DraftTableRenderer(new GameState(gameMode, 'river'))
    }).toThrowError('No draft table wrapper found')
  })

  it.each`
    gameMode         | imageSrc
    ${'solo'}        | ${DraftTableRenderer.TABLE_IMAGES.solo}
    ${'multiplayer'} | ${DraftTableRenderer.TABLE_IMAGES.multiplayer}
  `('should render the correct draft table image for $gameMode game mode', ({ gameMode }: { gameMode: GameMode }) => {
    initializeDraftTable(gameMode)
    draftTableRenderer.render()
    const draftTableImage = document.querySelector('.draft-table-image')
    expect(draftTableImage?.getAttribute('src')).toBe(DraftTableRenderer.TABLE_IMAGES[gameMode])
  })

  it.each`
    gameMode
    ${'solo'}
    ${'multiplayer'}
  `('should create the correct number of slots for $gameMode game mode', ({ gameMode }: { gameMode: GameMode }) => {
    initializeDraftTable(gameMode)
    draftTableRenderer.render()
    const slots = document.querySelectorAll('[data-slot-group-index]')
    const expectedSlots = gameMode === 'solo' ? DraftTable.MAX_SLOTS_SOLO : DraftTable.MAX_SLOTS_MULTIPLAYER
    expect(slots).toHaveLength(expectedSlots)
  })

  it.each`
    gameMode         | imageSrc
    ${'solo'}        | ${DraftTableRenderer.TABLE_IMAGES.solo}
    ${'multiplayer'} | ${DraftTableRenderer.TABLE_IMAGES.multiplayer}
  `('should render the token holder wrapper for $gameMode game mode', ({ gameMode }: { gameMode: GameMode }) => {
    initializeDraftTable(gameMode)
    draftTableRenderer.render()
    const tokenHolder = document.querySelector('.picked-tokens-wrapper')
    expect(tokenHolder).not.toBeNull()
  })

  it.each`
    gameMode
    ${'solo'}
    ${'multiplayer'}
  `('should render the correct number of tokens for $gameMode game mode', ({ gameMode }: { gameMode: GameMode }) => {
    initializeDraftTable(gameMode)
    draftTableRenderer.render()
    const tokenSlots = document.querySelectorAll('.slot-tokens')
    let totalTokens = 0
    tokenSlots.forEach((slot) => {
      totalTokens += slot.children.length
      expect(slot.children).toHaveLength(DraftTable.MAX_SLOT_SIZE)
    })
    const expectedTokens =
      gameMode === 'solo'
        ? DraftTable.MAX_SLOTS_SOLO * DraftTable.MAX_SLOT_SIZE
        : DraftTable.MAX_SLOTS_MULTIPLAYER * DraftTable.MAX_SLOT_SIZE
    expect(totalTokens).toBe(expectedTokens)
  })

  it.each`
    gameMode
    ${'solo'}
    ${'multiplayer'}
  `('should throw an error if token slot is not found', ({ gameMode }: { gameMode: GameMode }) => {
    initializeDraftTable(gameMode)
    document.querySelector('[data-slot-group-index="0"]')?.remove()
    expect(() => {
      draftTableRenderer.render()
    }).toThrowError('No slot tokens group found for slot 0')
  })

  it.each`
    gameMode
    ${'solo'}
    ${'multiplayer'}
  `('should throw an error when slot tokens group is not found', ({ gameMode }: { gameMode: GameMode }) => {
    initializeDraftTable(gameMode)
    document.querySelector('[data-slot-tokens-index="0"]')?.remove()
    expect(() => {
      draftTableRenderer.render()
    }).toThrowError('No slot tokens found for slot 0')
  })

  it.each`
    gameMode
    ${'solo'}
    ${'multiplayer'}
  `(
    'should add drafted tokens to the wrapper wrapper for $gameMode game mode',
    ({ gameMode }: { gameMode: GameMode }) => {
      initializeDraftTable(gameMode)
      const tokens = gameState.draftTable.pickUp(0)
      const freqencyTable = {} as Record<string, number>
      tokens.forEach((token) => {
        if (token.type in freqencyTable) {
          freqencyTable[token.type]++
        } else {
          freqencyTable[token.type] = 1
        }
      })
      draftTableRenderer.render()
      for (const key in freqencyTable) {
        const tokenCount = freqencyTable[key]
        const tokenHolder = document.querySelectorAll(`[data-token-type="${key}"]`)
        expect(tokenHolder).toHaveLength(tokenCount)
      }
      const tokenHolder = document.querySelector('.picked-tokens-wrapper')
      expect(tokenHolder?.children).toHaveLength(DraftTable.MAX_SLOT_SIZE)
    }
  )

  it.each`
    gameMode
    ${'solo'}
    ${'multiplayer'}
  `('should throw an error if wrapper wrapper is not found', ({ gameMode }: { gameMode: GameMode }) => {
    initializeDraftTable(gameMode)
    document.querySelector('.picked-tokens-wrapper')?.remove()
    expect(() => {
      draftTableRenderer.render()
    }).toThrowError('No picked tokens wrapper found')
  })
})

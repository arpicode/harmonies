import { MockInstance } from 'vitest'
import { dom } from '~/dom'
import GameState from '~/game/GameState'
import DraftTableRenderer from '~/game/renderers/DraftTableRenderer'
import DraftTableInputHandler from '../DraftTableInputHandler'
import { createEventWithTarget } from '~/test-utils/test-utils'

describe('DraftTableInputHandler', () => {
  document.body.innerHTML = ''
  let gameState: GameState
  let draftTableInputHandler: DraftTableInputHandler
  let draftTableRenderer: DraftTableRenderer

  let consoleLogSpy: MockInstance
  let consoleErrorSpy: MockInstance

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(vi.fn())
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(vi.fn())
    document.body.innerHTML = dom
    gameState = new GameState('multiplayer', 'river')
    draftTableRenderer = new DraftTableRenderer(gameState)
    draftTableInputHandler = new DraftTableInputHandler(gameState)
    draftTableRenderer.render()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should throw an error if the draft table is not found', () => {
    document.body.innerHTML = ''
    expect(() => draftTableInputHandler.initialize()).toThrow('Draft table not found')
  })

  it('should initialize draft table input handler', () => {
    draftTableInputHandler.initialize()
    expect(consoleLogSpy).toHaveBeenCalledTimes(2)
  })

  it('should handle click event outside a draft table slot', () => {
    draftTableInputHandler.initialize()

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const draftTableElement: SVGElement = document.querySelector('.draft-table-svg-overlay')!
    expect(draftTableElement).toBeDefined()

    const clickEvent = createEventWithTarget('click', draftTableElement)

    draftTableElement.dispatchEvent(clickEvent)
    expect(gameState.draftTable.draftedTokens.size()).toBe(0)
  })

  it('should handle click event on a draft table slot and update draftedTokens', () => {
    draftTableInputHandler.initialize()

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const slot = document.querySelector('.draft-table-slot')!
    expect(slot).toBeDefined()

    expect(gameState.draftTable.draftedTokens.size()).toBe(0)

    const clickEvent = createEventWithTarget('click', slot)

    slot.dispatchEvent(clickEvent)
    expect(gameState.draftTable.draftedTokens.size()).toBe(3)
  })

  it('should handle click event on a draft table slot when tokens are already picked up', () => {
    draftTableInputHandler.initialize()

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const slot = document.querySelector('.draft-table-slot')!
    expect(slot).toBeDefined()

    expect(gameState.draftTable.draftedTokens.size()).toBe(0)

    const clickEvent = createEventWithTarget('click', slot)

    slot.dispatchEvent(clickEvent)
    expect(gameState.draftTable.draftedTokens.size()).toBe(3)

    slot.dispatchEvent(clickEvent)
    expect(consoleLogSpy).toHaveBeenCalledWith('%c[Info] %cToken slot is empty', 'color: #2cc2e8;', 'color: #8ecfe0;')
  })

  it('should log an error if slot index is not found', () => {
    draftTableInputHandler.initialize()

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const slot = document.querySelector('.draft-table-slot')!
    expect(slot).toBeDefined()
    slot.removeAttribute('data-slot-index')

    const clickEvent = createEventWithTarget('click', slot)
    slot.dispatchEvent(clickEvent)

    expect(consoleErrorSpy).toHaveBeenCalledWith('No slot index')
  })

  it('should log an error if slot tokens index is not found', () => {
    draftTableInputHandler.initialize()

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const slot = document.querySelector('.draft-table-slot')!
    expect(slot).toBeDefined()
    const parent = document.querySelector('[data-slot-tokens-index]')
    parent?.removeAttribute('data-slot-tokens-index')

    const clickEvent = createEventWithTarget('click', slot)
    slot.dispatchEvent(clickEvent)

    expect(consoleErrorSpy).toHaveBeenCalledWith('No slot index 0')
  })

  it('should bind events to tokens in token holder', () => {
    draftTableInputHandler.initialize()

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const slot = document.querySelector('.draft-table-slot')!
    expect(slot).toBeDefined()

    const clickEvent = createEventWithTarget('click', slot)
    slot.dispatchEvent(clickEvent)

    const tokens = document.querySelectorAll('.picked-token')
    expect(tokens).toBeDefined()

    tokens.forEach((token) => {
      expect(token.classList.contains('dragging')).toBeFalsy()
    })

    tokens.forEach((token) => {
      const dragStartEvent = createEventWithTarget('dragstart', token)
      token.dispatchEvent(dragStartEvent)
      expect(token.classList.contains('dragging')).toBeTruthy()
      const dragEndEvent = createEventWithTarget('dragend', token)
      token.dispatchEvent(dragEndEvent)
      expect(token.classList.contains('dragging')).toBeFalsy()
    })
  })
})

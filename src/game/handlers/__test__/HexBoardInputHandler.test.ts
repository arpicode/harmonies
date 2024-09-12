/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Game from '~/game/Game'
import GameState from '~/game/GameState'
import HexBoardInputHandler from '../HexBoardInputHandler'
import HexBoardRenderer from '~/game/renderers/HexBoardRenderer'
import { dom } from '~/dom'
import { createEventWithTarget } from '~/test-utils/test-utils'
import { MockInstance } from 'vitest'

describe('HexBoardInputHandler', () => {
  document.body.innerHTML = ''
  let consoleLogSpy: MockInstance<Console['log']>
  let consoleWarnSpy: MockInstance<Console['warn']>

  beforeEach(() => {
    document.body.innerHTML = dom
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(vi.fn())
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(vi.fn())
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('constructor', () => {
    let gameState: GameState
    let hexBoardRenderer: HexBoardRenderer
    let hexBoardInputHandler: HexBoardInputHandler

    beforeEach(() => {
      document.body.innerHTML = dom
      gameState = new GameState('multiplayer', 'custom')
      hexBoardRenderer = new HexBoardRenderer(gameState)
      hexBoardRenderer.render()
    })
    it('should initialize the hex board input handler', () => {
      expect(() => (hexBoardInputHandler = new HexBoardInputHandler(gameState))).not.toThrow()
      expect(hexBoardInputHandler).toBeDefined()
      expect(hexBoardInputHandler).toBeInstanceOf(HexBoardInputHandler)
      expect(consoleLogSpy).toHaveBeenCalledTimes(2)
    })

    it('should throw an error when hex group is not found', () => {
      const hexGroup = document.querySelector('#hex-0-0')!
      hexGroup.remove()
      hexBoardInputHandler = new HexBoardInputHandler(gameState)
      expect(() => hexBoardInputHandler.initialize()).toThrowError('Hex group not found for hex 0-0')
    })
  })

  describe('drag and drop behavior', () => {
    let game: Game
    let tokenHolder: HTMLDivElement
    let draftedTokens: NodeListOf<HTMLDivElement>
    let hexDropZones: NodeListOf<SVGElement>

    const fillTokenHolderFromFirstTokenSlot = () => {
      const slot = document.querySelector('.draft-table-slot')!
      expect(slot).toBeDefined()

      expect(game.gameState.draftTable.draftedTokens.size()).toBe(0)

      const clickEvent = createEventWithTarget('click', slot)

      slot.dispatchEvent(clickEvent)
      expect(game.gameState.draftTable.draftedTokens.size()).toBe(3)
    }

    beforeEach(() => {
      game = new Game('multiplayer', 'custom')

      tokenHolder = document.querySelector('.token-holder')!
      expect(tokenHolder).not.toBeNull()

      fillTokenHolderFromFirstTokenSlot()
      draftedTokens = document.querySelectorAll('.token-holder-slot')
      expect(draftedTokens.length).toBe(3)

      hexDropZones = document.querySelectorAll('.hex')!
      const hexCount = hexDropZones.length

      expect(hexCount).toBe(7)
    })

    it.each([0, 1, 2, 3, 4, 5, 6])('should handle drag over hex #%i event', (hexDropZoneIndex) => {
      const currentHexDropZone = hexDropZones.item(hexDropZoneIndex)
      const dragOverEvent = createEventWithTarget('dragover', currentHexDropZone)
      currentHexDropZone.dispatchEvent(dragOverEvent)
      expect(dragOverEvent.defaultPrevented).toBe(true)
    })

    it.each([0, 1, 2, 3, 4, 5, 6])('should handle drag enter hex #%i event', (hexDropZoneIndex) => {
      const currentHexDropZone = hexDropZones.item(hexDropZoneIndex)
      const dragEnterEvent = createEventWithTarget('dragenter', currentHexDropZone)
      currentHexDropZone.dispatchEvent(dragEnterEvent)
      expect(currentHexDropZone.classList.contains('drag-over')).toBe(true)
    })

    it.each([0, 1, 2, 3, 4, 5, 6])('should handle drag leave hex #%i event', (hexDropZoneIndex) => {
      const currentHexDropZone = hexDropZones.item(hexDropZoneIndex)
      const dragLeaveEvent = createEventWithTarget('dragleave', currentHexDropZone)
      currentHexDropZone.dispatchEvent(dragLeaveEvent)
      expect(currentHexDropZone.classList.contains('drag-over')).toBe(false)
    })

    it('should handle drop on hex when no token is selected', () => {
      const currentHexDropZone = hexDropZones.item(0)
      const dropEvent = createEventWithTarget('drop', currentHexDropZone)
      currentHexDropZone.dispatchEvent(dropEvent)
      expect(currentHexDropZone.classList.contains('drag-over')).toBe(false)
      expect(consoleWarnSpy).toHaveBeenCalledWith('No token selected')
    })

    it('should handle drop on hex when no token type is found', () => {
      const currentToken = draftedTokens.item(0)
      const currentHexDropZone = hexDropZones.item(0)
      expect(currentToken).not.toBeNull()
      expect(currentHexDropZone).not.toBeNull()

      currentToken.removeAttribute('data-token-type')

      const dragStartEvent = createEventWithTarget('dragstart', currentToken)
      currentToken.dispatchEvent(dragStartEvent)
      expect(currentToken.classList.contains('dragging')).toBe(true)
      expect(consoleWarnSpy).not.toHaveBeenCalled()

      const dropEvent = createEventWithTarget('drop', currentHexDropZone)
      currentHexDropZone.dispatchEvent(dropEvent)
      expect(currentHexDropZone.classList.contains('drag-over')).toBe(false)
      expect(consoleWarnSpy).toHaveBeenCalledWith('Token type not found')
    })

    it('should handle dropping token on hex when target stack axial coords are not found', () => {
      const currentToken = draftedTokens.item(0)
      const currentHexDropZone = hexDropZones.item(0)
      expect(currentToken).not.toBeNull()
      expect(currentHexDropZone).not.toBeNull()

      const hexGroupTokenStack = document.querySelector('#hex-0-0 .token-stack')!
      expect(hexGroupTokenStack).not.toBeNull()
      hexGroupTokenStack.removeAttribute('data-stack-axial-coords')

      const dragStartEvent = createEventWithTarget('dragstart', currentToken)
      currentToken.dispatchEvent(dragStartEvent)
      expect(currentToken.classList.contains('dragging')).toBe(true)

      const dropEvent = createEventWithTarget('drop', currentHexDropZone)
      currentHexDropZone.dispatchEvent(dropEvent)
      expect(currentHexDropZone.classList.contains('drag-over')).toBe(false)
      expect(consoleWarnSpy).toHaveBeenCalledWith('No target hex found')
    })

    it('should handle dropping token on hex when target hex coordinates are not found', () => {
      const currentToken = draftedTokens.item(0)
      const currentHexDropZone = hexDropZones.item(0)
      expect(currentToken).not.toBeNull()
      expect(currentHexDropZone).not.toBeNull()

      const hexGroupTokenStack = document.querySelector('#hex-0-0 .token-stack')!
      expect(hexGroupTokenStack).not.toBeNull()
      hexGroupTokenStack.setAttribute('data-stack-axial-coords', '')

      const dragStartEvent = createEventWithTarget('dragstart', currentToken)
      currentToken.dispatchEvent(dragStartEvent)
      expect(currentToken.classList.contains('dragging')).toBe(true)

      const dropEvent = createEventWithTarget('drop', currentHexDropZone)
      currentHexDropZone.dispatchEvent(dropEvent)
      expect(currentHexDropZone.classList.contains('drag-over')).toBe(false)
      expect(consoleWarnSpy).toHaveBeenCalledWith('Target hex coordinates not found')
    })

    it('should handle dropping token on hex when hex is not found at coordinates', () => {
      const currentToken = draftedTokens.item(0)
      const currentHexDropZone = hexDropZones.item(0)
      expect(currentToken).not.toBeNull()
      expect(currentHexDropZone).not.toBeNull()

      const hexGroupTokenStack = document.querySelector('#hex-0-0 .token-stack')!
      expect(hexGroupTokenStack).not.toBeNull()

      const dragStartEvent = createEventWithTarget('dragstart', currentToken)
      currentToken.dispatchEvent(dragStartEvent)
      expect(currentToken.classList.contains('dragging')).toBe(true)

      game.gameState.hexBoard.hexes.delete('0,0')
      const dropEvent = createEventWithTarget('drop', currentHexDropZone)
      currentHexDropZone.dispatchEvent(dropEvent)
      expect(currentHexDropZone.classList.contains('drag-over')).toBe(false)
      expect(consoleWarnSpy).toHaveBeenCalledWith('Hex not found at coordinates (0, 0)')
    })

    it('should handle dropping token on hex', () => {
      const currentToken = document.querySelector('.token-holder-slot')!
      let currentHexDropZone = document.querySelector('.hex')!
      expect(currentToken).not.toBeNull()
      expect(currentHexDropZone).not.toBeNull()

      const currentDropZoneParentId = currentHexDropZone.parentElement?.id // should be hex-0-0
      const currentTokenTokenType = currentToken.getAttribute('data-token-type')

      // Simulate drag start event from the token
      const dragStartEvent = createEventWithTarget('dragstart', currentToken, { clientX: 0, clientY: 0 })
      currentToken.dispatchEvent(dragStartEvent)
      expect(currentToken.classList.contains('dragging')).toBe(true)

      // Simulaire drag enter event on the hex
      const dragEnterEvent = createEventWithTarget('dragenter', currentHexDropZone, {
        clientX: 10,
        clientY: 10,
      })
      currentHexDropZone.dispatchEvent(dragEnterEvent)
      expect(currentHexDropZone.classList.contains('drag-over')).toBe(true)

      // Simulate drop event on the hex
      const dropEvent = createEventWithTarget('drop', currentHexDropZone, {
        clientX: 10,
        clientY: 10,
      })
      currentHexDropZone.dispatchEvent(dropEvent)

      // Simulate the dropend event on the token
      const dropEndEvent = createEventWithTarget('dropend', currentToken, {
        clientX: 10,
        clientY: 10,
      })
      currentToken.dispatchEvent(dropEndEvent)

      // get the rendered token holder
      tokenHolder = document.querySelector('.token-holder')!
      expect(tokenHolder).not.toBeNull()
      expect(tokenHolder.children.length).toBe(2)

      currentHexDropZone = document.querySelector(`#${currentDropZoneParentId} .token-stack`)!
      expect(currentHexDropZone).not.toBeNull()
      expect(currentHexDropZone.children.length).toBe(1)
      expect(currentHexDropZone.children.item(0)?.getAttribute('class')).toBe(currentTokenTokenType?.toLowerCase())
    })
  })
})

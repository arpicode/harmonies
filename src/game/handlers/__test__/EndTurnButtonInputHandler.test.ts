/* eslint-disable @typescript-eslint/no-non-null-assertion */
import EndTurnButtonRenderer from '~/game/renderers/EndTurnButtonRenderer'
import EndTurnButtonInputHandler, { EndTurnButtonSelectors } from '../EndTurnButtonInputHandler'
import GameState from '~/game/GameState'
import { dom } from '~/dom'
import { createEventWithTarget } from '~/test-utils/test-utils'
import { GameMode } from '~/game/Game'
import { HexBoardType } from '~/board/HexBoard'

describe('EndTurnButtonInputHandler', () => {
  document.body.innerHTML = ''
  let gameState: GameState
  let endTurnButtonInputHandler: EndTurnButtonInputHandler
  let endTurnButtonRenderer: EndTurnButtonRenderer

  const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(vi.fn())
  beforeEach(() => {
    document.body.innerHTML = dom
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('constructor', () => {
    beforeEach(() => {
      gameState = new GameState('multiplayer', 'river')
      endTurnButtonRenderer = new EndTurnButtonRenderer(gameState)
      endTurnButtonRenderer.render()
    })

    it('should initialize the animal card deck input handler', () => {
      expect(() => (endTurnButtonInputHandler = new EndTurnButtonInputHandler(gameState))).not.toThrow()
      expect(endTurnButtonInputHandler).toBeDefined()
      expect(endTurnButtonInputHandler).toBeInstanceOf(EndTurnButtonInputHandler)
      expect(consoleLogSpy).toHaveBeenCalledTimes(2)
    })

    it.each`
      selector                                  | className
      ${EndTurnButtonSelectors.GAME_WRAPPER}    | ${'game-wrapper'}
      ${EndTurnButtonSelectors.END_TURN_BUTTON} | ${'end-turn-button'}
    `(
      'should throw an error if $selector is not found',
      ({ selector, className }: { selector: string; className: string }) => {
        document.querySelector(selector)?.classList.remove(className)
        try {
          new EndTurnButtonInputHandler(gameState)
        } catch (error) {
          expect((error as Error).name).toBe('EndTurnButtonDOMException')
          expect((error as Error).message).toBe(`Element with selector "${selector}" not found`)
        }
      }
    )
  })

  describe('handlers', () => {
    const renderInitialGameState = (gameMode: GameMode, boardType: HexBoardType) => {
      gameState = new GameState(gameMode, boardType)
      endTurnButtonRenderer = new EndTurnButtonRenderer(gameState)
      endTurnButtonRenderer.render()
    }

    it.each`
      gameMode         | boardType
      ${'multiplayer'} | ${'river'}
      ${'multiplayer'} | ${'island'}
      ${'solo'}        | ${'river'}
      ${'solo'}        | ${'island'}
    `(
      'should handle the end turn button click event',
      ({ gameMode, boardType }: { gameMode: GameMode; boardType: HexBoardType }) => {
        renderInitialGameState(gameMode, boardType)
        endTurnButtonInputHandler = new EndTurnButtonInputHandler(gameState)
        endTurnButtonInputHandler.initialize()
        gameState.animalCardDeck.drawnCards.pop()

        const endTurnButton = document.querySelector<HTMLButtonElement>(EndTurnButtonSelectors.END_TURN_BUTTON)!
        expect(endTurnButton).not.toBeNull()

        endTurnButton.disabled = false
        const endTurnButtonEvent = createEventWithTarget('click', endTurnButton)
        endTurnButton.dispatchEvent(endTurnButtonEvent)

        expect(endTurnButton.disabled).toBe(true)
        expect(gameState.animalCardDeck.drawnCards.length).toBe(5)
        expect(consoleLogSpy).toHaveBeenCalledWith(
          `%c[Info] %cNew card drawn: %c${gameState.animalCardDeck.drawnCards[4].name}`,
          'color: #2cc2e8;',
          'color: #8ecfe0;',
          'color: #8ecfe0;font-weight: bold;'
        )
      }
    )

    it.each`
      gameMode         | boardType
      ${'multiplayer'} | ${'river'}
      ${'multiplayer'} | ${'island'}
      ${'solo'}        | ${'river'}
      ${'solo'}        | ${'island'}
    `(
      'should handle the end turn button click event when the game is over',
      ({ gameMode, boardType }: { gameMode: GameMode; boardType: HexBoardType }) => {
        renderInitialGameState(gameMode, boardType)
        const mockIsGameOver = vi.spyOn(gameState, 'isGameOver').mockReturnValue(true)

        endTurnButtonInputHandler = new EndTurnButtonInputHandler(gameState)
        endTurnButtonInputHandler.initialize()
        gameState.animalCardDeck.drawnCards.pop()

        const endTurnButton = document.querySelector<HTMLButtonElement>(EndTurnButtonSelectors.END_TURN_BUTTON)!
        expect(endTurnButton).not.toBeNull()

        endTurnButton.disabled = false
        const endTurnButtonEvent = createEventWithTarget('click', endTurnButton)
        expect(mockIsGameOver).not.toHaveBeenCalled()

        endTurnButton.dispatchEvent(endTurnButtonEvent)

        expect(endTurnButton.disabled).toBe(true)
        expect(mockIsGameOver).toHaveBeenCalled()
      }
    )
  })
})

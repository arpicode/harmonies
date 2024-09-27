/* eslint-disable @typescript-eslint/no-non-null-assertion */
import GameState from '~/game/GameState'
import EndTurnButtonRenderer from '../EndTurnButtonRenderer'
import { dom } from '~/dom'

describe('EndTurnButtonRenderer', () => {
  let endTurnButtonRenderer: EndTurnButtonRenderer
  let gameState: GameState
  const consoleTimeSpy = vi.spyOn(console, 'time').mockImplementation(vi.fn())
  const consoleTimeEndSpy = vi.spyOn(console, 'timeEnd').mockImplementation(vi.fn())

  afterEach(() => {
    vi.clearAllMocks()
  })

  const initializeEndTurnButton = (): void => {
    document.body.innerHTML = dom
    gameState = new GameState('multiplayer', 'river')
    endTurnButtonRenderer = new EndTurnButtonRenderer(gameState)
  }

  it('should create a EndTurnButtonRenderer instance', () => {
    initializeEndTurnButton()
    expect(endTurnButtonRenderer).toBeInstanceOf(EndTurnButtonRenderer)
    expect(consoleTimeSpy).toHaveBeenCalledTimes(1)
    expect(consoleTimeEndSpy).toHaveBeenCalledTimes(1)
  })

  it('should throw an error if end turn button wrapper not found', () => {
    document.body.innerHTML = ''
    expect(() => {
      new EndTurnButtonRenderer(new GameState('multiplayer', 'river'))
    }).toThrow('End turn button wrapper not found')
  })

  it('should render end turn button', () => {
    initializeEndTurnButton()
    endTurnButtonRenderer.render()
    const expectedText = gameState.endTurnButton.text
    const expectedDisabledState = gameState.endTurnButton.disabled
    const endTurnButtonElement = document.querySelector<HTMLButtonElement>('.end-turn-button')
    expect(endTurnButtonElement).not.toBeNull()
    expect(endTurnButtonElement!.innerHTML).toBe(expectedText)
    expect(endTurnButtonElement!.disabled).toBe(expectedDisabledState)
  })

  it('should throw an error if end turn button not found', () => {
    initializeEndTurnButton()
    document.body.innerHTML = ''
    expect(() => endTurnButtonRenderer.render()).toThrow('End turn button not found')
  })
})

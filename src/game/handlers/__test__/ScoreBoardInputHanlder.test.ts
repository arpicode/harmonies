import { dom } from '~/dom'
import ScoreBoardInputHandler, { ScoreBoardSelectors } from '../ScoreBoardInputHanlder'
import { createEventWithTarget } from '~/test-utils/test-utils'

describe('ScoreBoardInputHandler', () => {
  document.body.innerHTML = ''
  let scoreBoardInputHandler: ScoreBoardInputHandler

  // const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(vi.fn())

  beforeEach(() => {
    document.body.innerHTML = dom
    scoreBoardInputHandler = new ScoreBoardInputHandler()
  })

  it('should throw an error if the score board wrapper is not found', () => {
    document.body.innerHTML = ''
    expect(() => (scoreBoardInputHandler = new ScoreBoardInputHandler())).toThrow(
      `Element with selector "${ScoreBoardSelectors.SCORE_BOARD_WRAPPER}" not found`
    )
  })

  it('should initialize score board input handler', () => {
    scoreBoardInputHandler.initialize()
    expect(scoreBoardInputHandler).toBeInstanceOf(ScoreBoardInputHandler)
  })

  it('should handle click event on the score board wrapper', () => {
    scoreBoardInputHandler.initialize()

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const scoreBoardWrapper: HTMLDivElement = document.querySelector(ScoreBoardSelectors.SCORE_BOARD_WRAPPER)!
    expect(scoreBoardWrapper).not.toBeNull()
    expect(scoreBoardWrapper.classList.contains(ScoreBoardSelectors.SCORE_BOARD_SHOW_MODIFIER.replace('.', ''))).toBe(
      true
    )
    const clickEvent = createEventWithTarget('click', scoreBoardWrapper)

    scoreBoardWrapper.dispatchEvent(clickEvent)
    expect(scoreBoardWrapper.classList.contains(ScoreBoardSelectors.SCORE_BOARD_SHOW_MODIFIER.replace('.', ''))).toBe(
      false
    )
  })
})

import IInputHandler from './interfaces/IInputHandler'

export enum ScoreBoardSelectors {
  SCORE_BOARD_WRAPPER = '.preview-box-wrapper',
  SCORE_BOARD_SHOW_MODIFIER = '.score-board--show',
}

class ScoreBoardDOMException extends Error {
  constructor(selector: string) {
    super()
    this.name = 'ScoreBoardDOMException'
    this.message = `Element with selector "${selector}" not found`
  }
}

export default class ScoreBoardInputHandler implements IInputHandler {
  private readonly _scoreBoardWrapper: HTMLDivElement

  constructor() {
    this._scoreBoardWrapper = this._querySelector<HTMLDivElement>(ScoreBoardSelectors.SCORE_BOARD_WRAPPER)
  }

  private _querySelector<T extends HTMLElement>(selector: ScoreBoardSelectors): T {
    const element = document.querySelector<T>(selector)
    if (!element) throw new ScoreBoardDOMException(selector)
    return element
  }

  initialize() {
    this._bindEvents()
  }

  private _bindEvents() {
    this._scoreBoardWrapper.addEventListener('click', this._handleScoreBoardClick)
  }

  private _handleScoreBoardClick = (event: Event) => {
    const target = event.currentTarget as HTMLDivElement
    target.classList.toggle('score-board--show')
  }
}

import ScoreBoard from '~/board/ScoreBoard'
import IRenderer from '../interfaces/IRenderer'
import GameState, { RendererEvent } from '../GameState'

export default class ScoreBoardRenderer implements IRenderer {
  private readonly _gameState: GameState
  private readonly _scoreBoardState: ScoreBoard
  private _tokensScores: Record<string, number>
  private _animalsScores: Record<string, number>
  private _animalCardPositionGenerator: Generator<number, void>

  private _TOKEN_NAMES = new Map<string, string>([
    ['tree', 'Arbres'],
    ['mountain', 'Montagnes'],
    ['field', 'Champs'],
    ['building', 'Bâtiments'],
  ])

  constructor(gameState: GameState) {
    console.time('[Initialize] ScoreBoard')
    this._gameState = gameState
    this._scoreBoardState = gameState.scoreBoard
    this._tokensScores = {}
    this._animalsScores = {}
    this._animalCardPositionGenerator = this._createAnimalCardPositionGenerator()
    this._initializeScoreBoardDOM()
    this._gameState.on(RendererEvent.HEX_BOARD_UPDATED, () => this.render())
    this._gameState.on(RendererEvent.PICKED_CARDS_HOLDER_UPDATED, () => this.render())
    this._gameState.on(RendererEvent.PLACE_ANIMAL_END, () => this.render())
    this._TOKEN_NAMES.set('river', this._gameState.hexBoardType === 'river' ? 'Rivière' : 'Îles')
    console.timeEnd('[Initialize] ScoreBoard')
  }

  render(): void {
    console.time('[Render] ScoreBoard')
    this._tokensScores = this._scoreBoardState.tokensScores()
    this._renderTokenScores()
    this._animalsScores = this._scoreBoardState.animalCardsScores()
    this._renderAnimalScores()

    this._renderTotalScore(this._tokensScores.total, this._animalsScores.total)
    console.timeEnd('[Render] ScoreBoard')
  }

  private _initializeScoreBoardDOM() {
    this._renderScoringHelper()
    this._renderScoreBoardOverlay()
  }

  private _renderScoringHelper() {
    const scoringHelper = document.querySelector<HTMLImageElement>('.preview')
    if (!scoringHelper) throw new Error('Scoring helper not found')
    switch (this._gameState.hexBoardType) {
      case 'river':
        scoringHelper.src = 'helper_river.webp'
        break
      case 'island':
        scoringHelper.src = 'helper_island.webp'
        break
      default:
        scoringHelper.src = 'helper_custom.webp'
    }
  }

  private _renderScoreBoardOverlay() {
    const wrapper = this._getScoreBoardWrapper()
    const scoreBoardOverlay = document.createElement('div')
    scoreBoardOverlay.classList.add('score-board-overlay')
    const titleElement = this._createTitleElement('Score')
    const tokensScoresElement = this._createTokensScoresElement()
    const animalsScoresElement = this._createAnimalsScoresElement()
    scoreBoardOverlay.appendChild(titleElement)
    scoreBoardOverlay.appendChild(tokensScoresElement)
    scoreBoardOverlay.appendChild(animalsScoresElement)

    wrapper.appendChild(scoreBoardOverlay)
  }

  private _getScoreBoardWrapper(): HTMLDivElement {
    const wrapper = document.querySelector<HTMLDivElement>('.preview-box-wrapper')
    if (!wrapper) throw new Error('Score board wrapper not found')

    return wrapper
  }

  private _getTokensScoresOverlay(): HTMLDivElement {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const tokensScoresElement = document.querySelector<HTMLDivElement>('.score-board-overlay .tokens-scores')!
    return tokensScoresElement
  }

  private _getAnimalsScoresOverlay(): HTMLDivElement {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const animalsScoresElement = document.querySelector<HTMLDivElement>('.score-board-overlay .animals-scores')!
    return animalsScoresElement
  }

  private _createTokensScoresElement(): HTMLDivElement {
    const tokensScoresElement = document.createElement('div')
    tokensScoresElement.classList.add('tokens-scores')

    return tokensScoresElement
  }

  private _createAnimalsScoresElement(): HTMLDivElement {
    const animalsScoresElement = document.createElement('div')
    animalsScoresElement.classList.add('animals-scores')

    return animalsScoresElement
  }

  private _updateOrCreateTokenScoreElement(tokenKey: string): void {
    const overlay = this._getTokensScoresOverlay()
    let tokenScoreElement = overlay.querySelector<HTMLDivElement>(`[data-score-for-token="${tokenKey}"]`)

    if (!tokenScoreElement) {
      tokenScoreElement = document.createElement('div')
      tokenScoreElement.classList.add('score')
      tokenScoreElement.dataset.scoreForToken = tokenKey
      tokenScoreElement.title = this._TOKEN_NAMES.get(tokenKey) ?? tokenKey
      overlay.appendChild(tokenScoreElement)
    }
  }

  private _renderTokenScores(): void {
    Object.entries(this._tokensScores).forEach(([tokenKey, tokenScore]) => {
      this._updateOrCreateTokenScoreElement(tokenKey)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const tokenScoreElement = document.querySelector<HTMLDivElement>(`[data-score-for-token="${tokenKey}"]`)! // We just created it
      tokenScoreElement.textContent = `${tokenScore}`
    })
  }

  private *_createAnimalCardPositionGenerator(): Generator<number, void> {
    let counter = 0
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    while (true) {
      /* Needed to keep the generator running */
      yield counter++
    }
  }

  private _updateOrCreateAnimalScoreElement(animalKey: string): void {
    const overlay = this._getAnimalsScoresOverlay()
    let animalScoreElement = overlay.querySelector<HTMLDivElement>(`[data-score-for-animal="${animalKey}"]`)

    if (!animalScoreElement) {
      animalScoreElement = document.createElement('div')
      animalScoreElement.classList.add('score')
      animalScoreElement.dataset.scoreForAnimal = animalKey
      animalScoreElement.title = animalKey
      if (animalKey !== 'total')
        animalScoreElement.dataset.position = `${this._animalCardPositionGenerator.next().value}`
      overlay.appendChild(animalScoreElement)
    }
  }

  private _renderAnimalScores(): void {
    Object.entries(this._animalsScores).forEach(([animalKey, animalScore]) => {
      this._updateOrCreateAnimalScoreElement(animalKey)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const animalScoreElement = document.querySelector<HTMLDivElement>(`[data-score-for-animal="${animalKey}"]`)! // We just created it
      animalScoreElement.textContent = `${animalScore}`
    })
  }

  private _updateOrCreateTotalScoreElement(): void {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const overlay = document.querySelector<HTMLDivElement>('.score-board-overlay')! // We just created it
    let totalScoreElement = overlay.querySelector<HTMLDivElement>('.total-score')

    if (!totalScoreElement) {
      totalScoreElement = document.createElement('div')
      totalScoreElement.classList.add('score', 'total-score')
      overlay.appendChild(totalScoreElement)
    }
  }

  private _renderTotalScore(tokensTotal: number, animalsTotal: number): void {
    this._updateOrCreateTotalScoreElement()
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const totalScoreElement = document.querySelector<HTMLDivElement>('.total-score')! // We just created it
    totalScoreElement.textContent = `${tokensTotal + animalsTotal}`
    const sunsCountElement = document.querySelector<HTMLSpanElement>('.suns-count')
    if (sunsCountElement) {
      sunsCountElement.textContent = `${this._scoreBoardState.soloBonusScore(tokensTotal + animalsTotal)}`
      sunsCountElement.title = 'Évaluation du score en mode solo sur 11 points'
    }
  }

  private _createTitleElement(title: string): HTMLDivElement {
    const titleElement = document.createElement('div')
    titleElement.classList.add('score-board-title')
    titleElement.innerHTML = `<span>${title}</span>`
    if (this._gameState.gameMode === 'solo') {
      titleElement.innerHTML += '<div class="suns-count"></div>'
    }

    return titleElement
  }
}

/* eslint-disable @typescript-eslint/no-non-null-assertion */
import GameState from '~/game/GameState'
import ScoreBoardRenderer from '../ScoreBoardRenderer'
import { GameMode } from '~/game/Game'
import { HexBoardType } from '~/board/HexBoard'
import { dom } from '~/dom'
import AnimalCard, { IAnimalCards } from '~/board/AnimalCard'

import animalsJson from '../../../animals.json'
import { Hex } from '~/board/Hex'
const animals = animalsJson as IAnimalCards

describe('ScoreBoardRenderer', () => {
  let scoreBoardRenderer: ScoreBoardRenderer
  let gameState: GameState

  const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(vi.fn())
  const consoleTimeSpy = vi.spyOn(console, 'time').mockImplementation(vi.fn())
  const consoleTimeEndSpy = vi.spyOn(console, 'timeEnd').mockImplementation(vi.fn())

  const initializeScoreBoardRenderer = (hexBoardType: HexBoardType, gameMode: GameMode) => {
    gameState = new GameState(gameMode, hexBoardType)
    scoreBoardRenderer = new ScoreBoardRenderer(gameState)
  }

  beforeEach(() => {
    document.body.innerHTML = dom
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Initialization', () => {
    it.each`
      hexBoardType | gameMode
      ${'river'}   | ${'solo'}
      ${'island'}  | ${'solo'}
      ${'custom'}  | ${'solo'}
      ${'river'}   | ${'multiplayer'}
      ${'island'}  | ${'multiplayer'}
      ${'custom'}  | ${'multiplayer'}
    `(
      'should create a ScoreBoardRenderer for a $hexBoardType board in $gameMode mode',
      ({ hexBoardType, gameMode }: { hexBoardType: HexBoardType; gameMode: GameMode }) => {
        initializeScoreBoardRenderer(hexBoardType, gameMode)
        expect(scoreBoardRenderer).toBeInstanceOf(ScoreBoardRenderer)
        expect(consoleTimeSpy).toHaveBeenCalledTimes(1)
        expect(consoleTimeEndSpy).toHaveBeenCalledTimes(1)
      }
    )

    it.each`
      hexBoardType | gameMode
      ${'river'}   | ${'solo'}
      ${'island'}  | ${'solo'}
      ${'custom'}  | ${'solo'}
      ${'river'}   | ${'multiplayer'}
      ${'island'}  | ${'multiplayer'}
      ${'custom'}  | ${'multiplayer'}
    `(
      'should throw an error if the preview element is not found for a $hexBoardType board in $gameMode mode',
      ({ hexBoardType, gameMode }: { hexBoardType: HexBoardType; gameMode: GameMode }) => {
        const previewElement = document.querySelector('.preview')
        previewElement?.remove()
        expect(() => initializeScoreBoardRenderer(hexBoardType, gameMode)).toThrowError('Scoring helper not found')
      }
    )

    it.each`
      hexBoardType | gameMode
      ${'river'}   | ${'solo'}
      ${'island'}  | ${'solo'}
      ${'custom'}  | ${'solo'}
      ${'river'}   | ${'multiplayer'}
      ${'island'}  | ${'multiplayer'}
      ${'custom'}  | ${'multiplayer'}
    `(
      'should throw an error if the preview wrapper is not found for a $hexBoardType board in $gameMode mode',
      ({ hexBoardType, gameMode }: { hexBoardType: HexBoardType; gameMode: GameMode }) => {
        const previewElement = document.querySelector('.preview-box-wrapper')
        previewElement?.classList.remove('preview-box-wrapper')
        expect(() => initializeScoreBoardRenderer(hexBoardType, gameMode)).toThrowError('Score board wrapper not found')
      }
    )
  })

  describe('Rendering', () => {
    it.each`
      hexBoardType | gameMode
      ${'river'}   | ${'solo'}
      ${'island'}  | ${'solo'}
      ${'custom'}  | ${'solo'}
      ${'river'}   | ${'multiplayer'}
      ${'island'}  | ${'multiplayer'}
      ${'custom'}  | ${'multiplayer'}
    `(
      'should render the scoring helper a $hexBoardType board in $gameMode mode',
      ({ hexBoardType, gameMode }: { hexBoardType: HexBoardType; gameMode: GameMode }) => {
        initializeScoreBoardRenderer(hexBoardType, gameMode)
        scoreBoardRenderer.render()
        const helperImage = document.querySelector<HTMLImageElement>('.preview')!
        expect(helperImage).not.toBeNull()
        expect(helperImage.src).toContain(`helper_${hexBoardType}.webp`)
      }
    )

    it.each`
      hexBoardType | gameMode
      ${'river'}   | ${'solo'}
      ${'island'}  | ${'solo'}
      ${'custom'}  | ${'solo'}
      ${'river'}   | ${'multiplayer'}
      ${'island'}  | ${'multiplayer'}
      ${'custom'}  | ${'multiplayer'}
    `(
      'should render the score board for a $hexBoardType board in $gameMode mode',
      ({ hexBoardType, gameMode }: { hexBoardType: HexBoardType; gameMode: GameMode }) => {
        initializeScoreBoardRenderer(hexBoardType, gameMode)
        scoreBoardRenderer.render()
        expect(document.querySelector('.score-board-overlay')).not.toBeNull()
      }
    )

    it.each`
      hexBoardType | gameMode
      ${'river'}   | ${'solo'}
      ${'island'}  | ${'solo'}
      ${'custom'}  | ${'solo'}
      ${'river'}   | ${'multiplayer'}
      ${'island'}  | ${'multiplayer'}
      ${'custom'}  | ${'multiplayer'}
    `(
      'should render the total score for a $hexBoardType board in $gameMode mode',
      ({ hexBoardType, gameMode }: { hexBoardType: HexBoardType; gameMode: GameMode }) => {
        initializeScoreBoardRenderer(hexBoardType, gameMode)
        scoreBoardRenderer.render()
        expect(document.querySelector('.total-score')).not.toBeNull()

        const expectedInitialTotalScore = gameState.hexBoardType === 'river' ? '0' : '5'
        expect(document.querySelector('.total-score')?.textContent).toBe(expectedInitialTotalScore)
      }
    )

    it.each`
      hexBoardType | gameMode
      ${'river'}   | ${'solo'}
      ${'island'}  | ${'solo'}
      ${'custom'}  | ${'solo'}
      ${'river'}   | ${'multiplayer'}
      ${'island'}  | ${'multiplayer'}
      ${'custom'}  | ${'multiplayer'}
    `(
      'should render the initial scores for tokens and animals for a $hexBoardType board in $gameMode mode',
      ({ hexBoardType, gameMode }: { hexBoardType: HexBoardType; gameMode: GameMode }) => {
        initializeScoreBoardRenderer(hexBoardType, gameMode)
        scoreBoardRenderer.render()
        const animalsScores = document.querySelectorAll('[data-score-for-animal]')
        expect(animalsScores).toHaveLength(1) // Only the initial total score
        expect(animalsScores[0].textContent).toBe('0')

        const tokensScores = document.querySelectorAll<HTMLDivElement>('[data-score-for-token]')
        expect(tokensScores).toHaveLength(6)
        const expectedInitialTokenScore = gameState.hexBoardType === 'river' ? '0' : '5'
        tokensScores.forEach((tokenScore) => {
          if (tokenScore.dataset.scoreForToken === 'river' || tokenScore.dataset.scoreForToken === 'total') {
            expect(tokenScore.textContent).toBe(expectedInitialTokenScore)
          } else {
            expect(tokenScore.textContent).toBe('0')
          }
        })
      }
    )
  })

  it.each`
    hexBoardType | gameMode
    ${'river'}   | ${'solo'}
    ${'island'}  | ${'solo'}
    ${'custom'}  | ${'solo'}
    ${'river'}   | ${'multiplayer'}
    ${'island'}  | ${'multiplayer'}
    ${'custom'}  | ${'multiplayer'}
  `(
    'should update the animal score when an animal card is picked for a $hexBoardType board in $gameMode mode',
    ({ hexBoardType, gameMode }: { hexBoardType: HexBoardType; gameMode: GameMode }) => {
      initializeScoreBoardRenderer(hexBoardType, gameMode)
      scoreBoardRenderer.render()

      const hedgehogCard = new AnimalCard(animals.hedgehog)
      gameState.pickedCardsHolder.add(hedgehogCard)

      gameState.notifyPickedCardsHolderUpdate()
      const hedgehogCardScore = document.querySelector<HTMLDivElement>('[data-score-for-animal="Hérisson"]')
      expect(hedgehogCardScore?.textContent).toBe('0')

      const totalAnimalScore = document.querySelector<HTMLDivElement>('[data-score-for-animal="total"]')
      expect(totalAnimalScore?.textContent).toBe('0')

      const totalScore = document.querySelector<HTMLDivElement>('.total-score')
      const expectedInitialTokenScore = gameState.hexBoardType === 'river' ? 0 : 5
      expect(totalScore?.textContent).toBe(`${0 + expectedInitialTokenScore}`)
    }
  )

  it.each`
    hexBoardType | gameMode
    ${'river'}   | ${'solo'}
    ${'island'}  | ${'solo'}
    ${'custom'}  | ${'solo'}
    ${'river'}   | ${'multiplayer'}
    ${'island'}  | ${'multiplayer'}
    ${'custom'}  | ${'multiplayer'}
  `(
    'should update the animal score when an animal token is placed for a $hexBoardType board in $gameMode mode',
    ({ hexBoardType, gameMode }: { hexBoardType: HexBoardType; gameMode: GameMode }) => {
      initializeScoreBoardRenderer(hexBoardType, gameMode)

      const hedgehogCard = new AnimalCard(animals.hedgehog)
      gameState.pickedCardsHolder.add(hedgehogCard)
      scoreBoardRenderer.render()

      let hedgehogCardScore = document.querySelector<HTMLDivElement>('[data-score-for-animal="Hérisson"]')
      expect(hedgehogCardScore?.textContent).toBe('0')

      hedgehogCard.removeAnimalToken()
      gameState.notifyPlaceAnimalEnd(hedgehogCard, new Hex(0, 0, 0))
      hedgehogCardScore = document.querySelector<HTMLDivElement>('[data-score-for-animal="Hérisson"]')
      expect(hedgehogCardScore?.textContent).toBe('5')

      const totalAnimalScore = document.querySelector<HTMLDivElement>('[data-score-for-animal="total"]')
      expect(totalAnimalScore?.textContent).toBe('5')

      const totalScore = document.querySelector<HTMLDivElement>('.total-score')
      const expectedInitialTokenScore = gameState.hexBoardType === 'river' ? 0 : 5
      expect(totalScore?.textContent).toBe(`${5 + expectedInitialTokenScore}`)

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringMatching(/\[EventEmitter\]/),
        expect.stringMatching(/color:/),
        expect.stringMatching(/color:/)
      )
    }
  )

  it.each`
    hexBoardType | gameMode
    ${'river'}   | ${'solo'}
    ${'island'}  | ${'solo'}
    ${'custom'}  | ${'solo'}
    ${'river'}   | ${'multiplayer'}
    ${'island'}  | ${'multiplayer'}
    ${'custom'}  | ${'multiplayer'}
  `(
    'should correctly set the animal card position for a $hexBoardType board in $gameMode mode',
    ({ hexBoardType, gameMode }: { hexBoardType: HexBoardType; gameMode: GameMode }) => {
      initializeScoreBoardRenderer(hexBoardType, gameMode)
      const hedgehogCard = new AnimalCard(animals.hedgehog)
      const eagleCard = new AnimalCard(animals.eagle)
      const squirrelCard = new AnimalCard(animals.squirrel)
      gameState.pickedCardsHolder.add(hedgehogCard)
      gameState.pickedCardsHolder.add(eagleCard)
      gameState.pickedCardsHolder.add(squirrelCard)
      scoreBoardRenderer.render()

      const hedgehogCardScore = document.querySelector<HTMLDivElement>('[data-score-for-animal="Hérisson"]')
      expect(hedgehogCardScore?.dataset.position).toBe('0')

      const eagleCardScore = document.querySelector<HTMLDivElement>('[data-score-for-animal="Aigle"]')
      expect(eagleCardScore?.dataset.position).toBe('1')

      const squirrelCardScore = document.querySelector<HTMLDivElement>('[data-score-for-animal="Écureuil"]')
      expect(squirrelCardScore?.dataset.position).toBe('2')
    }
  )
})

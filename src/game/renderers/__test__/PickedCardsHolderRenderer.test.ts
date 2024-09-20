import { dom } from '../../../dom'
import GameState from '../../GameState'
import PickedCardsHolderRenderer from '../PickedCardsHolderRenderer'
import AnimalCard, { IAnimalCards } from '../../../board/AnimalCard'
import PickedCardsHolder from '../../../board/PickedCardsHolder'
import { Hex } from '~/board/Hex'

import animalsJson from '../../../animals.json'
const animals = animalsJson as IAnimalCards

describe('PickedCardsHolderRenderer', () => {
  let pickedCardsHolderRenderer: PickedCardsHolderRenderer
  let gameState: GameState
  const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(vi.fn())
  const consoleTimeSpy = vi.spyOn(console, 'time').mockImplementation(vi.fn())
  const consoleTimeEndSpy = vi.spyOn(console, 'timeEnd').mockImplementation(vi.fn())

  afterEach(() => {
    vi.clearAllMocks()
  })

  const initializePickedCardsHolder = (): void => {
    document.body.innerHTML = dom
    gameState = new GameState('multiplayer', 'river')
    pickedCardsHolderRenderer = new PickedCardsHolderRenderer(gameState)
  }

  it('should create a PickedCardsHolderRenderer instance', () => {
    initializePickedCardsHolder()
    expect(pickedCardsHolderRenderer).toBeInstanceOf(PickedCardsHolderRenderer)
    expect(consoleTimeSpy).toHaveBeenCalledTimes(1)
    expect(consoleTimeEndSpy).toHaveBeenCalledTimes(1)
  })

  it('should throw an error if picked cards holder is not found', () => {
    document.body.innerHTML = ''
    expect(() => {
      new PickedCardsHolderRenderer(new GameState('multiplayer', 'river'))
    }).toThrowError('Picked cards holder not found')
  })

  it('should not render the card SVG overlay if the animal has no points', () => {
    initializePickedCardsHolder()
    const animalCard = new AnimalCard(animals.bee)
    animalCard.points.forEach(() => {
      animalCard.removeAnimalToken()
    })
    gameState.pickedCardsHolder.add(animalCard)
    pickedCardsHolderRenderer.render()
    const cardSVGOverlay = document.querySelector('.picked-cards-container .card-svg-overlay')
    expect(cardSVGOverlay).toBeNull()
  })

  it('should throw an error if the cancel card action button is not found after placing last animal token', () => {
    initializePickedCardsHolder()
    const animalCard = new AnimalCard(animals.bee)
    gameState.pickedCardsHolder.add(animalCard)
    pickedCardsHolderRenderer.render()
    gameState.notifyPlaceAnimalEnd(animalCard, new Hex(0, 0, 0))
    const actionButton = document.querySelector('.card-action-button')
    actionButton?.remove()
    expect(() => {
      gameState.notifyPlaceAnimalEnd(animalCard, new Hex(0, 0, 0))
    }).toThrowError('Card action button not found')
  })

  it('should throw an error if picked cards container is not found', () => {
    initializePickedCardsHolder()
    const pickedCardsHolder = document.querySelector('.picked-cards-holder')
    pickedCardsHolder?.remove()
    expect(() => {
      pickedCardsHolderRenderer.render()
    }).toThrowError('Picked cards container not found')
  })

  it('should render the initial picked cards holder with no cards', () => {
    initializePickedCardsHolder()
    pickedCardsHolderRenderer.render()
    const initialCards = document.querySelector('.picked-cards-container')
    expect(initialCards?.children).toHaveLength(0)
  })

  it('should render the picked cards holder with the correct number of cards', () => {
    initializePickedCardsHolder()
    for (let i = 0; i < PickedCardsHolder.MAX_PICKED_CARDS; i++) {
      gameState.pickedCardsHolder.add(new AnimalCard(animals.bee))
      pickedCardsHolderRenderer.render()
      const cards = document.querySelectorAll('.picked-cards-holder .animal-card')
      expect(cards).toHaveLength(i + 1)
    }
  })

  it('should not render the picked cards holder with more than the max allowed number of cards', () => {
    initializePickedCardsHolder()
    for (let i = 0; i < PickedCardsHolder.MAX_PICKED_CARDS + 1; i++) {
      gameState.pickedCardsHolder.add(new AnimalCard(animals.bee))
    }

    pickedCardsHolderRenderer.render()
    const cards = document.querySelector('.picked-cards-container')
    expect(cards?.children).toHaveLength(PickedCardsHolder.MAX_PICKED_CARDS)
  })

  it('should set the correct data-animal attribute for each card', () => {
    initializePickedCardsHolder()
    gameState.pickedCardsHolder.add(new AnimalCard(animals.bee))
    pickedCardsHolderRenderer.render()
    const card = document.querySelector('.picked-cards-holder .animal-card')
    expect(card?.getAttribute('data-card-name')).toBe(animals.bee.name)
  })

  it('should set the correct data-button-for attribute for each action button', () => {
    initializePickedCardsHolder()
    gameState.pickedCardsHolder.add(new AnimalCard(animals.bee))
    pickedCardsHolderRenderer.render()
    const actionButton = document.querySelector('.picked-cards-holder .card-action-button')
    expect(actionButton?.getAttribute('data-button-for')).toBe(animals.bee.name)
  })

  describe('animal placement', () => {
    it('should render the picked cards holder with the correct number of cards', () => {
      initializePickedCardsHolder()
      gameState.pickedCardsHolder.add(new AnimalCard(animals.bee))
      pickedCardsHolderRenderer.render()
      let cards = document.querySelectorAll('.picked-cards-holder .animal-card')
      expect(cards).toHaveLength(1)

      gameState.pickedCardsHolder.add(new AnimalCard(animals.eagle))
      gameState.notifyPickedCardsHolderUpdate()
      cards = document.querySelectorAll('.picked-cards-holder .animal-card')
      expect(cards).toHaveLength(2)
    })

    it('should remove the last cube token when the animal is placed', () => {
      initializePickedCardsHolder()
      gameState.pickedCardsHolder.add(new AnimalCard(animals.bee))
      pickedCardsHolderRenderer.render()
      const animalCard = gameState.pickedCardsHolder.pickedCards[0]
      let cubeTokens = document.querySelectorAll('.cube-token')
      const lastCubeToken = cubeTokens[cubeTokens.length - 1]
      expect(cubeTokens).toHaveLength(animalCard.points.length)

      gameState.notifyPlaceAnimalEnd(animalCard, new Hex(0, 0, 0))
      cubeTokens = document.querySelectorAll('.cube-token')
      expect(cubeTokens).toHaveLength(animalCard.points.length - 1)
      expect(cubeTokens).not.toContain(lastCubeToken)

      expect(consoleLogSpy).toHaveBeenCalledTimes(1)
    })

    it('should add the animal-card--completed class when the animal is placed', () => {
      initializePickedCardsHolder()
      gameState.pickedCardsHolder.add(new AnimalCard(animals.bee))
      pickedCardsHolderRenderer.render()
      let animalCardElement = document.querySelector('.picked-cards-container .animal-card')
      expect(animalCardElement?.classList).not.toContain('animal-card--completed')
      const animalCard = gameState.pickedCardsHolder.pickedCards[0]

      gameState.notifyPlaceAnimalStart(animalCard, [new Hex(0, 0, 0)])
      gameState.notifyPlaceAnimalEnd(animalCard, new Hex(0, 0, 0))
      animalCardElement = document.querySelector('.picked-cards-container .animal-card')
      expect(animalCardElement?.classList).not.toContain('animal-card--completed')

      gameState.notifyPlaceAnimalStart(animalCard, [new Hex(0, 0, 0)])
      gameState.notifyPlaceAnimalEnd(animalCard, new Hex(0, 0, 0))
      animalCardElement = document.querySelector('.picked-cards-container .animal-card')
      expect(animalCardElement?.classList).toContain('animal-card--completed')

      const cardSVGOverlay = document.querySelector('.picked-cards-container .card-svg-overlay')
      expect(cardSVGOverlay).toBeNull()
    })

    it('should remove the action button when the animal is placed', () => {
      initializePickedCardsHolder()
      gameState.pickedCardsHolder.add(new AnimalCard(animals.bee))
      pickedCardsHolderRenderer.render()
      const animalCard = gameState.pickedCardsHolder.pickedCards[0]
      gameState.notifyPlaceAnimalEnd(animalCard, new Hex(0, 0, 0))
      gameState.notifyPlaceAnimalEnd(animalCard, new Hex(0, 0, 0))
      const actionButton = document.querySelector('.card-action-button')
      expect(actionButton).toBeNull()
    })

    it('should render the cancel button when starting placement', () => {
      initializePickedCardsHolder()
      gameState.pickedCardsHolder.add(new AnimalCard(animals.bee))
      pickedCardsHolderRenderer.render()
      const animalCard = gameState.pickedCardsHolder.pickedCards[0]
      gameState.notifyPlaceAnimalStart(animalCard, [new Hex(0, 0, 0)])
      const actionButton = document.querySelector('.card-action-button')
      expect(actionButton?.getAttribute('data-state')).toBe('cancel')
    })

    it('should render the active button when placement is cancelled', () => {
      initializePickedCardsHolder()
      gameState.pickedCardsHolder.add(new AnimalCard(animals.bee))
      pickedCardsHolderRenderer.render()
      const animalCard = gameState.pickedCardsHolder.pickedCards[0]

      gameState.notifyPlaceAnimalStart(animalCard, [new Hex(0, 0, 0)])
      let actionButton = document.querySelector('.card-action-button')
      expect(actionButton?.getAttribute('data-state')).toBe('cancel')

      gameState.notifyPlaceAnimalCancel(animalCard)
      actionButton = document.querySelector('.card-action-button')
      expect(actionButton?.getAttribute('data-state')).toBe('active')
    })

    it('should throw an error if the card action button is not found', () => {
      initializePickedCardsHolder()
      gameState.pickedCardsHolder.add(new AnimalCard(animals.bee))
      pickedCardsHolderRenderer.render()
      const animalCard = gameState.pickedCardsHolder.pickedCards[0]
      let actionButton = document.querySelector('.card-action-button')
      actionButton?.remove()
      expect(() => {
        gameState.notifyPlaceAnimalStart(animalCard, [])
      }).toThrowError('Card action button not found')
      actionButton = document.querySelector('.card-action-button')
      actionButton?.remove()
      expect(() => {
        gameState.notifyPlaceAnimalCancel(animalCard)
      }).toThrowError('Card action button not found')
      actionButton = document.querySelector('.card-action-button')
      actionButton?.remove()
      expect(() => {
        gameState.notifyPlaceAnimalEnd(animalCard, new Hex(0, 0, 0))
      }).toThrowError('Card action button not found')
    })

    it('should throw an error if the card image is not found', () => {
      initializePickedCardsHolder()
      gameState.pickedCardsHolder.add(new AnimalCard(animals.bee))
      pickedCardsHolderRenderer.render()
      const animalCard = gameState.pickedCardsHolder.pickedCards[0]
      gameState.notifyPlaceAnimalEnd(animalCard, new Hex(0, 0, 0))
      const img = document.querySelector('.picked-cards-container .animal-card')
      img?.remove()
      expect(() => {
        gameState.notifyPlaceAnimalEnd(animalCard, new Hex(0, 0, 0))
      }).toThrowError('Card image not found')
    })
  })
})

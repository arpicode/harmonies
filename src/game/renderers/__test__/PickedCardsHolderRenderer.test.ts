import { dom } from '../../../dom'
import GameState, { RendererEvent } from '../../GameState'
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

  it('should throw an error if picked cards wrapper is not found', () => {
    document.body.innerHTML = ''
    expect(() => {
      new PickedCardsHolderRenderer(new GameState('multiplayer', 'river'))
    }).toThrowError('Picked cards wrapper not found')
  })

  it('should throw an error if completed cards wrapper is not found', () => {
    initializePickedCardsHolder()
    const completedCardsWrapper = document.querySelector('.completed-cards-wrapper')
    completedCardsWrapper?.remove()
    expect(() => {
      pickedCardsHolderRenderer.render()
    }).toThrowError('Completed cards wrapper not found')
  })

  it('should not render the card SVG overlay if the animal has no points', () => {
    initializePickedCardsHolder()
    const animalCard = new AnimalCard(animals.bee)
    animalCard.points.forEach(() => {
      animalCard.removeAnimalToken()
    })
    gameState.pickedCardsHolder.add(animalCard)
    pickedCardsHolderRenderer.render()
    const cardSVGOverlay = document.querySelector('.picked-cards-wrapper .card-svg-overlay')
    expect(cardSVGOverlay).toBeNull()
  })

  it('should throw an error when picked cards wrapper is not found after initialization', () => {
    initializePickedCardsHolder()
    const pickedCardsHolder = document.querySelector('.picked-cards-wrapper')
    pickedCardsHolder?.remove()
    expect(() => {
      pickedCardsHolderRenderer.render()
    }).toThrowError('Picked cards wrapper not found')
  })

  it('should render the initial picked cards wrapper with no cards', () => {
    initializePickedCardsHolder()
    pickedCardsHolderRenderer.render()
    const initialCards = document.querySelector('.picked-cards-wrapper')
    expect(initialCards?.children).toHaveLength(0)
  })

  it('should render the initial completed cards wrapper with no cards', () => {
    initializePickedCardsHolder()
    pickedCardsHolderRenderer.render()
    const initialCards = document.querySelector('.completed-cards-wrapper')
    expect(initialCards?.children).toHaveLength(0)
  })

  it('should render the picked cards wrapper with the correct number of cards', () => {
    initializePickedCardsHolder()
    for (let i = 0; i < PickedCardsHolder.MAX_PICKED_CARDS; i++) {
      gameState.pickedCardsHolder.add(new AnimalCard(animals.bee))
      pickedCardsHolderRenderer.render()
      const cards = document.querySelectorAll('.picked-cards-wrapper .animal-card')
      expect(cards).toHaveLength(i + 1)
    }
  })

  it('should render the completed cards wrapper with the correct number of cards', () => {
    initializePickedCardsHolder()
    const beeCard = new AnimalCard(animals.bee)
    beeCard.points.forEach(() => {
      beeCard.removeAnimalToken()
    })
    const eagleCard = new AnimalCard(animals.eagle)
    eagleCard.points.forEach(() => {
      eagleCard.removeAnimalToken()
    })
    gameState.pickedCardsHolder.add(beeCard)
    gameState.pickedCardsHolder.add(eagleCard)
    pickedCardsHolderRenderer.render()
    let cards = document.querySelectorAll('.picked-cards-wrapper .animal-card')
    expect(cards).toHaveLength(2)

    gameState.pickedCardsHolder.transferCompletedCards()
    pickedCardsHolderRenderer.render()
    cards = document.querySelectorAll('.picked-cards-wrapper .animal-card')
    expect(cards).toHaveLength(0)

    const completedCards = document.querySelectorAll('.completed-cards-wrapper .animal-card')
    expect(completedCards).toHaveLength(2)
    completedCards.forEach((card, index) => {
      expect(card.classList).toContain('completed-card')
      expect(card.classList).toContain(`card-${index + 1}`)
    })
  })

  it('should not render the picked cards wrapper with more than the max allowed number of cards', () => {
    initializePickedCardsHolder()
    for (let i = 0; i < PickedCardsHolder.MAX_PICKED_CARDS + 1; i++) {
      gameState.pickedCardsHolder.add(new AnimalCard(animals.bee))
    }

    pickedCardsHolderRenderer.render()
    const cards = document.querySelector('.picked-cards-wrapper')
    expect(cards?.children).toHaveLength(PickedCardsHolder.MAX_PICKED_CARDS)
  })

  it('should set the correct data-animal attribute for each card', () => {
    initializePickedCardsHolder()
    gameState.pickedCardsHolder.add(new AnimalCard(animals.bee))
    pickedCardsHolderRenderer.render()
    const card = document.querySelector('.picked-cards-wrapper .animal-card')
    expect(card?.getAttribute('data-card-name')).toBe(animals.bee.name)
  })

  it('should set the correct data-button-for attribute for each action button', () => {
    initializePickedCardsHolder()
    gameState.pickedCardsHolder.add(new AnimalCard(animals.bee))
    pickedCardsHolderRenderer.render()
    const actionButton = document.querySelector('.picked-cards-wrapper .card-action-button')
    expect(actionButton?.getAttribute('data-button-for')).toBe(animals.bee.name)
  })

  describe('animal placement', () => {
    it('should render the picked cards wrapper with the correct number of cards', () => {
      initializePickedCardsHolder()
      gameState.pickedCardsHolder.add(new AnimalCard(animals.bee))
      pickedCardsHolderRenderer.render()
      let cards = document.querySelectorAll('.picked-cards-wrapper .animal-card')
      expect(cards).toHaveLength(1)

      gameState.pickedCardsHolder.add(new AnimalCard(animals.eagle))
      gameState.emit(RendererEvent.PICKED_CARDS_HOLDER_UPDATED)
      cards = document.querySelectorAll('.picked-cards-wrapper .animal-card')
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

      gameState.emit(RendererEvent.PLACE_ANIMAL_END, animalCard, new Hex(0, 0, 0))
      cubeTokens = document.querySelectorAll('.cube-token')
      expect(cubeTokens).toHaveLength(animalCard.points.length - 1)
      expect(cubeTokens).not.toContain(lastCubeToken)

      expect(consoleLogSpy).toHaveBeenCalledTimes(1)
    })

    it('should add the completed-card class when the animal is placed', () => {
      initializePickedCardsHolder()
      gameState.pickedCardsHolder.add(new AnimalCard(animals.bee))
      pickedCardsHolderRenderer.render()
      let animalCardElement = document.querySelector('.picked-cards-wrapper .animal-card')
      expect(animalCardElement?.classList).not.toContain('completed-card')
      const animalCard = gameState.pickedCardsHolder.pickedCards[0]

      gameState.emit(RendererEvent.PLACE_ANIMAL_START, animalCard, [new Hex(0, 0, 0)])
      gameState.emit(RendererEvent.PLACE_ANIMAL_END, animalCard, new Hex(0, 0, 0))
      animalCardElement = document.querySelector('.picked-cards-wrapper .animal-card')
      expect(animalCardElement).not.toBeNull()
      expect(animalCardElement?.classList).not.toContain('completed-card')

      gameState.emit(RendererEvent.PLACE_ANIMAL_START, animalCard, [new Hex(0, 0, 0)])
      gameState.emit(RendererEvent.PLACE_ANIMAL_END, animalCard, new Hex(0, 0, 0))
      animalCardElement = document.querySelector('.completed-cards-wrapper .animal-card')
      expect(animalCardElement?.classList).toContain('completed-card')
      animalCardElement = document.querySelector('.picked-cards-wrapper .animal-card')
      expect(animalCardElement).toBeNull()

      const cardSVGOverlay = document.querySelector('.completed-cards-wrapper .card-svg-overlay')
      expect(cardSVGOverlay).toBeNull()
    })

    it('should remove the action button when the animal is placed', () => {
      initializePickedCardsHolder()
      gameState.pickedCardsHolder.add(new AnimalCard(animals.bee))
      pickedCardsHolderRenderer.render()
      const animalCard = gameState.pickedCardsHolder.pickedCards[0]
      gameState.emit(RendererEvent.PLACE_ANIMAL_END, animalCard, new Hex(0, 0, 0))
      gameState.emit(RendererEvent.PLACE_ANIMAL_END, animalCard, new Hex(0, 0, 0))
      const actionButton = document.querySelector('.card-action-button')
      expect(actionButton).toBeNull()
    })

    it('should render the cancel button when starting placement', () => {
      initializePickedCardsHolder()
      gameState.pickedCardsHolder.add(new AnimalCard(animals.bee))
      pickedCardsHolderRenderer.render()
      const animalCard = gameState.pickedCardsHolder.pickedCards[0]
      gameState.emit(RendererEvent.PLACE_ANIMAL_START, animalCard, [new Hex(0, 0, 0)])
      const actionButton = document.querySelector('.card-action-button')
      expect(actionButton?.getAttribute('data-state')).toBe('cancel')
    })

    it('should render the active button when placement is cancelled', () => {
      initializePickedCardsHolder()
      gameState.pickedCardsHolder.add(new AnimalCard(animals.bee))
      pickedCardsHolderRenderer.render()
      const animalCard = gameState.pickedCardsHolder.pickedCards[0]

      gameState.emit(RendererEvent.PLACE_ANIMAL_START, animalCard, [new Hex(0, 0, 0)])
      let actionButton = document.querySelector('.card-action-button')
      expect(actionButton?.getAttribute('data-state')).toBe('cancel')

      gameState.emit(RendererEvent.PLACE_ANIMAL_CANCEL, animalCard)
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
        gameState.emit(RendererEvent.PLACE_ANIMAL_START, animalCard, [])
      }).toThrowError('Card action button not found')
      actionButton = document.querySelector('.card-action-button')
      actionButton?.remove()
      expect(() => {
        gameState.emit(RendererEvent.PLACE_ANIMAL_CANCEL, animalCard)
      }).toThrowError('Card action button not found')
      actionButton = document.querySelector('.card-action-button')
      actionButton?.remove()
      expect(() => {
        gameState.emit(RendererEvent.PLACE_ANIMAL_END, animalCard, new Hex(0, 0, 0))
      }).toThrowError('Card action button not found')
    })

    it('should throw an error if the card image is not found', () => {
      initializePickedCardsHolder()
      gameState.pickedCardsHolder.add(new AnimalCard(animals.bee))
      pickedCardsHolderRenderer.render()
      const animalCard = gameState.pickedCardsHolder.pickedCards[0]
      gameState.emit(RendererEvent.PLACE_ANIMAL_END, animalCard, new Hex(0, 0, 0))
      const img = document.querySelector('.picked-cards-wrapper .animal-card')
      img?.remove()
      expect(() => {
        gameState.emit(RendererEvent.PLACE_ANIMAL_END, animalCard, new Hex(0, 0, 0))
      }).toThrowError('Card image not found')
    })

    it('should throw while moving a completed card when the completed cards wrapper is not found', () => {
      initializePickedCardsHolder()
      const beeCard = new AnimalCard(animals.bee)
      // remove all but 1 point
      beeCard.points.forEach((_, index) => {
        if (index === beeCard.points.length - 1) return
        beeCard.removeAnimalToken()
      })
      gameState.pickedCardsHolder.add(beeCard)
      pickedCardsHolderRenderer.render()
      const animalCard = gameState.pickedCardsHolder.pickedCards[0]
      const completedCardsWrapper = document.querySelector('.completed-cards-wrapper')
      completedCardsWrapper?.remove()
      expect(() => {
        gameState.emit(RendererEvent.PLACE_ANIMAL_END, animalCard, new Hex(0, 0, 0))
      }).toThrowError('Completed cards wrapper not found')
    })

    it('should throw while moving a completed card when the animal card element is not found', () => {
      initializePickedCardsHolder()
      const beeCard = new AnimalCard(animals.bee)
      // remove all but 1 point
      beeCard.points.forEach((_, index) => {
        if (index === beeCard.points.length - 1) return
        beeCard.removeAnimalToken()
      })
      gameState.pickedCardsHolder.add(beeCard)
      pickedCardsHolderRenderer.render()
      const animalCard = gameState.pickedCardsHolder.pickedCards[0]
      const animalCardElement = document.querySelector('.animal-card')
      animalCardElement?.remove()
      expect(() => {
        gameState.emit(RendererEvent.PLACE_ANIMAL_END, animalCard, new Hex(0, 0, 0))
      }).toThrowError('Card image not found')
    })
  })
})

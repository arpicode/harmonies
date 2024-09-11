import { dom } from '../../../dom'
import GameState from '../../GameState'
import PickedCardsHolderRenderer from '../PickedCardsHolderRenderer'

import animalsJson from '../../../animals.json'
import AnimalCard, { IAnimalCards } from '../../../board/AnimalCard'
import PickedCardsHolder from '../../../board/PickedCardsHolder'
const animals = animalsJson as IAnimalCards

describe('PickedCardsHolderRenderer', () => {
  let pickedCardsHolderRenderer: PickedCardsHolderRenderer
  let gameState: GameState
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
})

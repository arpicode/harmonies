/* eslint-disable @typescript-eslint/no-non-null-assertion */
import GameState from '~/game/GameState'
import PickedCardsHolderInputHandler, { PickedCardsHolderSelector } from '../PickedCardsHolderInputHandler'
import PickedCardsHolderRenderer from '~/game/renderers/PickedCardsHolderRenderer'
import { dom } from '~/dom'
import { createEventWithTarget } from '~/test-utils/test-utils'

import animalsJson from '../../../animals.json'
import AnimalCard, { IAnimalCards } from '~/board/AnimalCard'
import Token, { TokenType } from '~/board/Token'
const animals = animalsJson as IAnimalCards

function setupBeeOnHexboard(gameState: GameState) {
  const treeHex = gameState.hexBoard.getHex(0, 1)
  treeHex?.tokens.push(new Token(TokenType.Brown))
  treeHex?.tokens.push(new Token(TokenType.Green))
  const fieldHex1 = gameState.hexBoard.getHex(1, 0)
  fieldHex1?.tokens.push(new Token(TokenType.Yellow))
  const fieldHex2 = gameState.hexBoard.getHex(1, 1)
  fieldHex2?.tokens.push(new Token(TokenType.Yellow))
  const fieldHex3 = gameState.hexBoard.getHex(0, 2)
  fieldHex3?.tokens.push(new Token(TokenType.Yellow))
}

describe('PickedCardsHolderInputHandler', () => {
  document.body.innerHTML = ''
  let gameState: GameState
  let pickedCardsHolderInputHandler: PickedCardsHolderInputHandler
  let pickedCardsHolderRenderer: PickedCardsHolderRenderer

  const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(vi.fn())
  const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(vi.fn())

  beforeEach(() => {
    document.body.innerHTML = dom
    gameState = new GameState('multiplayer', 'river')
    pickedCardsHolderRenderer = new PickedCardsHolderRenderer(gameState)
    pickedCardsHolderInputHandler = new PickedCardsHolderInputHandler(gameState)
    pickedCardsHolderRenderer.render()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should throw an error if the picked cards holder is not found', () => {
    document.body.innerHTML = ''
    expect(() => (pickedCardsHolderInputHandler = new PickedCardsHolderInputHandler(gameState))).toThrow(
      `Element with selector "${PickedCardsHolderSelector.PICKED_CARDS_HOLDER}" not found`
    )
  })

  it('should initialize picked cards holder input handler', () => {
    pickedCardsHolderInputHandler.initialize()
    expect(consoleLogSpy).toHaveBeenCalledTimes(2)
  })

  it('should handle click event outside a picked card', () => {
    pickedCardsHolderInputHandler.initialize()

    const pickedCardsHolderElement: HTMLDivElement = document.querySelector(
      PickedCardsHolderSelector.PICKED_CARDS_HOLDER
    )!
    expect(pickedCardsHolderElement).not.toBeNull()

    const clickEvent = createEventWithTarget('click', pickedCardsHolderElement)

    pickedCardsHolderElement.dispatchEvent(clickEvent)
    expect(gameState.pickedCardsHolder.pickedCards.length).toBe(0)
  })

  it('should handle click event on an active card action button when no animal pattern found', () => {
    const animalCard = new AnimalCard(animals.bee)
    gameState.pickedCardsHolder.add(animalCard)
    pickedCardsHolderRenderer.render()
    pickedCardsHolderInputHandler.initialize()

    const activeBtn = document.querySelector(`[data-button-for="${animalCard.name}"]`)!
    expect(activeBtn).not.toBeNull()

    expect(gameState.pickedCardsHolder.pickedCards.length).toBe(1)

    const clickEvent = createEventWithTarget('click', activeBtn)

    activeBtn.dispatchEvent(clickEvent)
    expect(gameState.pickedCardsHolder.pickedCards.length).toBe(1)
    expect(consoleLogSpy).toHaveBeenCalledWith(
      '%c[Info] %cNo animal spawn hexes found',
      'color: #2cc2e8;',
      'color: #8ecfe0;'
    )
    expect(activeBtn.getAttribute('data-state')).toBe('active')
  })

  it('should handle click event on an active card action button when animal pattern found', () => {
    setupBeeOnHexboard(gameState)

    const animalCard = new AnimalCard(animals.bee)
    gameState.pickedCardsHolder.add(animalCard)
    const otherAnimalCard = new AnimalCard(animals.eagle)
    gameState.pickedCardsHolder.add(otherAnimalCard)
    pickedCardsHolderRenderer.render()
    pickedCardsHolderInputHandler.initialize()

    const activeBtn = document.querySelector(`[data-button-for="${animalCard.name}"]`)!
    const otherActiveBtn = document.querySelector(`[data-button-for="${otherAnimalCard.name}"]`)!
    expect(activeBtn).not.toBeNull()
    expect(otherActiveBtn).not.toBeNull()
    expect(activeBtn.getAttribute('data-state')).toBe('active')
    expect(otherActiveBtn.getAttribute('data-state')).toBe('active')
    expect(gameState.pickedCardsHolder.pickedCards.length).toBe(2)

    const clickEvent = createEventWithTarget('click', activeBtn)

    activeBtn.dispatchEvent(clickEvent)
    expect(gameState.pickedCardsHolder.pickedCards.length).toBe(2)
    expect(activeBtn.getAttribute('data-state')).toBe('cancel')
    expect(otherActiveBtn.getAttribute('data-state')).toBe('active')
  })

  it('should handle click event on a cancel card action button', () => {
    setupBeeOnHexboard(gameState)

    const animalCard = new AnimalCard(animals.bee)
    gameState.pickedCardsHolder.add(animalCard)
    pickedCardsHolderRenderer.render()
    pickedCardsHolderInputHandler.initialize()

    const activeBtn = document.querySelector(`[data-button-for="${animalCard.name}"]`)!
    expect(activeBtn).not.toBeNull()
    expect(activeBtn.getAttribute('data-state')).toBe('active')
    expect(gameState.pickedCardsHolder.pickedCards.length).toBe(1)

    const clickEvent = createEventWithTarget('click', activeBtn)

    activeBtn.dispatchEvent(clickEvent)
    expect(gameState.pickedCardsHolder.pickedCards.length).toBe(1)
    expect(activeBtn.getAttribute('data-state')).toBe('cancel')

    activeBtn.dispatchEvent(clickEvent)
    expect(gameState.pickedCardsHolder.pickedCards.length).toBe(1)
    expect(activeBtn.getAttribute('data-state')).toBe('active')
  })

  it('should handle click event on a active button when there is a cancel button', () => {
    setupBeeOnHexboard(gameState)

    const animalCard = new AnimalCard(animals.bee)
    gameState.pickedCardsHolder.add(animalCard)
    const otherAnimalCard = new AnimalCard(animals.eagle)
    gameState.pickedCardsHolder.add(otherAnimalCard)
    pickedCardsHolderRenderer.render()
    pickedCardsHolderInputHandler.initialize()

    const cancelBtn = document.querySelector(`[data-button-for="${animalCard.name}"]`)!
    const otherActiveBtn = document.querySelector(`[data-button-for="${otherAnimalCard.name}"]`)!
    expect(cancelBtn).not.toBeNull()
    expect(otherActiveBtn).not.toBeNull()
    expect(cancelBtn.getAttribute('data-state')).toBe('active')
    expect(otherActiveBtn.getAttribute('data-state')).toBe('active')
    expect(gameState.pickedCardsHolder.pickedCards.length).toBe(2)

    const cancelButtonClickEvent = createEventWithTarget('click', cancelBtn)
    const otherActiveButtonClickEvent = createEventWithTarget('click', otherActiveBtn)

    cancelBtn.dispatchEvent(cancelButtonClickEvent)
    expect(gameState.pickedCardsHolder.pickedCards.length).toBe(2)
    expect(cancelBtn.getAttribute('data-state')).toBe('cancel')
    expect(otherActiveBtn.getAttribute('data-state')).toBe('active')

    otherActiveBtn.dispatchEvent(otherActiveButtonClickEvent)
    expect(gameState.pickedCardsHolder.pickedCards.length).toBe(2)
    expect(cancelBtn.getAttribute('data-state')).toBe('cancel')
    expect(otherActiveBtn.getAttribute('data-state')).toBe('active')
  })

  it('should throw an error if animal card not found', () => {
    setupBeeOnHexboard(gameState)

    const animalCard = new AnimalCard(animals.bee)
    gameState.pickedCardsHolder.add(animalCard)
    pickedCardsHolderRenderer.render()
    pickedCardsHolderInputHandler.initialize()

    const activeBtn = document.querySelector(`[data-button-for="${animalCard.name}"]`)!
    activeBtn.setAttribute('data-button-for', 'not-found')
    expect(activeBtn).not.toBeNull()
    expect(activeBtn.getAttribute('data-state')).toBe('active')
    expect(gameState.pickedCardsHolder.pickedCards.length).toBe(1)

    const clickEvent = createEventWithTarget('click', activeBtn)
    activeBtn.dispatchEvent(clickEvent)
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '%c[InvalidDOM] %cInvalid data-button-for',
      'color: #ff4d4f;',
      'color: #ff7a45;'
    )
  })
})

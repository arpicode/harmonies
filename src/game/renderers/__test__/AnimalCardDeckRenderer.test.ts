import AnimalCardDeck from '../../../board/AnimalCardDeck'
import { dom } from '../../../dom'
import GameState from '../../GameState'
import AnimalCardDeckRenderer from '../AnimalCardDeckRenderer'

describe('AnimalCardDeckRenderer', () => {
  let animalCardDeckRenderer: AnimalCardDeckRenderer
  let gameState: GameState
  const consoleTimeSpy = vi.spyOn(console, 'time').mockImplementation(vi.fn())
  const consoleTimeEndSpy = vi.spyOn(console, 'timeEnd').mockImplementation(vi.fn())

  afterEach(() => {
    vi.clearAllMocks()
  })

  const initializeDraftTable = (): void => {
    document.body.innerHTML = dom
    gameState = new GameState('multiplayer', 'river')
    animalCardDeckRenderer = new AnimalCardDeckRenderer(gameState)
  }

  it('should create a DraftTableRenderer instance', () => {
    initializeDraftTable()
    expect(animalCardDeckRenderer).toBeInstanceOf(AnimalCardDeckRenderer)
    expect(consoleTimeSpy).toHaveBeenCalledTimes(1)
    expect(consoleTimeEndSpy).toHaveBeenCalledTimes(1)
  })

  it('should throw an error if animal cards modal is not found', () => {
    document.body.innerHTML = ''
    expect(() => {
      new AnimalCardDeckRenderer(new GameState('multiplayer', 'river'))
    }).toThrowError('Animal deck modal not found')
  })

  it('should render the initial animal cards', () => {
    initializeDraftTable()
    animalCardDeckRenderer.render()
    const initialCards = document.querySelector('.animal-cards-container')
    expect(initialCards?.children).toHaveLength(AnimalCardDeck.MAX_DRAWN_CARDS)
  })

  it('should not re-render the same animal cards', () => {
    initializeDraftTable()
    animalCardDeckRenderer.render()
    const initialCards = document.querySelectorAll('.animal-cards-container .animal-card')
    animalCardDeckRenderer.render()
    const reRenderedCards = document.querySelectorAll('.animal-cards-container .animal-card')
    expect(initialCards).toHaveLength(AnimalCardDeck.MAX_DRAWN_CARDS)
    expect(reRenderedCards).toHaveLength(AnimalCardDeck.MAX_DRAWN_CARDS)

    const initialCardNames = Array.from(initialCards).map((card) => card.getAttribute('alt'))
    const reRenderedCardNames = Array.from(reRenderedCards).map((card) => card.getAttribute('alt'))
    expect(initialCardNames).toEqual(reRenderedCardNames)
  })

  it('should throw an error if animal cards container is not found', () => {
    initializeDraftTable()
    document.querySelector('.animal-cards-container')?.classList.remove('animal-cards-container')
    expect(() => {
      animalCardDeckRenderer.render()
    }).toThrowError('Animal cards container not found')
  })

  it('should render the card picker', () => {
    initializeDraftTable()
    animalCardDeckRenderer.render()
    const cardPicker = document.querySelector('.card-picker')
    expect(cardPicker).not.toBeNull()
  })

  it('should render the buttons', () => {
    initializeDraftTable()
    animalCardDeckRenderer.render()
    const buttons = document.querySelectorAll('.animal-deck-modal button')
    expect(buttons).toHaveLength(3)
  })
})

import AnimalCard, { IAnimal } from '~/board/AnimalCard'
import AnimalCardDeck from '../../../board/AnimalCardDeck'
import { dom } from '../../../dom'
import GameState from '../../GameState'
import AnimalCardDeckRenderer from '../AnimalCardDeckRenderer'
import PickedCardsHolderRenderer from '../PickedCardsHolderRenderer'

describe('AnimalCardDeckRenderer', () => {
  let animalCardDeckRenderer: AnimalCardDeckRenderer
  let gameState: GameState
  const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(vi.fn())
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

  it('should render the initial animal cards with their wrappers', () => {
    initializeDraftTable()
    animalCardDeckRenderer.render()
    const initialCardWrappers = document.querySelectorAll('.card-wrapper')
    expect(initialCardWrappers).toHaveLength(AnimalCardDeck.MAX_DRAWN_CARDS)
    initialCardWrappers.forEach((wrapper) => {
      expect(wrapper.querySelector('.animal-card')).not.toBeNull()
    })
  })

  it('should not re-render the same animal cards', () => {
    initializeDraftTable()
    animalCardDeckRenderer.render()
    const initialCards = document.querySelectorAll('.cards-wrapper .animal-card')
    animalCardDeckRenderer.render()
    const reRenderedCards = document.querySelectorAll('.cards-wrapper .animal-card')
    expect(initialCards).toHaveLength(AnimalCardDeck.MAX_DRAWN_CARDS)
    expect(reRenderedCards).toHaveLength(AnimalCardDeck.MAX_DRAWN_CARDS)

    const initialCardNames = Array.from(initialCards).map((card) => card.getAttribute('alt'))
    const reRenderedCardNames = Array.from(reRenderedCards).map((card) => card.getAttribute('alt'))
    expect(initialCardNames).toEqual(reRenderedCardNames)
  })

  it('should throw an error if animal cards container is not found', () => {
    initializeDraftTable()
    document.querySelector('.cards-wrapper')?.classList.remove('cards-wrapper')
    expect(() => {
      animalCardDeckRenderer.render()
    }).toThrowError('Animal cards wrapper not found')
  })

  it('should render the card picker', () => {
    initializeDraftTable()
    animalCardDeckRenderer.render()
    const cardPicker = document.querySelector('.card-picker')
    expect(cardPicker).not.toBeNull()
  })

  it('should throw an error if card picker is not found', () => {
    initializeDraftTable()
    document.querySelector('.card-picker')?.remove()
    expect(() => {
      animalCardDeckRenderer.render()
    }).toThrowError('Card picker not found')
  })

  it('should render the buttons for a multiplayer game', () => {
    initializeDraftTable()
    animalCardDeckRenderer.render()
    const buttons = document.querySelectorAll('.animal-deck-modal button')
    expect(buttons).toHaveLength(3)
  })

  it('should render the buttons for a solo game', () => {
    document.body.innerHTML = dom
    gameState = new GameState('solo', 'river')
    animalCardDeckRenderer = new AnimalCardDeckRenderer(gameState)
    animalCardDeckRenderer.render()
    const buttons = document.querySelectorAll('.animal-deck-modal button')
    expect(buttons).toHaveLength(4)
  })

  describe('hex board clone', () => {
    it('should render the hex board clone when the animal deck modal is open', () => {
      initializeDraftTable()
      animalCardDeckRenderer.render()
      gameState.emit('animalDeckOpened')
      const hexBoardClone = document.querySelector('.hex-board-wrapper-clone')
      expect(hexBoardClone).not.toBeNull()
    })

    it('should not render the hex board clone when the animal deck modal is closed', () => {
      initializeDraftTable()
      animalCardDeckRenderer.render()
      const hexBoardClone = document.querySelector('.hex-board-wrapper-clone')
      expect(hexBoardClone).toBeNull()
    })

    it('should throw an error when the original hex board is not found', () => {
      initializeDraftTable()
      animalCardDeckRenderer.render()
      document.querySelector('.hex-board-wrapper')?.remove()
      expect(() => {
        gameState.emit('animalDeckOpened')
      }).toThrowError('Board not found')
    })

    it('should remove the hex board clone when the animal deck modal is closed', () => {
      initializeDraftTable()
      animalCardDeckRenderer.render()
      gameState.emit('animalDeckOpened')
      let hexBoardClone = document.querySelector('.hex-board-wrapper-clone')
      expect(hexBoardClone).not.toBeNull()

      gameState.emit('animalDeckClosed')
      hexBoardClone = document.querySelector('.hex-board-wrapper-clone')
      expect(hexBoardClone).toBeNull()
    })
  })

  it('should render the draft table clone when the animal deck modal is open', () => {
    initializeDraftTable()
    animalCardDeckRenderer.render()
    gameState.emit('animalDeckOpened')
    const draftTableClone = document.querySelector('.draft-table-clone')
    expect(draftTableClone).not.toBeNull()
  })

  it('should not render the draft table clone when the animal deck modal is closed', () => {
    initializeDraftTable()
    animalCardDeckRenderer.render()
    const draftTableClone = document.querySelector('.draft-table-clone')
    expect(draftTableClone).toBeNull()
  })

  describe('draft table clone', () => {
    it('should throw an error when the original draft table is not found', () => {
      initializeDraftTable()
      animalCardDeckRenderer.render()
      document.querySelector('.draft-table-wrapper')?.remove()
      expect(() => {
        gameState.emit('animalDeckOpened')
      }).toThrowError('Draft table not found')
    })

    it('should remove the draft table clone when the animal deck modal is closed', () => {
      initializeDraftTable()
      animalCardDeckRenderer.render()
      gameState.emit('animalDeckOpened')
      let draftTableClone = document.querySelector('.draft-table-clone')
      expect(draftTableClone).not.toBeNull()

      gameState.emit('animalDeckClosed')
      draftTableClone = document.querySelector('.draft-table-clone')
      expect(draftTableClone).toBeNull()

      expect(consoleLogSpy).toHaveBeenNthCalledWith(
        2,
        expect.stringMatching(/\[EventEmitter\]/),
        expect.stringMatching(/color:/),
        expect.stringMatching(/color:/)
      )
    })
  })

  describe('animal cards clone', () => {
    it('should render the animal cards clone when the animal deck modal is open', () => {
      initializeDraftTable()
      const pickedCardsHolderRenderer = new PickedCardsHolderRenderer(gameState)
      pickedCardsHolderRenderer.render()
      gameState.pickedCardsHolder.pickedCards.push(
        new AnimalCard(
          JSON.parse(`{
                        "name": "eagle",
                        "ecosystem": "Mountain",
                        "image": "animals/eagle.webp",
                        "points": [11, 5],
                        "pattern": [
                          {
                            "q": 0,
                            "r": 0,
                            "tokenTypes": ["Mountain", "Mountain", "Mountain"],
                            "isSpawn": true
                          },
                          {
                            "q": -1,
                            "r": 0,
                            "tokenTypes": ["Field"]
                            }
                        ]
                      }`) as IAnimal
        )
      )
      gameState.emit('pickedCardsHolderUpdated')
      const pickedCards = document.querySelectorAll('.picked-cards-wrapper .animal-card')
      expect(pickedCards).toHaveLength(1)
      gameState.emit('animalDeckOpened')

      const animalCardsCloneWrapper = document.querySelector('.animal-cards-clone-wrapper')
      expect(animalCardsCloneWrapper).not.toBeNull()

      const animalCardsClone = animalCardsCloneWrapper?.querySelectorAll('.animal-card')
      expect(animalCardsClone).toHaveLength(1)
    })

    it('should not render the animal cards clone when the animal deck modal is closed', () => {
      initializeDraftTable()
      animalCardDeckRenderer.render()
      const animalCardsCloneWrapper = document.querySelector('.animal-cards-clone-wrapper')
      expect(animalCardsCloneWrapper).toBeNull()
    })

    it('should remove the animal cards clone when the animal deck modal is closed', () => {
      initializeDraftTable()
      animalCardDeckRenderer.render()
      gameState.emit('animalDeckOpened')
      let animalCardsCloneWrapper = document.querySelector('.animal-cards-clone-wrapper')
      expect(animalCardsCloneWrapper).not.toBeNull()

      gameState.emit('animalDeckClosed')
      animalCardsCloneWrapper = document.querySelector('.animal-cards-clone-wrapper')
      expect(animalCardsCloneWrapper).toBeNull()
    })
  })
})

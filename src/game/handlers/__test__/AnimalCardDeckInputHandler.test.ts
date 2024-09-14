/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { MockInstance } from 'vitest'
import { createEventWithTarget } from '~/test-utils/test-utils'
import { dom } from '~/dom'
import GameState from '~/game/GameState'
import AnimalCardDeckInputHandler, { AnimalCardDeckSelectors } from '../AnimalCardDeckInputHandler'
import AnimalCardDeckRenderer from '~/game/renderers/AnimalCardDeckRenderer'

describe('AnimalCardDeckInputHandler', () => {
  document.body.innerHTML = ''
  let gameState: GameState
  let animalCardDeckInputHandler: AnimalCardDeckInputHandler
  let animalCardDeckRenderer: AnimalCardDeckRenderer

  const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(vi.fn())
  const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(vi.fn())

  const openModal = () => {
    const animalCardDeckElement: HTMLDialogElement | null = document.querySelector(
      AnimalCardDeckSelectors.ANIMAL_DECK_MODAL
    )
    const showButton: HTMLButtonElement | null = document.querySelector(AnimalCardDeckSelectors.SHOW_BUTTON)

    const btnClickEvent = createEventWithTarget('click', showButton!)
    showButton?.dispatchEvent(btnClickEvent)
    return animalCardDeckElement
  }

  beforeEach(() => {
    document.body.innerHTML = dom
    gameState = new GameState('multiplayer', 'river')
    animalCardDeckRenderer = new AnimalCardDeckRenderer(gameState)
    animalCardDeckRenderer.render()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('constructor', () => {
    it('should initialize the animal card deck input handler', () => {
      expect(() => (animalCardDeckInputHandler = new AnimalCardDeckInputHandler(gameState))).not.toThrow()
      expect(animalCardDeckInputHandler).toBeDefined()
      expect(animalCardDeckInputHandler).toBeInstanceOf(AnimalCardDeckInputHandler)
      expect(consoleLogSpy).toHaveBeenCalledTimes(2)
    })

    it.each`
      selector                                          | className
      ${AnimalCardDeckSelectors.ANIMAL_DECK_MODAL}      | ${'animal-deck-modal'}
      ${AnimalCardDeckSelectors.ANIMAL_CARDS_CONTAINER} | ${'animal-cards-container'}
      ${AnimalCardDeckSelectors.CARD_PICKER}            | ${'card-picker'}
      ${AnimalCardDeckSelectors.SHOW_BUTTON}            | ${'show-deck-btn'}
      ${AnimalCardDeckSelectors.CLOSE_BUTTON}           | ${'close-deck-btn'}
      ${AnimalCardDeckSelectors.CONFIRM_BUTTON}         | ${'confirm-pick-btn'}
      ${AnimalCardDeckSelectors.CANCEL_BUTTON}          | ${'cancel-pick-btn'}
    `(
      'should throw an error if $selector is not found',
      ({ selector, className }: { selector: string; className: string }) => {
        document.querySelector(selector)?.classList.remove(className)
        try {
          new AnimalCardDeckInputHandler(gameState)
        } catch (error) {
          expect((error as Error).name).toBe('AnimalCardDeckDOMException')
          expect((error as Error).message).toBe(`Element with selector "${selector}" not found`)
        }
      }
    )
  })

  describe('handlers', () => {
    let showSpy: MockInstance
    let closeSpy: MockInstance
    beforeAll(() => {
      /**
       *  Since HTMLDialogElement isn't defined in jsdom, we need to mock it as a workaround.
       *  (Not using arrow function to avoid losing the context (`this`) of the HTMLDialogElement prototype)
       */
      HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
        this.open = true
      })

      HTMLDialogElement.prototype.show = vi.fn(function (this: HTMLDialogElement) {
        this.open = true
      })

      HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
        this.open = false
      })
    })

    beforeEach(() => {
      showSpy = vi.spyOn(HTMLDialogElement.prototype, 'showModal')
      closeSpy = vi.spyOn(HTMLDialogElement.prototype, 'close')
      animalCardDeckInputHandler = new AnimalCardDeckInputHandler(gameState)
      animalCardDeckInputHandler.initialize()
    })

    it('should handle the click event for the show button to open the animal card deck modal', () => {
      const animalCardDeckElement: HTMLDialogElement | null = document.querySelector(
        AnimalCardDeckSelectors.ANIMAL_DECK_MODAL
      )
      expect(animalCardDeckElement).not.toBeNull()

      console.log(animalCardDeckElement)

      const showButton: HTMLButtonElement | null = document.querySelector(AnimalCardDeckSelectors.SHOW_BUTTON)
      expect(showButton).not.toBeNull()

      expect(animalCardDeckElement?.open).toBe(false)

      const btnClickEvent = createEventWithTarget('click', showButton!)
      showButton?.dispatchEvent(btnClickEvent)

      expect(showSpy).toHaveBeenCalled()
      expect(animalCardDeckElement?.open).toBe(true)
    })

    it('should handle the click event for the close button to close the animal card deck modal', () => {
      const animalCardDeckElement: HTMLDialogElement | null = document.querySelector(
        AnimalCardDeckSelectors.ANIMAL_DECK_MODAL
      )
      expect(animalCardDeckElement).not.toBeNull()

      const closeButton: HTMLButtonElement | null = document.querySelector(AnimalCardDeckSelectors.CLOSE_BUTTON)
      expect(closeButton).not.toBeNull()

      expect(animalCardDeckElement?.open).toBe(false)

      const btnClickEvent = createEventWithTarget('click', closeButton!)
      closeButton?.dispatchEvent(btnClickEvent)

      expect(closeSpy).toHaveBeenCalled()
      expect(animalCardDeckElement?.open).toBe(false)
    })

    describe('confirm button behavior', () => {
      it('should do nothing when confirm is clicked with no cards in the card picker', () => {
        const animalCardDeckElement = openModal()
        const confirmButton: HTMLButtonElement | null = document.querySelector(AnimalCardDeckSelectors.CONFIRM_BUTTON)
        expect(confirmButton).not.toBeNull()
        expect(animalCardDeckElement?.open).toBe(true)

        const confirmButtonClickEvent = createEventWithTarget('click', confirmButton!)
        confirmButton?.dispatchEvent(confirmButtonClickEvent)

        expect(animalCardDeckElement?.open).toBe(true)
      })
    })

    describe('drag and drop behavior', () => {
      let availableCards: NodeListOf<HTMLImageElement>
      let dropZone: HTMLDivElement | null

      beforeEach(() => {
        openModal()
        availableCards = document.querySelectorAll(AnimalCardDeckSelectors.REMAINING_ANIMAL_CARDS)
        expect(availableCards).toHaveLength(5)

        dropZone = document.querySelector<HTMLDivElement>(AnimalCardDeckSelectors.CARD_PICKER)
        expect(dropZone).not.toBeNull()
        expect(dropZone?.children).toHaveLength(0)
      })

      it.each([0, 1, 2, 3, 4])(
        'should handle the dragstart and dragend events for the card at index %i',
        (cardIndex) => {
          const card: HTMLImageElement = availableCards.item(cardIndex)
          expect(card.classList.contains(AnimalCardDeckSelectors.DRAGGING.replace('.', ''))).toBe(false)

          const dragStartEvent = createEventWithTarget('dragstart', card)
          card.dispatchEvent(dragStartEvent)

          expect(card.classList.contains(AnimalCardDeckSelectors.DRAGGING.replace('.', ''))).toBe(true)
          expect(document.querySelectorAll(AnimalCardDeckSelectors.DRAGGING)).toHaveLength(1)

          const dragEndEvent = createEventWithTarget('dragend', card)
          card.dispatchEvent(dragEndEvent)

          expect(card.classList.contains(AnimalCardDeckSelectors.DRAGGING.replace('.', ''))).toBe(false)
          expect(document.querySelectorAll(AnimalCardDeckSelectors.DRAGGING)).toHaveLength(0)
        }
      )

      it('should prevent the default behavior on dragover event', () => {
        expect(dropZone?.classList.contains(AnimalCardDeckSelectors.DRAG_OVER.replace('.', ''))).toBe(false)

        const dragOverEvent = createEventWithTarget('dragover', dropZone!)
        dropZone?.dispatchEvent(dragOverEvent)

        expect(dragOverEvent.defaultPrevented).toBe(true)
      })

      it('should handle the dragenter and dragleave events for the card picker', () => {
        expect(dropZone?.classList.contains(AnimalCardDeckSelectors.DRAG_OVER.replace('.', ''))).toBe(false)

        const dragEnterEvent = createEventWithTarget('dragenter', dropZone!)
        dropZone?.dispatchEvent(dragEnterEvent)

        expect(dropZone?.classList.contains(AnimalCardDeckSelectors.DRAG_OVER.replace('.', ''))).toBe(true)

        const dragLeaveEvent = createEventWithTarget('dragleave', dropZone!)
        dropZone?.dispatchEvent(dragLeaveEvent)

        expect(dropZone?.classList.contains(AnimalCardDeckSelectors.DRAG_OVER.replace('.', ''))).toBe(false)
      })
    })

    describe('AnimalCardDeckInputHandler Drag-and-Drop', () => {
      let animalCardDeckInputHandler: AnimalCardDeckInputHandler
      let animalCard: HTMLImageElement
      let cardPicker: HTMLDivElement
      let confirmButton: HTMLButtonElement
      let cancelButton: HTMLButtonElement
      let animalCards: NodeListOf<HTMLImageElement>
      let initialCardNames: string[]

      beforeEach(() => {
        confirmButton = document.querySelector(AnimalCardDeckSelectors.CONFIRM_BUTTON)!
        cancelButton = document.querySelector(AnimalCardDeckSelectors.CANCEL_BUTTON)!
        animalCardDeckInputHandler = new AnimalCardDeckInputHandler(gameState)
        animalCardDeckInputHandler.initialize()

        animalCards = document.querySelectorAll(AnimalCardDeckSelectors.ANIMAL_CARDS)
        cardPicker = document.querySelector(AnimalCardDeckSelectors.CARD_PICKER)!

        animalCards.item(0).removeAttribute('data-timestamp') // Edge case where the timestamp wouldn't be set => '0'

        initialCardNames = Array.from(animalCards).map((card) => card.getAttribute('alt')!)

        // Ensure that elements are present
        expect(animalCards).toHaveLength(5)
        expect(confirmButton).not.toBeNull()
        expect(cancelButton).not.toBeNull()
        expect(animalCard).not.toBeNull()
        expect(cardPicker).not.toBeNull()
      })

      it.each([0, 1, 2, 3, 4])('should move the card #%i to the card picker on drop', (cardIndex) => {
        animalCard = animalCards.item(cardIndex)!
        const dragOverClassName = AnimalCardDeckSelectors.DRAG_OVER.replace('.', '')
        expect(confirmButton.disabled).toBe(true)
        expect(cancelButton.disabled).toBe(true)

        // Simulate dragstart event from the animal card
        const dragStartEvent = createEventWithTarget('dragstart', animalCard, { clientX: 0, clientY: 0 })
        animalCard.dispatchEvent(dragStartEvent)
        expect(cardPicker.classList.contains(dragOverClassName)).toBe(false)

        // Simulate dragenter and dragover on the card picker
        const dragEnterEvent = createEventWithTarget('dragenter', cardPicker, { clientX: 10, clientY: 0 })
        cardPicker.dispatchEvent(dragEnterEvent)
        expect(cardPicker.classList.contains(dragOverClassName)).toBe(true)

        const dragOverEvent = createEventWithTarget('dragover', cardPicker, { clientX: 10, clientY: 0 })
        cardPicker.dispatchEvent(dragOverEvent)

        // Simulate the drop event on the card picker
        const dropEvent = createEventWithTarget('drop', cardPicker, { clientX: 10, clientY: 0 })
        cardPicker.dispatchEvent(dropEvent)

        // Assert the card is now inside the card picker
        expect(cardPicker.contains(animalCard)).toBe(true)

        // Check that the 'drag-over' class is still present
        expect(cardPicker.classList.contains(dragOverClassName)).toBe(true)

        // Ensure buttons are enabled after dropping the card
        expect(confirmButton.disabled).toBe(false)
        expect(cancelButton.disabled).toBe(false)
      })

      it.each([0, 1, 2, 3, 4])(
        'should handle the click event for the cancel button to cancel the card #%i picking',
        (cardIndex) => {
          animalCard = animalCards.item(cardIndex)!
          const dragOverClassName = AnimalCardDeckSelectors.DRAG_OVER.replace('.', '')

          // Simulate dragstart event from the animal card
          const dragStartEvent = createEventWithTarget('dragstart', animalCard, { clientX: 0, clientY: 0 })
          animalCard.dispatchEvent(dragStartEvent)

          // Simulate dragenter and dragover on the card picker
          const dragEnterEvent = createEventWithTarget('dragenter', cardPicker, { clientX: 10, clientY: 0 })
          cardPicker.dispatchEvent(dragEnterEvent)

          const dragOverEvent = createEventWithTarget('dragover', cardPicker, { clientX: 10, clientY: 0 })
          cardPicker.dispatchEvent(dragOverEvent)

          // Simulate the drop event on the card picker
          const dropEvent = createEventWithTarget('drop', cardPicker, { clientX: 10, clientY: 0 })
          cardPicker.dispatchEvent(dropEvent)

          // Assert the card is now inside the card picker
          expect(cardPicker.contains(animalCard)).toBe(true)

          // Check that the 'drag-over' class is still present
          expect(cardPicker.classList.contains(dragOverClassName)).toBe(true)

          // Ensure buttons are enabled after dropping the card
          expect(confirmButton.disabled).toBe(false)
          expect(cancelButton.disabled).toBe(false)

          // Simulate the click event on the cancel button
          const cancelClickEvent = createEventWithTarget('click', cancelButton)
          cancelButton.dispatchEvent(cancelClickEvent)

          // Assert the card is no longer inside the card picker
          expect(cardPicker.contains(animalCard)).toBe(false)

          // Check that the 'drag-over' class is no longer present
          expect(cardPicker.classList.contains(dragOverClassName)).toBe(false)

          // Ensure buttons are disabled after canceling the card picking
          expect(confirmButton.disabled).toBe(true)
          expect(cancelButton.disabled).toBe(true)

          const cardNamesAfterCancel = Array.from(animalCards).map((card) => card.getAttribute('alt')!)
          expect(cardNamesAfterCancel).toEqual(initialCardNames)
        }
      )

      it.each([0, 1, 2, 3, 4])(
        'should handle the click event for the confirm button to confirm the card #%i picking',
        (cardIndex) => {
          animalCard = animalCards.item(cardIndex)!
          const dragOverClassName = AnimalCardDeckSelectors.DRAG_OVER.replace('.', '')
          expect(gameState.pickedCardsHolder.pickedCards).toHaveLength(0)

          // Simulate dragstart event from the animal card
          const dragStartEvent = createEventWithTarget('dragstart', animalCard, { clientX: 0, clientY: 0 })
          animalCard.dispatchEvent(dragStartEvent)

          // Simulate dragenter and dragover on the card picker
          const dragEnterEvent = createEventWithTarget('dragenter', cardPicker, { clientX: 10, clientY: 0 })
          cardPicker.dispatchEvent(dragEnterEvent)

          const dragOverEvent = createEventWithTarget('dragover', cardPicker, { clientX: 10, clientY: 0 })
          cardPicker.dispatchEvent(dragOverEvent)

          // Simulate the drop event on the card picker
          const dropEvent = createEventWithTarget('drop', cardPicker, { clientX: 10, clientY: 0 })
          cardPicker.dispatchEvent(dropEvent)

          // Assert the card is now inside the card picker
          expect(cardPicker.contains(animalCard)).toBe(true)

          // Check that the 'drag-over' class is still present
          expect(cardPicker.classList.contains(dragOverClassName)).toBe(true)

          // Ensure buttons are enabled after dropping the card
          expect(confirmButton.disabled).toBe(false)
          expect(cancelButton.disabled).toBe(false)

          // Simulate the click event on the confirm button
          const confirmClickEvent = createEventWithTarget('click', confirmButton)
          confirmButton.dispatchEvent(confirmClickEvent)

          // Assert the card is no longer inside the card picker
          expect(cardPicker.contains(animalCard)).toBe(false)

          // Ensure the card picker is empty
          expect(cardPicker.children).toHaveLength(0)

          // Check that the 'drag-over' class is no longer present
          expect(cardPicker.classList.contains(dragOverClassName)).toBe(false)

          // Ensure buttons are disabled after confirming the card picking
          expect(confirmButton.disabled).toBe(true)
          expect(cancelButton.disabled).toBe(true)

          expect(gameState.pickedCardsHolder.pickedCards).toHaveLength(1)
        }
      )

      it.each([0, 1, 2, 3, 4])(
        'should handle the click event for the confirm card #%i button when the picked cards holder is full',
        (cardIndex) => {
          animalCard = animalCards.item(cardIndex)!
          const dragOverClassName = AnimalCardDeckSelectors.DRAG_OVER.replace('.', '')
          expect(gameState.pickedCardsHolder.pickedCards).toHaveLength(0)

          // Simulate dragstart event from the animal card
          const dragStartEvent = createEventWithTarget('dragstart', animalCard, { clientX: 0, clientY: 0 })
          animalCard.dispatchEvent(dragStartEvent)

          // Simulate dragenter and dragover on the card picker
          const dragEnterEvent = createEventWithTarget('dragenter', cardPicker, { clientX: 10, clientY: 0 })
          cardPicker.dispatchEvent(dragEnterEvent)

          const dragOverEvent = createEventWithTarget('dragover', cardPicker, { clientX: 10, clientY: 0 })
          cardPicker.dispatchEvent(dragOverEvent)

          // Simulate the drop event on the card picker
          const dropEvent = createEventWithTarget('drop', cardPicker, { clientX: 10, clientY: 0 })
          cardPicker.dispatchEvent(dropEvent)

          // Assert the card is now inside the card picker
          expect(cardPicker.contains(animalCard)).toBe(true)

          // Check that the 'drag-over' class is still present
          expect(cardPicker.classList.contains(dragOverClassName)).toBe(true)

          // Ensure buttons are enabled after dropping the card
          expect(confirmButton.disabled).toBe(false)
          expect(cancelButton.disabled).toBe(false)

          expect(gameState.pickedCardsHolder.pickedCards).toHaveLength(0)

          // Fill the picked cards holder
          gameState.pickedCardsHolder.add(gameState.animalCardDeck.pop()!)
          gameState.pickedCardsHolder.add(gameState.animalCardDeck.pop()!)
          gameState.pickedCardsHolder.add(gameState.animalCardDeck.pop()!)
          gameState.pickedCardsHolder.add(gameState.animalCardDeck.pop()!)

          expect(gameState.pickedCardsHolder.pickedCards).toHaveLength(4)

          // Simulate the click event on the confirm button
          const confirmClickEvent = createEventWithTarget('click', confirmButton)
          confirmButton.dispatchEvent(confirmClickEvent)

          // Assert the card is no longer inside the card picker
          expect(cardPicker.contains(animalCard)).toBe(false)

          // Ensure the card picker is empty
          expect(cardPicker.children).toHaveLength(0)

          expect(consoleWarnSpy).toHaveBeenCalledWith('Picked cards holder is full')
        }
      )
    })
  })
})

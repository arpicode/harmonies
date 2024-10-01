import AnimalCard from '../../board/AnimalCard'
import PickedCardsHolder from '../../board/PickedCardsHolder'
import GameState from '../GameState'
import IRenderer from '../interfaces/IRenderer'

export default class PickedCardsHolderRenderer implements IRenderer {
  private readonly _gameState: GameState
  private _pickedCardsHolderState: PickedCardsHolder

  constructor(gameState: GameState) {
    console.time('[Initialize] PickedCardsHolder')
    this._gameState = gameState
    this._pickedCardsHolderState = gameState.pickedCardsHolder
    this._initializePickedCardsHolderDOM()
    this._gameState.on('pickedCardsHolderUpdated', () => this.render())
    this._gameState.on('placeAnimalStart', (animalCard: AnimalCard) => this._renderPlaceAnimalStart(animalCard))
    this._gameState.on('placeAnimalCancel', (animalCard: AnimalCard) => this._renderPlaceAnimalCancel(animalCard))
    this._gameState.on('placeAnimalEnd', (animalCard: AnimalCard) => this._renderPlaceAnimalEnd(animalCard))
    console.timeEnd('[Initialize] PickedCardsHolder')
  }

  render(): void {
    console.time('[Render] PickedCardsHolder')
    this._renderPickedCards()
    this._renderCompletedCards()
    console.timeEnd('[Render] PickedCardsHolder')
  }

  private _renderCompletedCards() {
    const completedCardsWrapper = document.querySelector<HTMLDivElement>('.completed-cards-wrapper')
    if (!completedCardsWrapper) throw new Error('Completed cards wrapper not found')

    completedCardsWrapper.innerHTML = ''
    this._pickedCardsHolderState.completedCards.forEach((animal, index) => {
      const completedCard = this._createCardElement(animal)
      completedCard.classList.add('completed-card', `card-${index + 1}`)
      completedCardsWrapper.appendChild(completedCard)
    })
  }

  private _renderPickedCards() {
    const pickedCardsWrapper = document.querySelector<HTMLDivElement>('.picked-cards-wrapper')
    if (!pickedCardsWrapper) throw new Error('Picked cards wrapper not found')

    pickedCardsWrapper.innerHTML = ''
    this._pickedCardsHolderState.pickedCards.forEach((animal) => {
      const fullCard = this._createWrapperContent(animal)
      pickedCardsWrapper.appendChild(fullCard)
    })
  }

  private _renderPlaceAnimalStart(animalCard: AnimalCard): void {
    this._renderCancelButton(animalCard)
    this._setActiveButtonsDisabledState(true)
  }

  private _renderPlaceAnimalCancel(animalCard: AnimalCard): void {
    this._renderActiveButton(animalCard)
    this._setActiveButtonsDisabledState(false)
  }

  private _renderPlaceAnimalEnd(animalCard: AnimalCard): void {
    const numRemainingTokens = this._removeCubeTokens(animalCard)
    if (numRemainingTokens === 0) this._moveCompletedCardToCompletedCardsHolder(animalCard)
    this._setActiveButtonsDisabledState(false)
  }

  private _moveCompletedCardToCompletedCardsHolder(animalCard: AnimalCard): void {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const animalCardElement = document.querySelector<HTMLImageElement>(
      `.animal-card[data-card-name="${animalCard.name}"]`
    )! // We know it exists because we'll have just removed the last cube token from it
    const pickedCardWrapper = animalCardElement.closest('.picked-card-wrapper')
    const completedCardsWrapper = document.querySelector<HTMLDivElement>('.completed-cards-wrapper')
    if (!completedCardsWrapper) throw new Error('Completed cards wrapper not found')
    animalCardElement.classList.add(`card-${this._pickedCardsHolderState.completedCards.length}`)
    completedCardsWrapper.appendChild(animalCardElement)
    pickedCardWrapper?.remove()
  }

  private _renderCancelButton(animalCard: AnimalCard): void {
    const cardActionButton = document.querySelector<HTMLButtonElement>(
      `.card-action-button[data-button-for="${animalCard.name}"]`
    )
    if (!cardActionButton) throw new Error('Card action button not found')
    cardActionButton.innerHTML = 'Annuler'
    cardActionButton.setAttribute('data-state', 'cancel')
  }

  private _setActiveButtonsDisabledState(disabled: boolean): void {
    const cardActionButtons = document.querySelectorAll<HTMLButtonElement>('.card-action-button[data-state="active"]')
    cardActionButtons.forEach((button) => (button.disabled = disabled))
  }

  private _renderActiveButton(animalCard: AnimalCard): void {
    const cardActionButton = document.querySelector<HTMLButtonElement>(
      `.card-action-button[data-button-for="${animalCard.name}"]`
    )
    if (!cardActionButton) throw new Error('Card action button not found')
    cardActionButton.innerHTML = 'Poser'
    cardActionButton.setAttribute('data-state', 'active')
  }

  private _removeCubeTokens(animalCard: AnimalCard): number {
    const cubes = document.querySelectorAll<SVGGElement>(
      `.cube-group[data-cube-group-for="${animalCard.name}"] .cube-token`
    )

    cubes[cubes.length - 1].remove()

    if (cubes.length - 1 <= 0) {
      const img = document.querySelector<HTMLImageElement>(
        `.picked-cards-wrapper [data-card-name="${animalCard.name}"]`
      )
      if (!img) throw new Error('Card image not found')
      img.classList.add('completed-card')
    } else {
      this._renderActiveButton(animalCard)
    }
    return cubes.length - 1
  }

  private _initializePickedCardsHolderDOM(): void {
    const pickedCardsWrapper = this._getPickedCardsWrapper()
    const pickedCardWrapper = this._createPickedCardWrapper()
    pickedCardsWrapper.appendChild(pickedCardWrapper)
  }

  private _getPickedCardsWrapper(): HTMLDivElement {
    const pickedCardsHolder = document.querySelector<HTMLDivElement>('.picked-cards-wrapper')
    if (!pickedCardsHolder) throw new Error('Picked cards wrapper not found')
    return pickedCardsHolder
  }

  private _createPickedCardWrapper(): HTMLDivElement {
    const cardContainer = document.createElement('div')
    cardContainer.classList.add('picked-card-wrapper')
    return cardContainer
  }

  private _createCardElement(animalCard: AnimalCard): HTMLImageElement {
    const cardElement = document.createElement('img')
    cardElement.classList.add('animal-card')
    if (animalCard.animalTokenCount === 0) cardElement.classList.add('completed-card')
    cardElement.dataset.cardName = animalCard.name
    cardElement.src = animalCard.image
    cardElement.alt = animalCard.name
    return cardElement
  }

  private _createCardSVGOverlay(animalCard: AnimalCard): SVGElement | null {
    if (animalCard.animalTokenCount === 0) return null
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('class', 'picked-card-svg-overlay')
    svg.setAttribute('width', '100%')
    svg.setAttribute('height', '100%')
    svg.setAttribute('viewBox', '0 0 128 220')

    const cubeGroup = this._createCubeGroup(animalCard)
    svg.appendChild(cubeGroup)
    return svg
  }

  private _createCubeGroup(animalCard: AnimalCard): SVGGElement {
    const cubeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    cubeGroup.setAttribute('class', 'cube-group')
    cubeGroup.setAttribute('data-cube-group-for', animalCard.name)
    for (let i = 0; i < animalCard.animalTokenCount; i++) {
      const cube = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
      cube.setAttribute('x', '107')
      cube.setAttribute('y', `${i * (32 + 1.8) + 6}`)
      cube.setAttribute('width', '15')
      cube.setAttribute('height', '15')
      cube.setAttribute('class', 'cube-token')
      cubeGroup.appendChild(cube)
    }
    return cubeGroup
  }

  private _createCardActionButton(animalCard: AnimalCard): HTMLButtonElement | null {
    if (animalCard.animalTokenCount === 0) return null
    const cardActionButton = document.createElement('button')
    cardActionButton.classList.add('button', 'card-action-button')
    cardActionButton.dataset.buttonFor = animalCard.name
    cardActionButton.textContent = 'Poser'
    cardActionButton.setAttribute('data-state', 'active')
    return cardActionButton
  }

  private _createWrapperContent(animalCard: AnimalCard): HTMLDivElement {
    const pickedCardWrapper = this._createPickedCardWrapper()
    const cardElement = this._createCardElement(animalCard)
    const cardSVGOverlay = this._createCardSVGOverlay(animalCard)
    const cardActionButton = this._createCardActionButton(animalCard)

    pickedCardWrapper.appendChild(cardElement)
    if (cardSVGOverlay) pickedCardWrapper.appendChild(cardSVGOverlay)
    if (cardActionButton) pickedCardWrapper.appendChild(cardActionButton)
    return pickedCardWrapper
  }
}

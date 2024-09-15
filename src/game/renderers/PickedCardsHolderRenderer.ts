import AnimalCard from '../../board/AnimalCard'
import PickedCardsHolder from '../../board/PickedCardsHolder'
import GameState from '../GameState'
import IRenderer from './interfaces/IRenderer'

export default class PickedCardsHolderRenderer implements IRenderer {
  private readonly _gameState: GameState
  private _pickedCardsHolder: PickedCardsHolder

  constructor(gameState: GameState) {
    console.time('[Initialize] PickedCardsHolder')
    this._gameState = gameState
    this._pickedCardsHolder = gameState.pickedCardsHolder
    this._initializePickedCardsHolderDOM()
    this._gameState.on('pickedCardsHolderUpdated', () => this.render())
    this._gameState.on('placeAnimalStart', (animalCard: AnimalCard) => this._renderPlaceAnimalStart(animalCard))
    this._gameState.on('placeAnimalCancel', (animalCard: AnimalCard) => this._renderPlaceAnimalCancel(animalCard))
    this._gameState.on('placeAnimalEnd', (animalCard: AnimalCard) => this._renderPlaceAnimalEnd(animalCard))
    console.timeEnd('[Initialize] PickedCardsHolder')
  }

  render(): void {
    console.time('[Render] PickedCardsHolder')
    const pickedCardsContainer = document.querySelector<HTMLDivElement>('.picked-cards-holder .picked-cards-container')
    if (!pickedCardsContainer) throw new Error('Picked cards container not found')
    pickedCardsContainer.innerHTML = ''
    for (const animal of this._pickedCardsHolder.pickedCards) {
      const fullCard = this._createWrapperContent(animal)
      pickedCardsContainer.appendChild(fullCard)
    }
    console.timeEnd('[Render] PickedCardsHolder')
  }

  private _renderPlaceAnimalStart(animalCard: AnimalCard): void {
    this._renderCancelButton(animalCard)
    this._setActiveButtonsDisabledState(true)
  }

  private _renderPlaceAnimalCancel(animalCard: AnimalCard): void {
    this._renderActiveButton(animalCard)
    this._setActiveButtonsDisabledState(false)
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
    cardActionButton.innerHTML = `Poser<br>${animalCard.name}`
    cardActionButton.setAttribute('data-state', 'active')
  }

  private _renderPlaceAnimalEnd(animalCard: AnimalCard): void {
    this._removeCubeTokens(animalCard)
    this._setActiveButtonsDisabledState(false)
  }

  private _removeCubeTokens(animalCard: AnimalCard): void {
    const cubes = document.querySelectorAll<SVGGElement>(
      `.cube-group[data-cube-group-for="${animalCard.name}"] .cube-token`
    )

    cubes[cubes.length - 1].remove()

    if (cubes.length - 1 <= 0) {
      const img = document.querySelector<HTMLImageElement>(`.picked-cards-holder [data-card-name="${animalCard.name}"]`)
      if (!img) throw new Error('Card image not found')
      img.classList.add('animal-card--completed')
      this._removeCancelButton(animalCard)
    } else {
      this._renderActiveButton(animalCard)
    }
  }

  private _removeCancelButton(animalCard: AnimalCard): void {
    const cardActionButton = document.querySelector<HTMLButtonElement>(
      `.card-action-button[data-button-for="${animalCard.name}"]`
    )
    if (!cardActionButton) throw new Error('Card action button not found')
    cardActionButton.remove()
  }

  private _initializePickedCardsHolderDOM(): void {
    const pickedCardsHolder = this._getPickedCardsHolder()
    const pickedCardsContainer = this._createPickedCardsContainer()
    pickedCardsHolder.appendChild(pickedCardsContainer)
  }

  private _getPickedCardsHolder(): HTMLDivElement {
    const pickedCardsHolder = document.querySelector<HTMLDivElement>('.picked-cards-holder')
    if (!pickedCardsHolder) throw new Error('Picked cards holder not found')
    return pickedCardsHolder
  }

  private _createPickedCardsContainer(): HTMLDivElement {
    const pickedCardsContainer = document.createElement('div')
    pickedCardsContainer.classList.add('picked-cards-container')
    return pickedCardsContainer
  }

  private _createCardAndActionWrapper(): HTMLDivElement {
    const cardAndActionWrapper = document.createElement('div')
    cardAndActionWrapper.classList.add('card-and-action-wrapper')
    return cardAndActionWrapper
  }

  private _createCardContainer(): HTMLDivElement {
    const cardContainer = document.createElement('div')
    cardContainer.classList.add('card-container')
    return cardContainer
  }

  private _createCardElement(animalCard: AnimalCard): HTMLImageElement {
    const cardElement = document.createElement('img')
    cardElement.classList.add('animal-card')
    if (animalCard.animalTokenCount === 0) cardElement.classList.add('animal-card--completed')
    cardElement.dataset.cardName = animalCard.name
    cardElement.src = animalCard.image
    cardElement.alt = animalCard.name
    return cardElement
  }

  private _createCardSVGOverlay(animalCard: AnimalCard): SVGElement | null {
    if (animalCard.animalTokenCount === 0) return null
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('class', 'svg-card-overlay')
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
    cardActionButton.classList.add('card-action-button')
    cardActionButton.dataset.buttonFor = animalCard.name
    cardActionButton.innerHTML = `Poser<br>${animalCard.name}`
    cardActionButton.setAttribute('data-state', 'active')
    return cardActionButton
  }

  private _createWrapperContent(animalCard: AnimalCard): HTMLDivElement {
    const cardAndActionWrapper = this._createCardAndActionWrapper()
    const cardContainer = this._createCardContainer()
    const cardElement = this._createCardElement(animalCard)
    const cardSVGOverlay = this._createCardSVGOverlay(animalCard)
    const cardActionButton = this._createCardActionButton(animalCard)

    cardContainer.appendChild(cardElement)
    if (cardSVGOverlay) cardContainer.appendChild(cardSVGOverlay)
    if (cardActionButton) cardAndActionWrapper.appendChild(cardActionButton)
    cardAndActionWrapper.appendChild(cardContainer)
    return cardAndActionWrapper
  }
}

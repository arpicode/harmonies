import AnimalCard from '../../board/AnimalCard'
import PickedCardsHolder from '../../board/PickedCardsHolder'
import GameState from '../GameState'
import IRenderer from './interfaces/IRenderer'

export default class PickedCardsHolderRenderer implements IRenderer {
  private readonly _gameState: GameState
  private _pickedCardsHolder: PickedCardsHolder

  constructor(gameState: GameState) {
    console.time('PickedCardsHolderRenderer#constructor')
    this._gameState = gameState
    this._pickedCardsHolder = gameState.pickedCardsHolder
    this._initializePickedCardsHolderDOM()
    this._gameState.on('pickedCardsHolderUpdated', () => this.render())
    console.timeEnd('PickedCardsHolderRenderer#constructor')
  }

  render(): void {
    console.time('PickedCardsHolderRenderer#render')
    const pickedCardsContainer = document.querySelector<HTMLDivElement>('.picked-cards-holder .picked-cards-container')
    if (!pickedCardsContainer) throw new Error('Picked cards container not found')
    pickedCardsContainer.innerHTML = ''
    for (const animal of this._pickedCardsHolder.pickedCards) {
      const fullCard = this._createWrapperContent(animal)
      pickedCardsContainer.appendChild(fullCard)
    }
    console.timeEnd('PickedCardsHolderRenderer#render')
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

  private _createCardElement(animal: AnimalCard): HTMLImageElement {
    const cardElement = document.createElement('img')
    cardElement.classList.add('animal-card')
    cardElement.dataset.cardName = animal.name
    cardElement.src = animal.image
    cardElement.alt = animal.name
    return cardElement
  }

  private _createCardSVGOverlay(animal: AnimalCard): SVGElement {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('class', 'svg-card-overlay')
    svg.setAttribute('width', '100%')
    svg.setAttribute('height', '100%')
    svg.setAttribute('viewBox', '0 0 128 220')
    animal.points.forEach((_, index) => {
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
      rect.setAttribute('x', '107')
      rect.setAttribute('y', `${index * (32 + 1.8) + 6}`)
      rect.setAttribute('width', '15')
      rect.setAttribute('height', '15')
      rect.setAttribute('fill', '#d2691e')
      svg.appendChild(rect)
    })
    return svg
  }

  private _createCardActionButton(animal: AnimalCard): HTMLButtonElement {
    const cardActionButton = document.createElement('button')
    cardActionButton.classList.add('card-action-button')
    cardActionButton.dataset.buttonFor = animal.name
    cardActionButton.innerHTML = `Poser<br>${animal.name}`
    return cardActionButton
  }

  private _createWrapperContent(animal: AnimalCard): HTMLDivElement {
    const cardAndActionWrapper = this._createCardAndActionWrapper()
    const cardContainer = this._createCardContainer()
    const cardElement = this._createCardElement(animal)
    const cardSVGOverlay = this._createCardSVGOverlay(animal)
    const cardActionButton = this._createCardActionButton(animal)

    cardContainer.appendChild(cardElement)
    cardContainer.appendChild(cardSVGOverlay)
    cardAndActionWrapper.appendChild(cardActionButton)
    cardAndActionWrapper.appendChild(cardContainer)
    return cardAndActionWrapper
  }
}

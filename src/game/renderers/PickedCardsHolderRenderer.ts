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
      const cardElement = this._createCardElement(animal)
      console.log('Rendering picked card:', animal.name)
      pickedCardsContainer.appendChild(cardElement)
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

  private _createCardElement(animal: AnimalCard): HTMLImageElement {
    const cardElement = document.createElement('img')
    cardElement.classList.add('animal-card')
    cardElement.src = animal.image
    cardElement.alt = animal.name
    return cardElement
  }
}

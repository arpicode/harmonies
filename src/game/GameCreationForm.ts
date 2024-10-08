import { HexBoardType } from '~/board/HexBoard'
import Game from './Game'

export default class GameCreationForm {
  constructor() {
    this._initializeGameCreationFormDOM()
    const createGameButton = document.querySelector('.create-game-button')
    createGameButton?.addEventListener('click', () => this._handleCreateGame())
    const modal = document.querySelector<HTMLDialogElement>('.game-creation-modal')
    modal?.showModal()
  }

  private _handleCreateGame(): void {
    const selectedBoard = document.querySelector<HTMLInputElement>('input[name="board"]:checked')
    if (!selectedBoard) throw new Error('No board selected')
    const boardType = selectedBoard.value as HexBoardType
    const modal = document.querySelector<HTMLDialogElement>('.game-creation-modal')
    modal?.close()

    const gameMode = 'solo'
    new Game(gameMode, boardType)
  }

  private _initializeGameCreationFormDOM(): void {
    const gameCreationModal = this._getGameCreationModal()
    const gameCreationForm = this._createGameCreationForm()
    const boardSelectionWrapper = this._createBoardSelectionWrapper()
    const riverBoardRadioInput = this._createBoardRadioInput('river', true)
    const islandBoardRadioInput = this._createBoardRadioInput('island')
    const submitButton = this._createSubmitButton()

    boardSelectionWrapper.appendChild(riverBoardRadioInput)
    boardSelectionWrapper.appendChild(islandBoardRadioInput)
    gameCreationForm.appendChild(boardSelectionWrapper)
    gameCreationForm.appendChild(submitButton)
    gameCreationModal.appendChild(gameCreationForm)
  }

  private _getGameCreationModal(): HTMLDialogElement {
    const gameCreationForm = document.querySelector('.game-creation-modal')
    if (!gameCreationForm) throw new Error('Game creation modal not found')
    return gameCreationForm as HTMLDialogElement
  }

  private _createGameCreationForm(): HTMLDivElement {
    const gameCreationForm = document.createElement('div')
    gameCreationForm.classList.add('game-creation-form')
    return gameCreationForm
  }

  private _createBoardSelectionWrapper(): HTMLDivElement {
    const boardSelectionWrapper = document.createElement('div')
    boardSelectionWrapper.classList.add('board-selection-wrapper')
    return boardSelectionWrapper
  }

  private _createBoardRadioInput(boardType: HexBoardType, checked = false): HTMLLabelElement {
    const boardRadioInput = document.createElement('label')
    boardRadioInput.classList.add(`${boardType}-board`)

    const boardImage = document.createElement('img')
    boardImage.src = `./${boardType}_map_800.webp`
    boardImage.alt = `${boardType} board`

    const radioInput = document.createElement('input')
    radioInput.type = 'radio'
    radioInput.name = 'board'
    radioInput.value = boardType
    radioInput.checked = checked

    const labelText = document.createElement('span')
    labelText.textContent = boardType === 'river' ? 'Rivière' : 'Île'

    boardRadioInput.appendChild(boardImage)
    boardRadioInput.appendChild(radioInput)
    boardRadioInput.appendChild(labelText)

    return boardRadioInput
  }

  private _createSubmitButton(text = 'Créer'): HTMLButtonElement {
    const submitButton = document.createElement('button')
    submitButton.classList.add('button', 'create-game-button')
    submitButton.textContent = text
    return submitButton
  }
}

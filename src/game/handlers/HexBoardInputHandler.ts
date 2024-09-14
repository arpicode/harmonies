import ScoreBoard from '../../board/ScoreBoard'
import Token, { TokenType } from '../../board/Token'
import GameState from '../GameState'
import IInputHandler from './interfaces/IInputHandler'

export enum HexBoardSelectors {
  HEX_BOARD = '#hex-board',
}

class HexBoardDOMException extends Error {
  constructor(selector: string) {
    super()
    this.name = 'HexBoardDOMException'
    this.message = `Element with selector "${selector}" not found`
  }
}

export default class HexBoardInputHandler implements IInputHandler {
  private _gameState: GameState
  private _hexBoardSVG: SVGElement

  constructor(gameState: GameState) {
    this._gameState = gameState
    this._hexBoardSVG = this._querySelector<SVGElement>(HexBoardSelectors.HEX_BOARD)
  }

  initialize() {
    const hexes = this._gameState.hexBoard.hexes
    hexes.forEach((hex) => {
      const hexGroup = this._getHexSVGGroup(hex.q, hex.r)
      this._bindEvents(hexGroup)
    })
    this._hexBoardSVG.addEventListener('click', (event) => this._handleSpawnHexClick(event))
  }

  private _querySelector<T extends HTMLElement | SVGElement>(selector: HexBoardSelectors): T {
    const element = document.querySelector<T>(selector)
    if (!element) throw new HexBoardDOMException(selector)
    return element
  }

  private _bindEvents(hexGroup: SVGElement) {
    hexGroup.addEventListener('dragover', (event) => this._handleDragOver(event))
    hexGroup.addEventListener('drop', (event) => this._handleDrop(event))
    hexGroup.addEventListener('dragenter', (event) => this._handleDragEnter(event))
    hexGroup.addEventListener('dragleave', (event) => this._handleDragLeave(event))
  }

  private _getHexSVGGroup(q: number, r: number): SVGElement {
    const hexGroup = document.querySelector(`#hex-${q}-${r}`)
    if (!hexGroup) throw new Error(`Hex group not found for hex ${q}-${r}`)
    return hexGroup as SVGElement
  }

  private _handleSpawnHexClick(event: Event) {
    const target = event.target as SVGElement
    if (!target.matches('[class*="highlight-ecosystem-"]')) return

    // get token stack
    const coords = target
      .getAttribute('data-coords')
      ?.split(',')
      .map((coord) => parseInt(coord, 10))
    if (!coords) throw new Error('Coordinates not found')
    const hexQ = coords[0]
    const hexR = coords[1]
    const hex = this._gameState.hexBoard.getHex(hexQ, hexR)
    if (!hex) throw new Error(`Hex not found at coordinates (${hexQ}, ${hexR})`)
    const animalName = target.getAttribute('data-spawn-for')
    hex.isSpawn = true
    console.log(hex)
    const animalCard = this._gameState.pickedCardsHolder.pickedCards.find((card) => card.name === animalName)
    if (!animalCard) throw new Error('Animal card not found')
    // this._gameState.notifyPlaceAnimalCancel()
    this._gameState.notifyPlaceAnimalEnd(animalCard, hex)
  }

  private _handleDragOver(event: Event) {
    event.preventDefault()
  }

  private _handleDragEnter(event: Event) {
    ;(event.target as SVGElement).classList.add('drag-over')
  }

  private _handleDragLeave(event: Event) {
    ;(event.target as SVGElement).classList.remove('drag-over')
  }

  private _handleDrop(event: Event) {
    try {
      const currentToken = this._getCurrentDraggedToken()
      const currentTokenType = this._getCurrentDraggedTokenType(currentToken)
      const { hexQ, hexR } = this._getTargetHexAxialCoords(event)
      this._addTokenToHex(hexQ, hexR, currentTokenType)
      this._removeTokenFromDraftedTokens(currentTokenType)
      currentToken.remove()
      const scorboard = new ScoreBoard(this._gameState.hexBoard)
      if (event.target instanceof SVGElement) event.target.classList.remove('drag-over')
      console.log(scorboard.toString())
      this._gameState.notifyHexBoardUpdate()
    } catch (error) {
      console.warn((error as Error).message)
    }
  }

  private _getCurrentDraggedToken(): SVGElement {
    const currentToken = document.querySelector('.dragging')
    if (!currentToken) throw new Error('No token selected')
    return currentToken as SVGElement
  }

  private _getCurrentDraggedTokenType(currentToken: SVGElement): TokenType {
    const tokenType = currentToken.getAttribute('data-token-type')
    if (!tokenType) throw new Error('Token type not found')
    return tokenType as TokenType
  }

  private _getTargetHexAxialCoords(event: Event): { hexQ: number; hexR: number } {
    const target = event.currentTarget as SVGElement
    const targetHex = target.querySelector('[data-stack-axial-coords]')
    if (!targetHex) throw new Error('No target hex found')
    const targetHexCoords = targetHex.getAttribute('data-stack-axial-coords')
    if (!targetHexCoords) throw new Error('Target hex coordinates not found')
    const [hexQ, hexR] = targetHexCoords.split(',').map((coord) => parseInt(coord, 10))
    return { hexQ, hexR }
  }

  private _addTokenToHex(hexQ: number, hexR: number, tokenType: TokenType) {
    const hex = this._gameState.hexBoard.getHex(hexQ, hexR)
    if (!hex) throw new Error(`Hex not found at coordinates (${hexQ}, ${hexR})`)
    hex.tokens.push(new Token(tokenType))
  }

  private _removeTokenFromDraftedTokens(tokenType: TokenType) {
    const draftedTokens = this._gameState.draftTable.draftedTokens
    for (let i = 0; i < draftedTokens.size(); i++) {
      if (draftedTokens.tokens[i]?.type === tokenType) {
        draftedTokens.tokens.splice(i, 1)
        break
      }
    }
  }
}

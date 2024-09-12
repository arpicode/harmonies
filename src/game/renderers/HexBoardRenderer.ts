import { Hex } from '../../board/Hex'
import { HexBoard, HexBoardType } from '../../board/HexBoard'
import { Layout } from '../../board/Layout'
import Token, { TokenType } from '../../board/Token'
import GameState from '../GameState'
import { SVG_NAMESPACE } from '../../utils/utils'
import IRenderer from './interfaces/IRenderer'

export default class HexBoardRenderer implements IRenderer {
  private _hexBoard: HexBoard
  private _layout: Layout
  private _svg: SVGGElement
  public afterHexClick?: () => void

  public static readonly GAME_BOARD_WRAPPER_CLASS = 'game-board-container'
  public static readonly BOARD_IMAGES = {
    river: 'river_map_800.png',
    island: 'island_map_800.png',
  } as Record<HexBoardType, string>
  public static readonly IMAGE_SIZE = { w: 800, h: 642 }
  private static readonly HEX_CLASS = 'hex'
  private static readonly COORDS_CLASS = 'coords'
  private static readonly TOKEN_STACK_CLASS = 'token-stack'
  private readonly _tokenOffsetFactor: number
  private readonly _gameState: GameState

  constructor(gameState: GameState, svg?: SVGGElement) {
    console.time('HexBoardRenderer#constructor')
    this._gameState = gameState
    this._hexBoard = gameState.hexBoard
    this._layout = gameState.layout
    this._svg = svg ?? this._createHexBoardSVGElement(this._hexBoard.type)
    this._tokenOffsetFactor = 15 / this._layout.size.y
    this._initializeHexBoardDOM()

    this._gameState.on('hexBoardUpdated', () => this.render())
    console.timeEnd('HexBoardRenderer#constructor')
  }

  private _initializeHexBoardDOM(): void {
    const gameBoardWrapper = document.querySelector(`.${HexBoardRenderer.GAME_BOARD_WRAPPER_CLASS}`)
    if (!gameBoardWrapper) throw new Error('Game board wrapper not found')
    const imgSrc = HexBoardRenderer.BOARD_IMAGES[this._hexBoard.type]
    if (imgSrc) {
      gameBoardWrapper.innerHTML = `<img class="hex-board" src="${imgSrc}" alt="Hex board" />`
    }
    this._hexBoard.hexes.forEach((hex) => this._drawHex(hex))
    gameBoardWrapper.appendChild(this._svg)
  }

  private _createHexBoardSVGElement(type: HexBoardType): SVGGElement {
    const svg = document.createElementNS(SVG_NAMESPACE, 'svg') as SVGGElement
    svg.setAttribute('xmlns', SVG_NAMESPACE)
    svg.setAttribute('id', 'hex-board')
    svg.setAttribute('class', `hex-board--${type}`)
    svg.setAttribute('viewBox', `0 0 ${HexBoardRenderer.IMAGE_SIZE.w} ${HexBoardRenderer.IMAGE_SIZE.h}`)
    return svg
  }

  private _drawHex(hex: Hex): void {
    const group = this._createHexSvgGroup(hex)
    const polygon = this._createHexPolygon(hex)
    const text = this._createHexText(hex)

    group.appendChild(polygon)
    group.appendChild(text)

    this._svg.appendChild(group)
    this._renderTokenStackGroup(hex)
  }

  render(): void {
    console.time('HexBoardRenderer#render')
    this._hexBoard.hexes.forEach((hex) => this._renderTokens(hex))
    console.timeEnd('HexBoardRenderer#render')
  }

  private _createHexSvgGroup(hex: Hex): SVGGElement {
    const group = document.createElementNS(SVG_NAMESPACE, 'g')
    group.setAttribute('id', `hex-${hex.q}-${hex.r}`)
    group.addEventListener('click', () => this.handleHexClick(hex))
    return group
  }

  private _createHexPolygon(hex: Hex): SVGPolygonElement {
    const polygon = document.createElementNS(SVG_NAMESPACE, 'polygon')
    const corners = this._layout.polygonCorners(hex)
    const points = corners.map((p) => `${p.x.toFixed(5)},${p.y.toFixed(5)}`).join(' ')

    polygon.setAttribute('class', HexBoardRenderer.HEX_CLASS)
    polygon.setAttribute('points', points)
    polygon.setAttribute('data-coords', `${hex.q},${hex.r},${hex.s}`)
    return polygon
  }

  private _createHexText(hex: Hex): SVGTextElement {
    const text = document.createElementNS(SVG_NAMESPACE, 'text')
    const center = this._layout.hexToPixel(hex)

    text.setAttribute('x', center.x.toFixed(5))
    text.setAttribute('y', (center.y - this._layout.size.y * 0.6).toFixed(5))
    text.setAttribute('class', HexBoardRenderer.COORDS_CLASS)
    text.textContent = `${hex.q} ${hex.r} ${hex.s}`
    return text
  }

  /* c8 ignore start */
  /* This block is excluded from test coverage since it's temporary code
     only used for user interaction in development sandbox */
  handleHexClick(hex: Hex): void {
    const selectedColor = this._getSelectedColor() ?? 'Blue'

    try {
      hex.tokens.push(new Token(TokenType[selectedColor as keyof typeof TokenType]))
      this._renderTokenStackGroup(hex)
      if (this.afterHexClick) this.afterHexClick()
      this._gameState.notifyHexBoardUpdate()
    } catch (error) {
      console.error((error as Error).message)
    }
  }

  private _getSelectedColor(): string | null {
    const selectedRadioBtn: HTMLInputElement | null = document.querySelector('input[name="color"]:checked')
    if (!selectedRadioBtn) {
      console.error('No color selected')
      return null
    }
    return selectedRadioBtn.value
  }
  /* c8 ignore end */

  private _renderTokenStackGroup(hex: Hex): void {
    let tokenStackGroup = this._svg.querySelector(`#hex-${hex.q}-${hex.r} .${HexBoardRenderer.TOKEN_STACK_CLASS}`)
    if (!tokenStackGroup) {
      tokenStackGroup = document.createElementNS(SVG_NAMESPACE, 'g')
      tokenStackGroup.setAttribute('class', HexBoardRenderer.TOKEN_STACK_CLASS)
      tokenStackGroup.setAttribute('data-stack-axial-coords', `${hex.q},${hex.r}`)

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const hexGroup = this._svg.querySelector(`#hex-${hex.q}-${hex.r}`)! // we know it exists since we just searched for it
      hexGroup.appendChild(tokenStackGroup)
    }
  }

  private _renderTokens(hex: Hex): void {
    // TODO: only render tokens of dirty hexes
    const tokenStackGroup = this._svg.querySelector(`[data-stack-axial-coords="${hex.q},${hex.r}"]`)
    if (!tokenStackGroup) throw new Error(`Token stack group not found for hex (${hex.q}, ${hex.r})`)

    tokenStackGroup.innerHTML = ''
    const center = this._layout.hexToPixel(hex)
    const tokens = hex.tokens.toArray()
    const tokenHeight = this._layout.size.y
    const yOffset = this._calculateYOffset(tokens.length, tokenHeight)

    tokens.forEach((token, index) => {
      const tokenSvg = this._createSvgTokenElement(token.type.toLowerCase())
      const tokenWidth = Number(tokenSvg.getAttribute('width'))

      tokenSvg.setAttribute('x', (center.x - tokenWidth / 2).toFixed(2))
      tokenSvg.setAttribute(
        'y',
        (center.y + yOffset - index * tokenHeight * this._tokenOffsetFactor - tokenHeight / 2).toFixed(2)
      )
      tokenStackGroup.appendChild(tokenSvg)
    })
  }

  private _createSvgTokenElement(tokenClass: string): SVGElement {
    const svgNamespace = SVG_NAMESPACE
    const svg = document.createElementNS(svgNamespace, 'svg')
    svg.setAttribute('class', tokenClass)
    svg.setAttribute('width', `${this._layout.size.x * 0.95}`)
    svg.setAttribute('height', `${this._layout.size.y}`)
    svg.setAttribute('viewBox', '0 0 277 161')
    svg.setAttribute('xmlns', svgNamespace)

    const mask = document.createElementNS(svgNamespace, 'mask')
    const maskPath = document.createElementNS(svgNamespace, 'path')
    maskPath.setAttribute(
      'd',
      'M277 43H0V118.5V122H0.462925C6.26315 143.835 65.849 161 138.5 161C211.151 161 270.737 143.835 276.537 122H277V118.5V43Z'
    )
    mask.appendChild(maskPath)
    svg.appendChild(mask)

    const tokenFrontPath = document.createElementNS(svgNamespace, 'path')
    tokenFrontPath.setAttribute('class', 'token-front')
    tokenFrontPath.setAttribute(
      'd',
      'M277 43H0V118.5V122H0.462925C6.26315 143.835 65.849 161 138.5 161C211.151 161 270.737 143.835 276.537 122H277V118.5V43Z'
    )
    tokenFrontPath.setAttribute('fill', '#e9e9e9')
    svg.appendChild(tokenFrontPath)

    const tokenTopPath = document.createElementNS(svgNamespace, 'path')
    tokenTopPath.setAttribute('class', 'token-top')
    tokenTopPath.setAttribute(
      'd',
      'M276.5 42.5C276.5 48.1308 272.78 53.5907 265.822 58.6382C258.876 63.6776 248.793 68.2367 236.288 72.074C211.283 79.7468 176.71 84.5 138.5 84.5C100.29 84.5 65.7165 79.7468 40.7124 72.074C28.2073 68.2367 18.1238 63.6776 11.1776 58.6382C4.2203 53.5907 0.5 48.1308 0.5 42.5C0.5 36.8692 4.2203 31.4093 11.1776 26.3618C18.1238 21.3224 28.2073 16.7633 40.7124 12.926C65.7165 5.25322 100.29 0.5 138.5 0.5C176.71 0.5 211.283 5.25322 236.288 12.926C248.793 16.7633 258.876 21.3224 265.822 26.3618C272.78 31.4093 276.5 36.8692 276.5 42.5Z'
    )
    tokenTopPath.setAttribute('fill', '#e9e9e9')
    svg.appendChild(tokenTopPath)

    return svg
  }

  private _calculateYOffset(tokenCount: number, tokenHeight: number): number {
    switch (tokenCount) {
      case 2:
        return tokenHeight * (this._tokenOffsetFactor / 2)
      case 3:
        return tokenHeight * this._tokenOffsetFactor
      default:
        return 0
    }
  }
}

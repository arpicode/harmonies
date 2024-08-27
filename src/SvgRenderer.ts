import { Hex } from './board/Hex'
import { HexBoard } from './board/HexBoard'
import { Layout } from './board/Layout'
import Token, { TokenType } from './board/Token'

export default class SvgRenderer {
  private _hexBoard: HexBoard
  private _layout: Layout
  private _svg: SVGGElement
  public afterHexClick?: () => void

  private static readonly SVG_NAMESPACE = 'http://www.w3.org/2000/svg'
  private static readonly HEX_CLASS = 'hex'
  private static readonly COORDS_CLASS = 'coords'
  private static readonly TOKEN_STACK_CLASS = 'token-stack'
  private readonly _tokenOffsetFactor: number

  constructor(hexBoard: HexBoard, layout: Layout, svg: SVGGElement) {
    this._hexBoard = hexBoard
    this._layout = layout
    this._svg = svg
    this._tokenOffsetFactor = 15 / this._layout.size.y
  }

  drawHex(hex: Hex): void {
    const group = this._createSvgGroup(hex)
    const polygon = this._createHexPolygon(hex)
    const text = this._createHexText(hex)

    group.appendChild(polygon)
    group.appendChild(text)

    this._svg.appendChild(group)
    this._renderTokenStack(hex)
  }

  handleHexClick(hex: Hex): void {
    const selectedColor = this._getSelectedColor() ?? 'Blue'

    try {
      hex.tokens.push(new Token(TokenType[selectedColor as keyof typeof TokenType]))
      this._renderTokenStack(hex)
      if (this.afterHexClick) this.afterHexClick()
    } catch (error) {
      console.error((error as Error).message)
    }
  }

  render(): void {
    this._hexBoard.hexes.forEach((hex) => this.drawHex(hex))
  }

  private _renderTokenStack(hex: Hex): void {
    let tokenStackGroup = this._svg.querySelector(`#hex-${hex.q}-${hex.r} .${SvgRenderer.TOKEN_STACK_CLASS}`)
    if (!tokenStackGroup) {
      tokenStackGroup = document.createElementNS(SvgRenderer.SVG_NAMESPACE, 'g')
      tokenStackGroup.setAttribute('class', SvgRenderer.TOKEN_STACK_CLASS)
      const hexGroup = this._svg.querySelector(`#hex-${hex.q}-${hex.r}`)
      if (hexGroup) {
        hexGroup.appendChild(tokenStackGroup)
      } else {
        console.error(`Hex group not found for hex (${hex.q}, ${hex.r})`)
      }
    }

    this._clearTokenStack(tokenStackGroup as SVGGElement)
    this._renderTokens(hex, tokenStackGroup as SVGGElement)
  }

  private _createSvgGroup(hex: Hex): SVGGElement {
    const group = document.createElementNS(SvgRenderer.SVG_NAMESPACE, 'g')
    group.setAttribute('id', `hex-${hex.q}-${hex.r}`)
    group.addEventListener('click', () => this.handleHexClick(hex))
    return group
  }

  private _createHexPolygon(hex: Hex): SVGPolygonElement {
    const polygon = document.createElementNS(SvgRenderer.SVG_NAMESPACE, 'polygon')
    const corners = this._layout.polygonCorners(hex)
    const points = corners.map((p) => `${p.x.toFixed(5)},${p.y.toFixed(5)}`).join(' ')

    polygon.setAttribute('class', SvgRenderer.HEX_CLASS)
    polygon.setAttribute('points', points)
    polygon.setAttribute('data-coords', `${hex.q},${hex.r},${hex.s}`)
    return polygon
  }

  private _createHexText(hex: Hex): SVGTextElement {
    const text = document.createElementNS(SvgRenderer.SVG_NAMESPACE, 'text')
    const center = this._layout.hexToPixel(hex)

    text.setAttribute('x', center.x.toFixed(5))
    text.setAttribute('y', (center.y - this._layout.size.y * 0.6).toFixed(5))
    text.setAttribute('class', SvgRenderer.COORDS_CLASS)
    text.textContent = `${hex.q} ${hex.r} ${hex.s}`
    return text
  }

  private _getSelectedColor(): string | null {
    const selectedRadioBtn: HTMLInputElement | null = document.querySelector('input[name="color"]:checked')
    if (!selectedRadioBtn) {
      console.error('No color selected')
      return null
    }
    return selectedRadioBtn.value
  }

  private _clearTokenStack(tokenStackGroup: SVGGElement): void {
    tokenStackGroup.innerHTML = ''
  }

  private _renderTokens(hex: Hex, tokenStackGroup: SVGGElement): void {
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
    const svgNamespace = SvgRenderer.SVG_NAMESPACE
    const svg = document.createElementNS(svgNamespace, 'svg')
    svg.setAttribute('class', tokenClass)
    svg.setAttribute('width', `${this._layout.size.x * 0.95}`)
    svg.setAttribute('height', `${this._layout.size.y}`)
    svg.setAttribute('viewBox', '0 0 277 161')
    svg.setAttribute('xmlns', svgNamespace)

    const mask = document.createElementNS(svgNamespace, 'mask')
    mask.setAttribute('id', 'mask')
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

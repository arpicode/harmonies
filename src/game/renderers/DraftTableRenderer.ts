import DraftTable from '../../board/DraftTable'
import { GameMode } from '../Game'
import GameState from '../GameState'
import { SVG_NAMESPACE } from '../../utils/utils'
import IRenderer from '../interfaces/IRenderer'

export default class DraftTableRenderer implements IRenderer {
  public static readonly DRAFT_TABLE_WRAPPER_CLASS = 'draft-table-wrapper'
  public static readonly TABLE_IMAGES = {
    solo: 'draft_table_solo.webp',
    multiplayer: 'draft_table.webp',
  } as Record<GameMode, string>
  public static readonly WIDTH = 666
  public static readonly HEIGHT = 675
  public static readonly SLOT_RADIUS = 235

  private _gameState: GameState
  private _draftTableState: DraftTable
  private _svg: SVGGElement

  constructor(gameState: GameState) {
    console.time('[Initialize] DraftTable')
    this._gameState = gameState
    this._draftTableState = gameState.draftTable
    this._svg = this._createDraftTableSVGOverlayElement()
    this._initializeDraftTableDOM()
    this._gameState.on('draftTableUpdated', () => this.render())
    console.timeEnd('[Initialize] DraftTable')
  }

  render(): void {
    console.time('[Render] DraftTable')
    this._appendTokensToAllSlots()
    this._appendTokensToTokenHolder()
    console.timeEnd('[Render] DraftTable')
  }

  private _initializeDraftTableDOM(): void {
    const draftTableWrapper = document.querySelector(`.${DraftTableRenderer.DRAFT_TABLE_WRAPPER_CLASS}`)
    if (!draftTableWrapper) throw new Error('No draft table wrapper found')

    const img = this._createDraftTableImageElement()
    draftTableWrapper.appendChild(img)
    draftTableWrapper.appendChild(this._svg)
    this._createGradientDefs()
    this._createSlotGroups()
    this._createTokenGroups()
  }

  private _createDraftTableImageElement(): HTMLImageElement {
    const img = document.createElement('img')
    img.className = 'draft-table-image'
    img.src = DraftTableRenderer.TABLE_IMAGES[this._draftTableState.gameMode]
    img.alt = 'Draft table'
    return img
  }

  private _createDraftTableSVGOverlayElement(): SVGGElement {
    const svg = document.createElementNS(SVG_NAMESPACE, 'svg') as SVGGElement
    svg.setAttribute('class', 'draft-table-svg-overlay')
    svg.setAttribute('viewBox', `0 0 ${DraftTableRenderer.WIDTH} ${DraftTableRenderer.HEIGHT}`)
    svg.setAttribute('xmlns', SVG_NAMESPACE)
    return svg
  }

  private _createGradientDefs(): void {
    const defs = document.createElementNS(SVG_NAMESPACE, 'defs')

    const radialGradient = document.createElementNS(SVG_NAMESPACE, 'radialGradient')
    radialGradient.setAttribute('id', 'hover-gradient')
    radialGradient.setAttribute('cx', '50%')
    radialGradient.setAttribute('cy', '50%')
    radialGradient.setAttribute('r', '50%')
    radialGradient.setAttribute('fx', '50%')
    radialGradient.setAttribute('fy', '50%')

    const stop1 = document.createElementNS(SVG_NAMESPACE, 'stop')
    stop1.setAttribute('offset', '0%')
    stop1.setAttribute('style', 'stop-color:rgba(255, 255, 255, 1); stop-opacity:0.25')

    const stop2 = document.createElementNS(SVG_NAMESPACE, 'stop')
    stop2.setAttribute('offset', '100%')
    stop2.setAttribute('style', 'stop-color:rgba(255, 255, 255, 0); stop-opacity:0')

    radialGradient.appendChild(stop1)
    radialGradient.appendChild(stop2)

    defs.appendChild(radialGradient)

    this._svg.appendChild(defs)
  }

  private _createSlotGroups(): void {
    const centerX = DraftTableRenderer.WIDTH / 2
    const centerY = DraftTableRenderer.HEIGHT / 2
    const angleOffset = Math.PI / 2
    const angle = (2 * Math.PI) / DraftTable.MAX_SLOTS_MULTIPLAYER

    for (let i = 0; i < this._draftTableState.slotCount; i++) {
      const adjustedAngle = angle * i - angleOffset
      const { x: adjX, y: adjY } = this._adjustSlotCenter(i)
      const x = centerX + adjX + DraftTableRenderer.SLOT_RADIUS * Math.cos(adjustedAngle)
      const y = centerY + adjY + DraftTableRenderer.SLOT_RADIUS * Math.sin(adjustedAngle)

      const group = document.createElementNS(SVG_NAMESPACE, 'g')
      group.setAttribute('data-slot-group-index', i.toString())
      group.setAttribute('data-center', `${x.toFixed(2)},${y.toFixed(2)}`)

      const circle = document.createElementNS(SVG_NAMESPACE, 'circle')
      circle.setAttribute('cx', x.toString())
      circle.setAttribute('cy', y.toString())
      circle.setAttribute('r', '82')
      circle.setAttribute('class', 'draft-table-slot')
      circle.setAttribute('data-slot-index', i.toString())
      group.appendChild(circle)

      this._svg.appendChild(group)
    }
  }

  // private _createTokenHolder(): void {
  //   const container = document.querySelector('.picked-tokens-wrapper')
  //   if (!container) throw new Error('No picked tokens wrapper found')

  //   const tokenHolder = document.createElement('div')
  //   tokenHolder.className = 'token-holder'
  //   container.appendChild(tokenHolder)
  // }

  private _appendTokensToTokenHolder(): void {
    const tokenHolder = document.querySelector('.picked-tokens-wrapper')
    if (!tokenHolder) throw new Error('No picked tokens wrapper found')
    tokenHolder.innerHTML = ''

    this._draftTableState.draftedTokens.tokens.forEach((token) => {
      const tokenHolderSlot = document.createElement('div')
      tokenHolderSlot.className = 'picked-token'
      tokenHolderSlot.setAttribute('draggable', 'true')
      const tokenType = token.type.toLowerCase()
      const tokenTypeCapitalized = tokenType.charAt(0).toUpperCase() + tokenType.slice(1)
      tokenHolderSlot.setAttribute('data-token-type', tokenTypeCapitalized)

      const svgToken = this._createSvgTokenElement(tokenType)
      tokenHolderSlot.appendChild(svgToken)

      tokenHolder.appendChild(tokenHolderSlot)
    })
  }

  private _createTokenGroups(): void {
    this._draftTableState.slots.forEach((_, i) => {
      const slotTokensGroup = document.createElementNS(SVG_NAMESPACE, 'g')
      slotTokensGroup.setAttribute('class', 'slot-tokens')
      slotTokensGroup.setAttribute('data-slot-tokens-index', i.toString())
      const slotGroup = this._svg.querySelector(`[data-slot-group-index="${i}"]`)

      if (slotGroup) slotGroup.appendChild(slotTokensGroup)
    })
  }

  private _appendTokensToSlot(slotIndex: number): void {
    const slotTokensGroup = this._svg.querySelector(`[data-slot-group-index="${slotIndex}"]`)
    if (!slotTokensGroup) throw new Error(`No slot tokens group found for slot ${slotIndex}`)
    const center = slotTokensGroup.getAttribute('data-center')?.split(',').map(parseFloat)
    const slotTokens = slotTokensGroup.querySelector(`[data-slot-tokens-index="${slotIndex}"]`)
    if (!slotTokens) throw new Error(`No slot tokens found for slot ${slotIndex}`)

    this._draftTableState.slots[slotIndex].forEach((token, i) => {
      const tokenClass = token.type.toLowerCase()
      const svgToken = this._createSvgTokenElement(tokenClass)

      if (center) {
        const x = center[0]
        const y = center[1]

        // Define the offsets for the triangle formation using distanceToCenter
        const distanceToCenter = 50
        const offsets = [
          { x: 7, y: -distanceToCenter + 30 }, // Top
          { x: -distanceToCenter * Math.cos(Math.PI / 6) + 10, y: distanceToCenter * Math.sin(Math.PI / 6) }, // Bottom-left
          { x: distanceToCenter * Math.cos(Math.PI / 6), y: distanceToCenter * Math.sin(Math.PI / 6) }, // Bottom-right
        ]

        // Get the offset for the current token
        const offset = offsets[i % 3]

        // Set the position of the token
        svgToken.setAttribute('x', (x + offset.x - 35).toFixed(2))
        svgToken.setAttribute('y', (y + offset.y - 125).toFixed(2))
        svgToken.id = `token-${slotIndex}-${i}`
      }

      // Append the token to the slot tokens group

      // Append the slot tokens group to the slot group
      slotTokens.appendChild(svgToken)
    })
  }

  private _appendTokensToAllSlots(): void {
    this._draftTableState.slots.forEach((_, i) => this._appendTokensToSlot(i))
  }

  private _createSvgTokenElement(tokenClass: string): SVGElement {
    const svgNamespace = SVG_NAMESPACE
    const svg = document.createElementNS(svgNamespace, 'svg')
    svg.setAttribute('class', tokenClass)
    svg.setAttribute('width', `${DraftTableRenderer.SLOT_RADIUS * 0.25}`)
    svg.setAttribute('height', `${DraftTableRenderer.SLOT_RADIUS}`)
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

  private _adjustSlotCenter(slot: number): { x: number; y: number } {
    if (this._draftTableState.gameMode === 'solo') {
      switch (slot) {
        case 0:
          return { x: -106, y: 165 }
        case 1:
          return { x: -115, y: 3 }
        case 2:
          return { x: -139, y: -80 }
      }
    }
    switch (slot) {
      case 0:
        return { x: 2, y: 6 }
      case 1:
        return { x: 0, y: 0 }
      case 2:
        return { x: 5, y: 5 }
      case 3:
        return { x: 6, y: 4 }
      default:
        return { x: 0, y: 0 }
    }
  }
}

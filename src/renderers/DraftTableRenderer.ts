import DraftTable from '../board/DraftTable'
import SvgRenderer from './SvgRenderer'

export default class DraftTableRenderer {
  public static readonly WIDTH = 666
  public static readonly HEIGHT = 675
  public static readonly SLOT_RADIUS = 235

  private _draftTable: DraftTable
  private _svg: SVGGElement

  constructor(draftTable: DraftTable, svg: SVGGElement) {
    this._draftTable = draftTable
    this._svg = svg
  }

  private _createGradientDefs(): void {
    // Create the <defs> element
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')

    // Create the <radialGradient> element
    const radialGradient = document.createElementNS('http://www.w3.org/2000/svg', 'radialGradient')
    radialGradient.setAttribute('id', 'hover-gradient')
    radialGradient.setAttribute('cx', '50%')
    radialGradient.setAttribute('cy', '50%')
    radialGradient.setAttribute('r', '50%')
    radialGradient.setAttribute('fx', '50%')
    radialGradient.setAttribute('fy', '50%')

    // Create the <stop> elements
    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop')
    stop1.setAttribute('offset', '0%')
    stop1.setAttribute('style', 'stop-color:rgba(255, 255, 255, 1); stop-opacity:0.25')

    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop')
    stop2.setAttribute('offset', '100%')
    stop2.setAttribute('style', 'stop-color:rgba(255, 255, 255, 0); stop-opacity:0')

    // Append the stops to the radialGradient
    radialGradient.appendChild(stop1)
    radialGradient.appendChild(stop2)

    // Append the radialGradient to the defs
    defs.appendChild(radialGradient)

    // Append the defs to the SVG
    this._svg.appendChild(defs)
  }

  drawSlots(): void {
    this._createGradientDefs()

    const centerX = DraftTableRenderer.WIDTH / 2
    const centerY = DraftTableRenderer.HEIGHT / 2
    // TODO: Calculate the angleOffset based on first player
    const angleOffset = Math.PI / 2 // 90 degrees in radians (player-1)
    const angle = (2 * Math.PI) / DraftTable.MAX_SLOTS_MULTIPLAYER

    for (let i = 0; i < DraftTable.MAX_SLOTS_MULTIPLAYER; i++) {
      const adjustedAngle = angle * i - angleOffset
      const { x: adjX, y: adjY } = this._adjustSlotCenter(i)
      const x = centerX + adjX + DraftTableRenderer.SLOT_RADIUS * Math.cos(adjustedAngle)
      const y = centerY + adjY + DraftTableRenderer.SLOT_RADIUS * Math.sin(adjustedAngle)

      // Create a <g> element
      const group = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      group.setAttribute('data-slot', i.toString())
      group.setAttribute('data-center', `${x.toFixed(2)},${y.toFixed(2)}`)

      // Create the circle element
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
      circle.setAttribute('cx', x.toString())
      circle.setAttribute('cy', y.toString())
      circle.setAttribute('r', '82')
      circle.setAttribute('class', 'draft-table-slot')
      circle.addEventListener('click', this.handleDraftTableSlotClick.bind(this))

      // Append the circle to the <g> element
      group.appendChild(circle)

      // Append the <g> element to the SVG
      this._svg.appendChild(group)
    }

    this._drawTokens()
  }

  handleDraftTableSlotClick(event: MouseEvent): void {
    const target = event.currentTarget as SVGElement
    const slotGroup = target.closest('g[data-slot]')
    if (!slotGroup) return

    const tokens = slotGroup.querySelectorAll('svg')
    console.log(tokens)
    if (tokens.length === 0) {
      console.log('No tokens in the slot')
      return
    }
    const tokenHolder = document.querySelector('.token-holder')
    if (!tokenHolder) return
    tokenHolder.innerHTML = ''

    tokens.forEach((token) => {
      tokenHolder.appendChild(token)
    })
  }

  /**
   * Draws tokens in the slots.
   */
  private _drawTokens(): void {
    const distanceToCenter = 50

    this._draftTable.slots.forEach((slot, i) => {
      // Create a <g> element for the slot tokens
      const slotTokensGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      slotTokensGroup.setAttribute('class', 'slot-tokens')

      slot.forEach((token, j) => {
        const tokenClass = token.type.toLowerCase()
        const svgToken = this._createSvgTokenElement(tokenClass)
        const slotGroup = this._svg.querySelector(`[data-slot="${i}"]`)
        const center = slotGroup?.getAttribute('data-center')?.split(',').map(parseFloat)

        if (center) {
          const x = center[0]
          const y = center[1]

          // Define the offsets for the triangle formation using distanceToCenter
          const offsets = [
            { x: 7, y: -distanceToCenter + 30 }, // Top
            { x: -distanceToCenter * Math.cos(Math.PI / 6) + 10, y: distanceToCenter * Math.sin(Math.PI / 6) }, // Bottom-left
            { x: distanceToCenter * Math.cos(Math.PI / 6), y: distanceToCenter * Math.sin(Math.PI / 6) }, // Bottom-right
          ]

          // Get the offset for the current token
          const offset = offsets[j % 3]

          // Set the position of the token
          svgToken.setAttribute('x', (x + offset.x - 35).toFixed(2))
          svgToken.setAttribute('y', (y + offset.y - 125).toFixed(2))
          svgToken.id = `token-${i}-${j}`
        }

        // Append the token to the slot tokens group
        slotTokensGroup.appendChild(svgToken)
      })

      // Append the slot tokens group to the slot group
      const slotGroup = this._svg.querySelector(`[data-slot="${i}"]`)
      if (slotGroup) {
        slotGroup.appendChild(slotTokensGroup)
      }
    })
  }

  private _createSvgTokenElement(tokenClass: string): SVGElement {
    const svgNamespace = SvgRenderer.SVG_NAMESPACE
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

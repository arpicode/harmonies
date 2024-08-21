import { MockInstance } from 'vitest'
import { Hex } from '../board/Hex'
import { HexBoard } from '../board/HexBoard'
import { Layout, LAYOUT_FLAT } from '../board/Layout'
import SvgRenderer from '../SvgRenderer'
import { TokenType } from '../board/Token'

describe('SvgRenderer', () => {
  let hexBoard: HexBoard
  let layout: Layout
  let svg: SVGGElement
  let svgRenderer: SvgRenderer
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let consoleErrorSpy: MockInstance

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {
      /* empty body */
    })
    hexBoard = new HexBoard(5, 5)
    layout = new Layout(LAYOUT_FLAT, { x: 40, y: 40 }, { x: 50, y: 50 })
    svg = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    svgRenderer = new SvgRenderer(hexBoard, layout, svg)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should draw a hex correctly', () => {
    const hex = new Hex(0, 0, 0)
    svgRenderer.drawHex(hex)
    const group = svg.querySelector(`#hex-0-0`)
    expect(group).not.toBeNull()
    expect(group?.querySelector('polygon')).not.toBeNull()
    expect(group?.querySelector('text')).not.toBeNull()
  })

  it('should handle hex click correctly', () => {
    const hex = new Hex(0, 0, 0)
    svgRenderer.drawHex(hex)
    const group = svg.querySelector(`#hex-0-0`)
    const event = new Event('click')
    group?.dispatchEvent(event)
    expect(hex.tokens.size()).toBe(1)
    expect(hex.tokens.peek()?.type).toBe(TokenType.Blue)
  })

  it('should render all hexes correctly', () => {
    const drawHexSpy = vi.spyOn(svgRenderer, 'drawHex')
    svgRenderer.render()
    expect(drawHexSpy).toHaveBeenCalledTimes(hexBoard.hexes.size)
  })

  it('should render token stack correctly', () => {
    svgRenderer.render()

    const hexGroup = svg.querySelector(`#hex-0-0`)
    const tokenStackGroup = hexGroup?.querySelector(`.token-stack`)
    expect(hexGroup).not.toBeNull()
    expect(tokenStackGroup?.children.length).toBe(0)
    hexGroup?.dispatchEvent(new Event('click'))

    expect(tokenStackGroup).not.toBeNull()
    expect(tokenStackGroup?.children.length).toBe(1)
  })

  it('should handle hex click without selected color', () => {
    const hex = new Hex(0, 0, 0)
    svgRenderer.drawHex(hex)
    const group = svg.querySelector(`#hex-0-0`)
    const event = new Event('click')
    group?.dispatchEvent(event)
    expect(hex.tokens.size()).toBe(1)
    expect(hex.tokens.peek()?.type).toBe(TokenType.Blue)
  })

  it('should render hexes correctly after layout change', () => {
    layout = new Layout(LAYOUT_FLAT, { x: 50, y: 50 }, { x: 60, y: 60 })
    svgRenderer = new SvgRenderer(hexBoard, layout, svg)
    svgRenderer.render()

    hexBoard.hexes.forEach((hex) => {
      const group = svg.querySelector(`#hex-${hex.q}-${hex.r}`)
      expect(group).not.toBeNull()
      expect(group?.querySelector('polygon')).not.toBeNull()
      expect(group?.querySelector('text')).not.toBeNull()
    })
  })
})

import { MockInstance } from 'vitest'
import { Hex } from '../../board/Hex'
import { HexBoard } from '../../board/HexBoard'
import { Layout, LAYOUT_FLAT } from '../../board/Layout'
import HexBoardRenderer from '../HexBoardRenderer'
import Token, { TokenType } from '../../board/Token'
import { SVG_NAMESPACE } from '../../utils/utils'

describe('HexBoardRenderer', () => {
  let hexBoard: HexBoard
  let layout: Layout
  let svg: SVGGElement
  let hexBoardRenderer: HexBoardRenderer
  let consoleErrorSpy: MockInstance
  let gameBoardWrapper: HTMLElement

  beforeEach(() => {
    gameBoardWrapper = document.createElement('div')
    gameBoardWrapper.className = HexBoardRenderer.GAME_BOARD_WRAPPER_CLASS
    document.body.appendChild(gameBoardWrapper)

    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {
      /* empty body */
    })
    hexBoard = new HexBoard(5, 5, 'river')
    layout = new Layout(LAYOUT_FLAT, { x: 40, y: 40 }, { x: 50, y: 50 })
    svg = document.createElementNS(SVG_NAMESPACE, 'g')
    hexBoardRenderer = new HexBoardRenderer(hexBoard, layout, svg)
  })

  afterEach(() => {
    document.body.innerHTML = ''
    vi.restoreAllMocks()
  })

  it('should draw a hex correctly', () => {
    const hex = new Hex(0, 0, 0)
    hexBoardRenderer.drawHex(hex)
    const group = svg.querySelector(`#hex-0-0`)
    expect(group).not.toBeNull()
    expect(group?.querySelector('polygon')).not.toBeNull()
    expect(group?.querySelector('text')).not.toBeNull()
  })

  it('should draw a hex with 0 tokens correctly', () => {
    const hex = new Hex(0, 0, 0)
    hexBoardRenderer.drawHex(hex)
    const tokenStack = svg.querySelectorAll(`#hex-0-0 .token-stack svg`)
    expect(tokenStack.length).toBe(0)
  })

  it('should draw a hex with 1 token correctly', () => {
    const hex = new Hex(0, 0, 0)
    hex.tokens.push(new Token(TokenType.Gray))
    hexBoardRenderer.drawHex(hex)
    const tokenStack = svg.querySelectorAll(`#hex-0-0 .token-stack svg`)
    expect(tokenStack.length).toBe(1)
  })

  it('should draw a hex with 2 tokens correctly', () => {
    const hex = new Hex(0, 0, 0)
    hex.tokens.push(new Token(TokenType.Gray))
    hex.tokens.push(new Token(TokenType.Gray))
    hexBoardRenderer.drawHex(hex)
    const tokenStack = svg.querySelectorAll(`#hex-0-0 .token-stack svg`)
    expect(tokenStack.length).toBe(2)
  })

  it('should draw a hex with 3 tokens correctly', () => {
    const hex = new Hex(0, 0, 0)
    hex.tokens.push(new Token(TokenType.Gray))
    hex.tokens.push(new Token(TokenType.Gray))
    hex.tokens.push(new Token(TokenType.Gray))
    hexBoardRenderer.drawHex(hex)
    const tokenStack = svg.querySelectorAll(`#hex-0-0 .token-stack svg`)
    expect(tokenStack.length).toBe(3)
  })

  it('should render all hexes correctly', () => {
    const drawHexSpy = vi.spyOn(hexBoardRenderer, 'drawHex')
    hexBoardRenderer.render()
    expect(drawHexSpy).toHaveBeenCalledTimes(hexBoard.hexes.size)
  })

  it('should handle hex click correctly', () => {
    const hex = new Hex(0, 0, 0)
    hexBoardRenderer.drawHex(hex)
    const group = svg.querySelector(`#hex-0-0`)
    const event = new Event('click')
    group?.dispatchEvent(event)
    expect(hex.tokens.size()).toBe(1)
    expect(hex.tokens.peek()?.type).toBe(TokenType.Blue)
  })

  it('should render token stack correctly', () => {
    hexBoardRenderer.render()

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
    hexBoardRenderer.drawHex(hex)
    const group = svg.querySelector(`#hex-0-0`)
    const event = new Event('click')
    group?.dispatchEvent(event)
    expect(hex.tokens.size()).toBe(1)
    expect(hex.tokens.peek()?.type).toBe(TokenType.Blue)
  })

  it('should render hexes correctly after layout change', () => {
    layout = new Layout(LAYOUT_FLAT, { x: 50, y: 50 }, { x: 60, y: 60 })
    hexBoardRenderer = new HexBoardRenderer(hexBoard, layout, svg)
    hexBoardRenderer.render()

    hexBoard.hexes.forEach((hex) => {
      const group = svg.querySelector(`#hex-${hex.q}-${hex.r}`)
      expect(group).not.toBeNull()
      expect(group?.querySelector('polygon')).not.toBeNull()
      expect(group?.querySelector('text')).not.toBeNull()
    })
  })

  it('should log an error if game board wrapper is not found', () => {
    document.body.innerHTML = ''
    hexBoardRenderer.render()
    expect(consoleErrorSpy).toHaveBeenCalledWith('Game board wrapper not found')
  })

  it('should update game board wrapper with river image and SVG', () => {
    hexBoardRenderer.render()

    expect(gameBoardWrapper.innerHTML).toContain(
      `<img class="hex-board" src="${HexBoardRenderer.BOARD_IMAGES.river}" alt="Hex board">`
    )
    expect(gameBoardWrapper.contains(svg)).toBe(true)
  })

  it('should update game board wrapper with island image and SVG', () => {
    hexBoard = new HexBoard(5, 5, 'island')
    hexBoardRenderer = new HexBoardRenderer(hexBoard, layout, svg)
    hexBoardRenderer.render()

    expect(gameBoardWrapper.innerHTML).toContain(
      `<img class="hex-board" src="${HexBoardRenderer.BOARD_IMAGES.island}" alt="Hex board">`
    )
    expect(gameBoardWrapper.contains(svg)).toBe(true)
  })

  it('should update game board wrapper with no image and SVG', () => {
    hexBoard = new HexBoard(5, 5, 'custom')
    hexBoardRenderer = new HexBoardRenderer(hexBoard, layout, svg)
    hexBoardRenderer.render()

    expect(gameBoardWrapper.innerHTML).not.toContain(`img class="hex-board"`)
    expect(gameBoardWrapper.contains(svg)).toBe(true)
  })
})

import HexBoardRenderer from '../HexBoardRenderer'
import { SVG_NAMESPACE } from '../../../utils/utils'
import GameState from '../../GameState'
import AnimalCard, { IAnimalCards } from '~/board/AnimalCard'
import { HexBoardType } from '../../../board/HexBoard'
import Token, { TokenType } from '../../../board/Token'
import { dom } from '../../../dom'

import animalsJson from '../../../animals.json'
import { Hex } from '~/board/Hex'
const animals = animalsJson as IAnimalCards

describe('HexBoardRenderer', () => {
  let svg: SVGGElement
  let hexBoardRenderer: HexBoardRenderer
  let gameState: GameState
  const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(vi.fn())
  const consoleTimeSpy = vi.spyOn(console, 'time').mockImplementation(vi.fn())
  const consoleTimeEndSpy = vi.spyOn(console, 'timeEnd').mockImplementation(vi.fn())

  afterEach(() => {
    vi.clearAllMocks()
  })

  const initializeHexBoard = (type: HexBoardType): void => {
    document.body.innerHTML = dom
    gameState = new GameState('solo', type)
    svg = document.createElementNS(SVG_NAMESPACE, 'g')
    hexBoardRenderer = new HexBoardRenderer(gameState, svg)
  }

  it.each`
    type
    ${'river'}
    ${'island'}
    ${'custom'}
  `('should create a HexBoardRenderer instance', ({ type }: { type: HexBoardType }) => {
    initializeHexBoard(type)
    expect(hexBoardRenderer).toBeInstanceOf(HexBoardRenderer)
    expect(consoleTimeSpy).toHaveBeenCalledTimes(1)
    expect(consoleTimeEndSpy).toHaveBeenCalledTimes(1)
  })

  it.each`
    type
    ${'river'}
    ${'island'}
    ${'custom'}
  `('should render all hexes of $type board', ({ type }: { type: HexBoardType }) => {
    initializeHexBoard(type)
    hexBoardRenderer.render()
    const svgHexes = svg.querySelectorAll('.hex')
    expect(svgHexes.length).toBe(gameState.hexBoard.hexes.size)
  })

  it.each`
    type
    ${'river'}
    ${'island'}
    ${'custom'}
  `('should throw an error if $type game board wrapper is not found', ({ type }: { type: HexBoardType }) => {
    initializeHexBoard(type)
    document.body.innerHTML = ''
    expect(() => new HexBoardRenderer(gameState, svg)).toThrow('Game board wrapper not found')
  })

  it.each`
    type
    ${'river'}
    ${'island'}
    ${'custom'}
  `('should throw an error when hex group is not found', ({ type }: { type: HexBoardType }) => {
    initializeHexBoard(type)
    const group = svg.querySelector('#hex-0-0')
    group?.remove()
    expect(() => hexBoardRenderer.render()).toThrow('Token stack group not found for hex (0, 0)')
  })

  it.each`
    type        | imageSrc
    ${'river'}  | ${HexBoardRenderer.BOARD_IMAGES.river}
    ${'island'} | ${HexBoardRenderer.BOARD_IMAGES.island}
  `(
    'should update game board wrapper with $type image and SVG',
    ({ type, imageSrc }: { type: HexBoardType; imageSrc: string }) => {
      initializeHexBoard(type)
      hexBoardRenderer.render()
      const image = document.querySelector('.hex-board')
      expect(image?.getAttribute('src')).toBe(imageSrc)
      expect(document.contains(svg)).toBe(true)
    }
  )

  it('should update game board wrapper with no image and SVG', () => {
    initializeHexBoard('custom')
    hexBoardRenderer.render()
    const image = document.querySelector('.hex-board')
    expect(document.contains(svg)).toBe(true)
    expect(image).toBeNull()
  })

  it.each`
    type
    ${'river'}
    ${'island'}
    ${'custom'}
  `('should render tokens stack groups for all hexes of $type board', ({ type }: { type: HexBoardType }) => {
    initializeHexBoard(type)
    hexBoardRenderer.render()
    const svgTokens = svg.querySelectorAll('.token-stack')
    expect(svgTokens.length).toBe(gameState.hexBoard.hexes.size)
  })

  it.each`
    type
    ${'river'}
    ${'island'}
    ${'custom'}
  `('should render one token in the stack for all hexes of $type board', ({ type }: { type: HexBoardType }) => {
    initializeHexBoard(type)
    gameState.hexBoard.hexes.forEach((hex) => {
      hex.tokens.push(new Token(TokenType.Blue))
    })
    hexBoardRenderer.render()
    const tokenStackGroups = svg.querySelectorAll('.token-stack')
    tokenStackGroups.forEach((group) => {
      const tokens = group.querySelectorAll('.river')
      expect(tokens.length).toBe(1)
    })
    const tokens = svg.querySelectorAll('.river')
    expect(tokens.length).toBe(gameState.hexBoard.hexes.size)
  })

  it.each`
    type
    ${'river'}
    ${'island'}
    ${'custom'}
  `('should render two tokens tokens in the stack for all hexes of $type board', ({ type }: { type: HexBoardType }) => {
    initializeHexBoard(type)
    gameState.hexBoard.hexes.forEach((hex) => {
      hex.tokens.push(new Token(TokenType.Brown))
      hex.tokens.push(new Token(TokenType.Brown))
    })
    hexBoardRenderer.render()
    const tokenStackGroups = svg.querySelectorAll('.token-stack')
    tokenStackGroups.forEach((group) => {
      const tokens = group.querySelectorAll('.wood')
      expect(tokens.length).toBe(2)
    })
    const tokens = svg.querySelectorAll('.wood')
    expect(tokens.length).toBe(gameState.hexBoard.hexes.size * 2)
  })

  it.each`
    type
    ${'river'}
    ${'island'}
    ${'custom'}
  `(
    'should render three tokens tokens in the stack for all hexes of $type board',
    ({ type }: { type: HexBoardType }) => {
      initializeHexBoard(type)
      gameState.hexBoard.hexes.forEach((hex) => {
        hex.tokens.push(new Token(TokenType.Gray))
        hex.tokens.push(new Token(TokenType.Gray))
        hex.tokens.push(new Token(TokenType.Gray))
      })
      hexBoardRenderer.render()
      const tokenStackGroups = svg.querySelectorAll('.token-stack')
      tokenStackGroups.forEach((group) => {
        const tokens = group.querySelectorAll('.mountain')
        expect(tokens.length).toBe(3)
      })
      const tokens = svg.querySelectorAll('.mountain')
      expect(tokens.length).toBe(gameState.hexBoard.hexes.size * 3)
    }
  )

  describe('animal placement', () => {
    it('should highlight the hexes where the animal can be placed', () => {
      initializeHexBoard('river')
      hexBoardRenderer.render()
      const animal = new AnimalCard(animals.bee)
      const spawnHexes = [new Hex(0, 0, 0), new Hex(1, 0, -1)]
      gameState.notifyPlaceAnimalStart(animal, spawnHexes)
      const highlightedHexes = svg.querySelectorAll(`[class*=highlight-ecosystem-${animal.ecosystem.toLowerCase()}]`)
      expect(highlightedHexes.length).toBe(2)
      expect(consoleLogSpy).toHaveBeenCalledTimes(1)
    })

    it('should clear the highlighted hexes when the animal is placed', () => {
      initializeHexBoard('river')
      hexBoardRenderer.render()
      const animal = new AnimalCard(animals.bee)
      const spawnHexes = [new Hex(0, 0, 0), new Hex(1, 0, -1)]
      gameState.notifyPlaceAnimalStart(animal, spawnHexes)
      let highlightedHexes = svg.querySelectorAll(`[class*=highlight-ecosystem-${animal.ecosystem.toLowerCase()}]`)
      expect(highlightedHexes.length).toBe(2)

      gameState.notifyPlaceAnimalCancel(animal)
      highlightedHexes = svg.querySelectorAll(`[class*=highlight-ecosystem-${animal.ecosystem.toLowerCase()}]`)
      expect(highlightedHexes.length).toBe(0)

      expect(consoleLogSpy).toHaveBeenCalledTimes(2)
    })

    it('should render the animal on the hex where it is placed', () => {
      initializeHexBoard('river')
      hexBoardRenderer.render()
      const animal = new AnimalCard(animals.bee)
      const spawnHex = new Hex(0, 0, 0)
      spawnHex.isSpawn = true
      const spawnHexes = [spawnHex]
      gameState.notifyPlaceAnimalStart(animal, spawnHexes)
      gameState.notifyPlaceAnimalEnd(animal, spawnHex)
      const animalGroup = svg.querySelector('.placed-cube-token')
      expect(animalGroup).not.toBeNull()

      expect(consoleLogSpy).toHaveBeenCalledTimes(2)
    })

    it('should not render the animal on the hex when the hex is not a spawn', () => {
      initializeHexBoard('river')
      hexBoardRenderer.render()
      const animal = new AnimalCard(animals.bee)
      const spawnHex = new Hex(0, 0, 0)
      const spawnHexes = [spawnHex]
      gameState.notifyPlaceAnimalStart(animal, spawnHexes)
      gameState.notifyPlaceAnimalEnd(animal, spawnHex)
      const animalGroup = svg.querySelector('.placed-cube-token')
      expect(animalGroup).toBeNull()

      expect(consoleLogSpy).toHaveBeenCalledTimes(2)
    })

    it('should throw an error when the hex group is not found for the animal', () => {
      initializeHexBoard('river')
      hexBoardRenderer.render()
      const animal = new AnimalCard(animals.bee)
      const spawnHex = new Hex(0, 0, 0)
      spawnHex.isSpawn = true
      const spawnHexes = [spawnHex]
      gameState.notifyPlaceAnimalStart(animal, spawnHexes)
      const group = svg.querySelector(`#hex-${spawnHex.q}-${spawnHex.r}`)
      group?.remove()
      expect(() => gameState.notifyPlaceAnimalEnd(animal, spawnHex)).toThrow(
        `Hex group not found for hex (${spawnHex.q}, ${spawnHex.r})`
      )

      expect(consoleLogSpy).toHaveBeenCalledTimes(2)
    })
  })
})

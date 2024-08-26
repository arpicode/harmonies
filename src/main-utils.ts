import { HexBoard, HexBoardType } from './board/HexBoard'
import { Layout, LAYOUT_FLAT } from './board/Layout'
import ScoreBoard from './board/ScoreBoard'
import GeneticAlgorithm from './genetic/GeneticAlgorithm'
import SvgRenderer from './SvgRenderer'
import Animal from './board/Animal'

export function testGaAndBoardRendering() {
  const layout = new Layout(LAYOUT_FLAT, { x: 33, y: 33 }, { x: 124, y: 59 })

  const ga = new GeneticAlgorithm(200, 0.0, 50)
  const ch = ga.run()
  const scoreBoard = new ScoreBoard(ch)

  const svg = document.getElementById('hex-board') as SVGGElement | null
  if (!svg) throw new Error('No SVG element found')

  const renderer = new SvgRenderer(ch as HexBoard, layout, svg)
  setHexBoardImage(ch.type)
  renderer.afterHexClick = updateScore
  renderer.render()
  console.log(scoreBoard.toString())

  function updateScore() {
    console.log(scoreBoard.toString())
  }
}

export function testHexBoardSides(side: HexBoardType) {
  const { hexBoard, layout } = createHexBoard(side)
  // const scoreBoard = new ScoreBoard(hexBoard)
  const svg = document.getElementById('hex-board') as SVGGElement | null
  if (!svg) throw new Error('No SVG element found')

  const renderer = new SvgRenderer(hexBoard, layout, svg)
  renderer.afterHexClick = () => {
    console.log(hexBoard.toString())
    console.log('hasPattern:', hexBoard.hasPattern(patternHexBoard))
  }
  renderer.render()

  const { hexBoard: patternHexBoard, layout: patternLayout } = createHexBoard('custom')
  const patternSvg = document.getElementById('hex-pattern') as SVGGElement | null
  if (!patternSvg) throw new Error('No SVG element found')
  const patternRenderer = new SvgRenderer(patternHexBoard, patternLayout, patternSvg)
  patternRenderer.afterHexClick = () => {
    console.log(patternHexBoard.toString())
    console.log('serialized:', patternHexBoard.serialize())
    console.log('hasPattern:', hexBoard.hasPattern(patternHexBoard))
  }
  patternRenderer.render()

  return hexBoard
}

function createRiverHexBoard() {
  setHexBoardImage('river')
  const hexBoard = new HexBoard(5, 5, 'river')
  const layout = new Layout(LAYOUT_FLAT, { x: 33, y: 33 }, { x: 124, y: 59 })

  return { hexBoard, layout }
}

function createIslandHexBoard() {
  setHexBoardImage('island')
  const hexBoard = new HexBoard(7, 4, 'island')
  const layout = new Layout(LAYOUT_FLAT, { x: 33.3, y: 33.3 }, { x: 76, y: 88 })

  return { hexBoard, layout }
}

function createCustomHexBoard() {
  setHexBoardImage('custom')
  const hexBoard = new HexBoard(0, 0, 'custom')
  hexBoard.addHex(0, 0)
  hexBoard.addHex(1, 0)
  hexBoard.addHex(1, -1)
  hexBoard.addHex(0, -1)
  hexBoard.addHex(-1, 0)
  hexBoard.addHex(-1, 1)
  hexBoard.addHex(0, 1)
  const layout = new Layout(LAYOUT_FLAT, { x: 33, y: 33 }, { x: 100, y: 100 })

  return { hexBoard, layout }
}

function setHexBoardImage(hexBoardType: HexBoardType) {
  const svgId: string = hexBoardType !== 'custom' ? 'hex-board' : 'hex-pattern'
  const img: HTMLImageElement | null = document.querySelector('.hex-board')
  const svg: SVGGElement | null = document.querySelector(`#${svgId}`)
  if (hexBoardType !== 'custom') {
    if (!img || !svg) throw new Error('Missing hex-board image or SVG element')
    img.src = `${hexBoardType}_map_800.png`
    svg.setAttribute('class', `hex-board--${hexBoardType}`)
  } else {
    if (!svg) throw new Error('Missing SVG element')
    svg.setAttribute('class', `hex-board--${hexBoardType}`)
  }
}

export function createHexBoard(hexBoardType: HexBoardType) {
  if (hexBoardType === 'custom') return createCustomHexBoard()
  setHexBoardImage(hexBoardType)
  return hexBoardType === 'river' ? createRiverHexBoard() : createIslandHexBoard()
}

export function initializeAnimalCards(hexBoard: HexBoard) {
  const animalCards = document.querySelectorAll('.animal-card')
  animalCards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      console.clear()
      card.classList.toggle('animal-card--selected')
      const animalKey = card.getAttribute('alt')
      if (!animalKey) throw new Error('Missing animal key')
      const animal = new Animal(animalKey)
      const matched = hexBoard.findAllMatchingPatterns(animal.pattern)
      if (matched.length === 0) console.log(`No match for: ${animal.name}`)
      console.log('Source Board:\n', hexBoard.toString())
      console.log(`Pattern (${animalKey}):\n`, animal.pattern.toString())
    })
    card.addEventListener('mouseleave', () => {
      card.classList.toggle('animal-card--selected')
    })
  })
}

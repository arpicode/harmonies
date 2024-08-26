import './style.scss'
import { initializeAnimalCards, testHexBoardSides } from './main-utils'

const hexBoard = testHexBoardSides('river')
initializeAnimalCards(hexBoard)

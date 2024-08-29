import './style.scss'
import { initializeAnimalCards, initializeDraftTable, testHexBoardSides } from './main-utils'

const hexBoard = testHexBoardSides('river')
initializeAnimalCards(hexBoard)
initializeDraftTable()

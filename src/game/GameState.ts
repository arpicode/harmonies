import AnimalCardDeck from '../board/AnimalCardDeck'
import Bag from '../board/Bag'
import DraftTable from '../board/DraftTable'
import { HexBoard, HexBoardType } from '../board/HexBoard'
import { Layout, LAYOUT_FLAT } from '../board/Layout'
import Token, { startingTokensMap } from '../board/Token'
import { GameMode } from './Game'
import animalsJson from '../animals.json'
import { IAnimalCards } from '../board/Animal'
import EventEmitter from './EventEmitter'

export default class GameState extends EventEmitter {
  public readonly gameMode: GameMode
  public readonly hexBoardType: HexBoardType
  public readonly layout: Layout
  public readonly hexBoard: HexBoard
  public readonly bag: Bag<Token>
  public readonly draftTable: DraftTable
  public readonly animalCardDeck: AnimalCardDeck

  constructor(gameMode: GameMode, hexBoardType: HexBoardType) {
    super()
    this.gameMode = gameMode
    this.hexBoardType = hexBoardType
    this.layout = this._createLayout()
    this.hexBoard = this._createHexBoard()
    this.bag = this._createBag()
    this.draftTable = this._createDraftTable()
    this.animalCardDeck = this._createAnimalCardDeck()
  }

  notifyHexBoardUpdate() {
    console.log('GameState: emitting hexBoardUpdated')
    this.emit('hexBoardUpdated')
  }

  notifyDraftTableUpdate() {
    console.log('GameState: emitting draftTableUpdated')
    this.emit('draftTableUpdated')
  }

  notifyAnimalCardDeckUpdate() {
    console.log('GameState: emitting animalCardDeckUpdated')
    this.emit('animalCardDeckUpdated')
  }

  private _createLayout(): Layout {
    switch (this.hexBoardType) {
      case 'river':
        return new Layout(LAYOUT_FLAT, { x: 59, y: 59 }, { x: 220, y: 103 })
      case 'island':
        return new Layout(LAYOUT_FLAT, { x: 59.6, y: 59.6 }, { x: 134, y: 156 })
      case 'custom':
        return new Layout(LAYOUT_FLAT, { x: 33, y: 33 }, { x: 100, y: 100 })
    }
  }

  private _createHexBoard(): HexBoard {
    switch (this.hexBoardType) {
      case 'river':
        return new HexBoard(5, 5, 'river')
      case 'island':
        return new HexBoard(7, 4, 'island')
      case 'custom': {
        const hexBoard = new HexBoard(0, 0, 'custom')
        hexBoard.addHex(0, 0)
        hexBoard.addHex(1, 0)
        hexBoard.addHex(1, -1)
        hexBoard.addHex(0, -1)
        hexBoard.addHex(-1, 0)
        hexBoard.addHex(-1, 1)
        hexBoard.addHex(0, 1)
        return hexBoard
      }
    }
  }

  private _createBag(): Bag<Token> {
    const bag = new Bag<Token>()
    for (const [type, count] of startingTokensMap) {
      for (let i = 0; i < count; i++) {
        bag.add(new Token(type))
      }
    }
    bag.shuffle()
    return bag
  }

  private _createDraftTable(): DraftTable {
    return new DraftTable(this.bag, this.gameMode)
  }

  private _createAnimalCardDeck(): AnimalCardDeck {
    return new AnimalCardDeck(animalsJson as IAnimalCards)
  }
}

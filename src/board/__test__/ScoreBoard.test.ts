import Token, { TokenType } from '../Token'
import { HexBoard } from '../HexBoard'
import ScoreBoard from '../ScoreBoard'
import { testRiverHexBoard } from './test-data'
import PickedCardsHolder from '../PickedCardsHolder'

import animalsJson from '../../animals.json'
import AnimalCard, { IAnimalCards } from '../AnimalCard'
const animals = animalsJson as IAnimalCards

describe('ScoreBoard', () => {
  const scoreBoard = new ScoreBoard(testRiverHexBoard, new PickedCardsHolder())
  const emptyHexBoard = new HexBoard(5, 5, 'river')
  const emptyScoreBoard = new ScoreBoard(emptyHexBoard, new PickedCardsHolder())

  describe('treeScore', () => {
    it('should calculate the tree score correctly when there are no trees', () => {
      expect(emptyScoreBoard.treeScore()).toBe(0)
    })

    it('should calculate the tree score correctly', () => {
      expect(scoreBoard.treeScore()).toBe(11)
    })
  })

  describe('mountainScore', () => {
    it('should calculate the mountain score correctly when there are no mountains', () => {
      expect(emptyScoreBoard.mountainScore()).toBe(0)
    })

    it('should calculate the mountain score correctly', () => {
      expect(scoreBoard.mountainScore()).toBe(11)
    })
  })

  describe('fieldScore', () => {
    it('should calculate the field score correctly when there are no fields', () => {
      expect(emptyScoreBoard.fieldScore()).toBe(0)
    })

    it('should calculate the field chain score correctly', () => {
      expect(scoreBoard.fieldScore()).toBe(10)
    })
  })

  describe('buildingScore', () => {
    it('should calculate the building score correctly when there are no buildings', () => {
      expect(emptyScoreBoard.buildingScore()).toBe(0)
    })

    it('should calculate the building score correctly', () => {
      expect(scoreBoard.buildingScore()).toBe(10)
    })
  })

  describe('riverScore', () => {
    const pickedCardsHolder = new PickedCardsHolder()
    let riverHexBoard: HexBoard
    let riverScoreBoard: ScoreBoard
    let islandHexBoard: HexBoard
    let islandScoreBoard: ScoreBoard

    beforeEach(() => {
      riverHexBoard = new HexBoard(5, 5, 'river')
      riverScoreBoard = new ScoreBoard(riverHexBoard, pickedCardsHolder)
      islandHexBoard = new HexBoard(7, 4, 'island')
      islandScoreBoard = new ScoreBoard(islandHexBoard, pickedCardsHolder)
    })

    it('should calculate the river token score correctly for a river with 0 or 1 token', () => {
      expect(riverScoreBoard.riverScore()).toBe(0)

      riverHexBoard.getHex(0, 0)?.tokens.push(new Token(TokenType.Blue))
      expect(riverScoreBoard.riverScore()).toBe(0)
      riverHexBoard.getHex(2, 0)?.tokens.push(new Token(TokenType.Blue))
      expect(riverScoreBoard.totalScore()).toBe(0)
    })

    it('should calculate the river token score correctly for a river with 2 tokens', () => {
      riverHexBoard.getHex(2, 1)?.tokens.push(new Token(TokenType.Blue))
      riverHexBoard.getHex(3, 1)?.tokens.push(new Token(TokenType.Blue))
      expect(riverScoreBoard.riverScore()).toBe(2)
      expect(riverScoreBoard.totalScore()).toBe(2)
    })

    it('should calculate the river token score correctly for a river with 3 tokens', () => {
      riverHexBoard.getHex(2, 1)?.tokens.push(new Token(TokenType.Blue))
      riverHexBoard.getHex(3, 1)?.tokens.push(new Token(TokenType.Blue))
      riverHexBoard.getHex(3, 2)?.tokens.push(new Token(TokenType.Blue))
      expect(riverScoreBoard.riverScore()).toBe(5)
      expect(riverScoreBoard.totalScore()).toBe(5)
    })

    it('should calculate the river token score correctly for a river with 4 tokens', () => {
      expect(scoreBoard.riverScore()).toBe(8)
      expect(scoreBoard.totalScore()).toBe(11 + 11 + 10 + 10 + 8)
    })

    it('should calculate the river token score correctly for a river with 5 tokens', () => {
      riverHexBoard.getHex(2, 1)?.tokens.push(new Token(TokenType.Blue))
      riverHexBoard.getHex(3, 1)?.tokens.push(new Token(TokenType.Blue))
      riverHexBoard.getHex(3, 2)?.tokens.push(new Token(TokenType.Blue))
      riverHexBoard.getHex(2, 3)?.tokens.push(new Token(TokenType.Blue))
      riverHexBoard.getHex(1, 3)?.tokens.push(new Token(TokenType.Blue))
      expect(riverScoreBoard.riverScore()).toBe(11)
      expect(riverScoreBoard.totalScore()).toBe(11)
    })

    it('should calculate the river token score correctly for a river with 6 tokens', () => {
      riverHexBoard.getHex(2, 1)?.tokens.push(new Token(TokenType.Blue))
      riverHexBoard.getHex(3, 1)?.tokens.push(new Token(TokenType.Blue))
      riverHexBoard.getHex(3, 2)?.tokens.push(new Token(TokenType.Blue))
      riverHexBoard.getHex(2, 3)?.tokens.push(new Token(TokenType.Blue))
      riverHexBoard.getHex(1, 3)?.tokens.push(new Token(TokenType.Blue))
      riverHexBoard.getHex(0, 3)?.tokens.push(new Token(TokenType.Blue))
      expect(riverScoreBoard.riverScore()).toBe(15)
      expect(riverScoreBoard.totalScore()).toBe(15)
    })

    it('should calculate the river token score correctly for a river with 6 + 1 tokens', () => {
      riverHexBoard.getHex(2, 1)?.tokens.push(new Token(TokenType.Blue))
      riverHexBoard.getHex(3, 1)?.tokens.push(new Token(TokenType.Blue))
      riverHexBoard.getHex(3, 2)?.tokens.push(new Token(TokenType.Blue))
      riverHexBoard.getHex(2, 3)?.tokens.push(new Token(TokenType.Blue))
      riverHexBoard.getHex(1, 3)?.tokens.push(new Token(TokenType.Blue))
      riverHexBoard.getHex(0, 3)?.tokens.push(new Token(TokenType.Blue))
      riverHexBoard.getHex(0, 2)?.tokens.push(new Token(TokenType.Blue))
      expect(riverScoreBoard.riverScore()).toBe(15 + 4)
      expect(riverScoreBoard.totalScore()).toBe(15 + 4)
    })

    it('should calculate the river token score correctly for a river with 6 + 2 tokens', () => {
      riverHexBoard.getHex(2, 1)?.tokens.push(new Token(TokenType.Blue))
      riverHexBoard.getHex(3, 1)?.tokens.push(new Token(TokenType.Blue))
      riverHexBoard.getHex(3, 2)?.tokens.push(new Token(TokenType.Blue))
      riverHexBoard.getHex(2, 3)?.tokens.push(new Token(TokenType.Blue))
      riverHexBoard.getHex(1, 3)?.tokens.push(new Token(TokenType.Blue))
      riverHexBoard.getHex(0, 3)?.tokens.push(new Token(TokenType.Blue))
      riverHexBoard.getHex(0, 2)?.tokens.push(new Token(TokenType.Blue))
      riverHexBoard.getHex(0, 1)?.tokens.push(new Token(TokenType.Blue))
      expect(riverScoreBoard.riverScore()).toBe(15 + 4 + 4)
      expect(riverScoreBoard.totalScore()).toBe(15 + 4 + 4)
    })

    it('should calculate the river token score correctly for a cycling river with 6 + 3 tokens', () => {
      riverHexBoard.getHex(2, 1)?.tokens.push(new Token(TokenType.Blue))
      riverHexBoard.getHex(3, 1)?.tokens.push(new Token(TokenType.Blue))
      riverHexBoard.getHex(3, 2)?.tokens.push(new Token(TokenType.Blue))
      riverHexBoard.getHex(2, 3)?.tokens.push(new Token(TokenType.Blue))
      riverHexBoard.getHex(1, 3)?.tokens.push(new Token(TokenType.Blue))
      riverHexBoard.getHex(0, 3)?.tokens.push(new Token(TokenType.Blue))
      riverHexBoard.getHex(0, 2)?.tokens.push(new Token(TokenType.Blue))
      riverHexBoard.getHex(0, 1)?.tokens.push(new Token(TokenType.Blue))
      riverHexBoard.getHex(1, 1)?.tokens.push(new Token(TokenType.Blue))
      expect(riverScoreBoard.riverScore()).toBe(11)
      expect(riverScoreBoard.totalScore()).toBe(11)
    })

    it('should calculate the island score correctly when no river tokens', () => {
      expect(islandScoreBoard.riverScore()).toBe(5)
    })

    it('should calculate the island score correctly when there are 2 islands', () => {
      islandHexBoard.getHex(0, 1)?.tokens.push(new Token(TokenType.Blue))
      islandHexBoard.getHex(1, 0)?.tokens.push(new Token(TokenType.Blue))
      expect(islandScoreBoard.riverScore()).toBe(10)
    })

    it('should calculate the island score correctly when there are 3 islands', () => {
      islandHexBoard.getHex(0, 1)?.tokens.push(new Token(TokenType.Blue))
      islandHexBoard.getHex(1, 0)?.tokens.push(new Token(TokenType.Blue))
      islandHexBoard.getHex(1, 1)?.tokens.push(new Token(TokenType.Blue))
      islandHexBoard.getHex(1, 2)?.tokens.push(new Token(TokenType.Blue))
      expect(islandScoreBoard.riverScore()).toBe(15)
    })
  })

  describe('animal cards score', () => {
    let pickedCardsHolder: PickedCardsHolder

    beforeEach(() => {
      pickedCardsHolder = new PickedCardsHolder()
    })

    it('should calculate the animal cards score correctly when there are no animal cards', () => {
      const scoreBoard = new ScoreBoard(testRiverHexBoard, pickedCardsHolder)
      expect(scoreBoard.animalCardsScores()).toEqual({ total: 0 })
    })

    it('should calculate the animal cards score correctly when cards have all their tokens remaining', () => {
      const hedgehogCard = new AnimalCard(animals.hedgehog)
      const eagleCard = new AnimalCard(animals.eagle)
      const kingfisherCard = new AnimalCard(animals.kingfisher)
      pickedCardsHolder.add(hedgehogCard)
      pickedCardsHolder.add(eagleCard)
      pickedCardsHolder.add(kingfisherCard)
      const scoreBoard = new ScoreBoard(testRiverHexBoard, pickedCardsHolder)
      expect(scoreBoard.animalCardsScores()).toEqual({
        Hérisson: 0,
        Aigle: 0,
        'Martin-pêcheur': 0,
        total: 0,
      })
    })

    it('should calculate the animal cards score correctly when cards have some tokens removed', () => {
      const hedgehogCard = new AnimalCard(animals.hedgehog)
      const eagleCard = new AnimalCard(animals.eagle)
      const kingfisherCard = new AnimalCard(animals.kingfisher)
      pickedCardsHolder.add(hedgehogCard)
      pickedCardsHolder.add(eagleCard)
      pickedCardsHolder.add(kingfisherCard)
      hedgehogCard.removeAnimalToken()
      eagleCard.removeAnimalToken()
      kingfisherCard.removeAnimalToken()
      const scoreBoard = new ScoreBoard(testRiverHexBoard, pickedCardsHolder)
      expect(scoreBoard.animalCardsScores()).toEqual({
        Hérisson: 5,
        Aigle: 5,
        'Martin-pêcheur': 5,
        total: 15,
      })
    })

    it('should calculate the animal cards score correctly when some cards are completed', () => {
      const hedgehogCard = new AnimalCard(animals.hedgehog)
      const eagleCard = new AnimalCard(animals.eagle)
      const kingfisherCard = new AnimalCard(animals.kingfisher)
      pickedCardsHolder.add(hedgehogCard)
      pickedCardsHolder.add(eagleCard)
      pickedCardsHolder.add(kingfisherCard)

      hedgehogCard.removeAnimalToken()
      expect(hedgehogCard.isCompleted()).toBe(false)

      eagleCard.points.forEach(() => {
        eagleCard.removeAnimalToken()
      })
      expect(eagleCard.isCompleted()).toBe(true)

      kingfisherCard.removeAnimalToken()
      kingfisherCard.removeAnimalToken()
      expect(kingfisherCard.isCompleted()).toBe(false)

      pickedCardsHolder.transferCompletedCards()
      const scoreBoard = new ScoreBoard(testRiverHexBoard, pickedCardsHolder)
      expect(scoreBoard.animalCardsScores()).toEqual({
        Hérisson: 5,
        Aigle: 11,
        'Martin-pêcheur': 11,
        total: 27,
      })
    })

    it('should calculate the animal cards score correctly when all cards are completed', () => {
      const hedgehogCard = new AnimalCard(animals.hedgehog)
      const eagleCard = new AnimalCard(animals.eagle)
      const kingfisherCard = new AnimalCard(animals.kingfisher)
      pickedCardsHolder.add(hedgehogCard)
      pickedCardsHolder.add(eagleCard)
      pickedCardsHolder.add(kingfisherCard)

      hedgehogCard.points.forEach(() => {
        hedgehogCard.removeAnimalToken()
      })
      expect(hedgehogCard.isCompleted()).toBe(true)

      eagleCard.points.forEach(() => {
        eagleCard.removeAnimalToken()
      })
      expect(eagleCard.isCompleted()).toBe(true)

      kingfisherCard.points.forEach(() => {
        kingfisherCard.removeAnimalToken()
      })
      expect(kingfisherCard.isCompleted()).toBe(true)

      pickedCardsHolder.transferCompletedCards()
      const scoreBoard = new ScoreBoard(testRiverHexBoard, pickedCardsHolder)
      expect(scoreBoard.animalCardsScores()).toEqual({
        Hérisson: 12,
        Aigle: 11,
        'Martin-pêcheur': 18,
        total: 41,
      })
    })
  })

  describe('toString', () => {
    it('should return the total score when only tokens', () => {
      const treeSpy = vi.spyOn(scoreBoard, 'treeScore')
      const mountainSpy = vi.spyOn(scoreBoard, 'mountainScore')
      const fieldSpy = vi.spyOn(scoreBoard, 'fieldScore')
      const buildingSpy = vi.spyOn(scoreBoard, 'buildingScore')
      const riverSpy = vi.spyOn(scoreBoard, 'riverScore')
      expect(JSON.parse(scoreBoard.toString())).toEqual({
        tokens: {
          tree: 11,
          mountain: 11,
          field: 10,
          building: 10,
          river: 8,
          total: 50,
        },
        animals: {
          total: 0,
        },
        total: 50,
      })

      expect(treeSpy).toHaveBeenCalledTimes(1)
      expect(mountainSpy).toHaveBeenCalledTimes(1)
      expect(fieldSpy).toHaveBeenCalledTimes(1)
      expect(buildingSpy).toHaveBeenCalledTimes(1)
      expect(riverSpy).toHaveBeenCalledTimes(1)
    })

    it('should return the total score when only animal cards with all their tokens', () => {
      const pickedCardsHolder = new PickedCardsHolder()
      const hedgehogCard = new AnimalCard(animals.hedgehog)
      const eagleCard = new AnimalCard(animals.eagle)
      const kingfisherCard = new AnimalCard(animals.kingfisher)
      pickedCardsHolder.add(hedgehogCard)
      pickedCardsHolder.add(eagleCard)
      pickedCardsHolder.add(kingfisherCard)
      const scoreBoard = new ScoreBoard(testRiverHexBoard, pickedCardsHolder)
      const treeSpy = vi.spyOn(scoreBoard, 'treeScore')
      const mountainSpy = vi.spyOn(scoreBoard, 'mountainScore')
      const fieldSpy = vi.spyOn(scoreBoard, 'fieldScore')
      const buildingSpy = vi.spyOn(scoreBoard, 'buildingScore')
      const riverSpy = vi.spyOn(scoreBoard, 'riverScore')
      expect(JSON.parse(scoreBoard.toString())).toEqual({
        tokens: {
          tree: 11,
          mountain: 11,
          field: 10,
          building: 10,
          river: 8,
          total: 50,
        },
        animals: {
          Hérisson: 0,
          Aigle: 0,
          'Martin-pêcheur': 0,
          total: 0,
        },
        total: 50,
      })

      expect(treeSpy).toHaveBeenCalledTimes(1)
      expect(mountainSpy).toHaveBeenCalledTimes(1)
      expect(fieldSpy).toHaveBeenCalledTimes(1)
      expect(buildingSpy).toHaveBeenCalledTimes(1)
      expect(riverSpy).toHaveBeenCalledTimes(1)
    })

    it('should return the total score when only animal cards with some tokens removed', () => {
      const pickedCardsHolder = new PickedCardsHolder()
      const hedgehogCard = new AnimalCard(animals.hedgehog)
      const eagleCard = new AnimalCard(animals.eagle)
      const kingfisherCard = new AnimalCard(animals.kingfisher)
      pickedCardsHolder.add(hedgehogCard)
      pickedCardsHolder.add(eagleCard)
      pickedCardsHolder.add(kingfisherCard)
      hedgehogCard.removeAnimalToken()
      eagleCard.removeAnimalToken()
      kingfisherCard.removeAnimalToken()
      const scoreBoard = new ScoreBoard(testRiverHexBoard, pickedCardsHolder)

      expect(JSON.parse(scoreBoard.toString())).toEqual({
        tokens: {
          tree: 11,
          mountain: 11,
          field: 10,
          building: 10,
          river: 8,
          total: 50,
        },
        animals: {
          Hérisson: 5,
          Aigle: 5,
          'Martin-pêcheur': 5,
          total: 15,
        },
        total: 65,
      })
    })

    it('should return the total score when only animal cards with some cards completed', () => {
      const pickedCardsHolder = new PickedCardsHolder()
      const hedgehogCard = new AnimalCard(animals.hedgehog)
      const eagleCard = new AnimalCard(animals.eagle)
      const kingfisherCard = new AnimalCard(animals.kingfisher)
      pickedCardsHolder.add(hedgehogCard)
      pickedCardsHolder.add(eagleCard)
      pickedCardsHolder.add(kingfisherCard)
      hedgehogCard.removeAnimalToken()
      eagleCard.removeAnimalToken()
      eagleCard.removeAnimalToken()
      kingfisherCard.removeAnimalToken()
      kingfisherCard.removeAnimalToken()
      const scoreBoard = new ScoreBoard(testRiverHexBoard, pickedCardsHolder)

      expect(JSON.parse(scoreBoard.toString())).toEqual({
        tokens: {
          tree: 11,
          mountain: 11,
          field: 10,
          building: 10,
          river: 8,
          total: 50,
        },
        animals: {
          Hérisson: 5,
          Aigle: 11,
          'Martin-pêcheur': 11,
          total: 27,
        },
        total: 77,
      })
    })
  })
})

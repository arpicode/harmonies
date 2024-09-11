import AnimalCard, { IAnimalCards } from '../AnimalCard'
import PickedCardsHolder from '../PickedCardsHolder'

import animalsJson from '../../animals.json'
const animals = animalsJson as IAnimalCards

describe('PickedCardsHolder', () => {
  let holder: PickedCardsHolder
  let animalCard: AnimalCard

  beforeEach(() => {
    holder = new PickedCardsHolder()
    animalCard = new AnimalCard(animals.bee)
  })

  describe('constructor', () => {
    it('should initialize pickedCards and completedCards as empty arrays', () => {
      expect(holder.pickedCards).toEqual([])
      expect(holder.completedCards).toEqual([])
    })
  })

  describe('add', () => {
    it('should add a card if the limit is not reached', () => {
      const result = holder.add(animalCard)
      expect(result).toBe(true)
      expect(holder.pickedCards).toContain(animalCard)
    })

    it('should not add a card if the limit is reached', () => {
      for (let i = 0; i < PickedCardsHolder.MAX_PICKED_CARDS; i++) {
        holder.add(new AnimalCard(animals.bee))
      }
      const result = holder.add(animalCard)
      expect(result).toBe(false)
      expect(holder.pickedCards).not.toContain(animalCard)
    })
  })

  describe('removeAnimalToken', () => {
    it('should remove a token from the specified card in pickedCards', () => {
      holder.add(animalCard)
      holder.removeAnimalToken(animalCard.name)
      expect(animalCard.animalTokenCount).toBe(1)
    })

    it('should not affect cards not matching the given name', () => {
      const anotherCard = new AnimalCard(animals.bear)
      holder.add(animalCard)
      holder.add(anotherCard)
      holder.removeAnimalToken(anotherCard.name)
      expect(animalCard.animalTokenCount).toBe(2)
      expect(anotherCard.animalTokenCount).toBe(1)
    })

    it('should do nothing if the card is not in pickedCards', () => {
      const anotherCard = new AnimalCard(animals.bear)
      holder.add(anotherCard)
      holder.removeAnimalToken(animalCard.name)
      expect(anotherCard.animalTokenCount).toBe(2)
    })
  })

  describe('transferCompletedCards', () => {
    it('should transfer completed cards to completedCards array', () => {
      animalCard.removeAnimalToken()
      animalCard.removeAnimalToken()
      holder.add(animalCard)
      holder.transferCompletedCards()
      expect(holder.completedCards).toContain(animalCard)
      expect(holder.pickedCards).not.toContain(animalCard)
    })

    it('should not transfer incomplete cards', () => {
      holder.add(animalCard)
      holder.transferCompletedCards()
      expect(holder.completedCards).not.toContain(animalCard)
      expect(holder.pickedCards).toContain(animalCard)
    })
  })

  describe('isFull', () => {
    it('should return true if card holder is full', () => {
      for (let i = 0; i < PickedCardsHolder.MAX_PICKED_CARDS; i++) {
        holder.add(new AnimalCard(animals.bee))
      }
      expect(holder.isFull).toBe(true)
    })

    it('should return false if card holder is not full', () => {
      expect(holder.isFull).toBe(false)
    })
  })
})

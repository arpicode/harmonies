import Bag from '../Bag'
import Token, { TokenType } from '../Token'
import DraftTable from '../DraftTable'
import { testFifteenTokensMap, testStartingTokensMap } from './test-data'

describe('DraftTable', () => {
  let standardBag: Bag<Token>
  let draftTable: DraftTable

  beforeEach(() => {
    standardBag = new Bag<Token>()
    testStartingTokensMap.forEach((value, key) => {
      for (let i = 0; i < value; i++) {
        standardBag.add(new Token(key))
      }
    })
    standardBag.shuffle()
    draftTable = new DraftTable(standardBag)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should initialize correctly with a non-empty bag', () => {
    expect(draftTable.slots.length).toBe(DraftTable.MAX_SLOTS_MULTIPLAYER)
    draftTable.slots.forEach((slot) => {
      expect(slot).not.toBeNull()
      expect(slot.length).toBeLessThanOrEqual(DraftTable.MAX_SLOT_SIZE)
    })
  })

  it('should throw an error if the bag is empty during initialization', () => {
    const emptyBag = new Bag<Token>()
    expect(() => new DraftTable(emptyBag)).toThrow(DraftTable.UNINITIALIZED_ERROR_MESSAGE)

    try {
      new DraftTable(emptyBag)
    } catch (error) {
      expect((error as Error).name).toBe('UninitializedError')
    }
  })

  it('should handle the case where the bag does not have enough tokens to initialization all slots', () => {
    const smallBag = new Bag<Token>()
    smallBag.add(new Token(TokenType.Blue))
    expect(() => new DraftTable(smallBag)).toThrow(DraftTable.INSUFFICIENT_TOKENS_ERROR_MESSAGE)
  })

  it('should correctly pick up tokens from a valid slot', () => {
    const slotIndex = 0
    const tokens = draftTable.pickUp(slotIndex)
    expect(tokens.length).toBe(DraftTable.MAX_SLOT_SIZE)
    expect(draftTable.slots[slotIndex].length).toBe(0)
  })

  it('should throw an error when trying to pick up from an invalid slot', () => {
    expect(() => draftTable.pickUp(-1)).toThrow(DraftTable.INVALID_SLOT_ERROR_MESSAGE)
    expect(() => draftTable.pickUp(DraftTable.MAX_SLOTS_MULTIPLAYER)).toThrow(DraftTable.INVALID_SLOT_ERROR_MESSAGE)
    try {
      draftTable.pickUp(-1)
    } catch (error) {
      expect((error as Error).name).toBe('InvalidSlotError')
    }
  })

  it('should rethrow unexpected errors from the Bag during slot filling', () => {
    const unexpectedError = new Error('Unexpected error')
    const mockBag = new Bag<Token>()
    mockBag.add(new Token(TokenType.Blue))
    vi.spyOn(mockBag, 'draw').mockImplementation(() => {
      throw unexpectedError
    })
    expect(() => new DraftTable(mockBag)).toThrow(unexpectedError)
  })

  it('should refill empty slots correctly', () => {
    draftTable.slots[0] = []
    draftTable.refill()
    expect(draftTable.slots[0]?.length).toBe(DraftTable.MAX_SLOT_SIZE)
    draftTable.slots[0] = []
    draftTable.slots[1] = []
    draftTable.refill()
    expect(draftTable.slots[0]?.length).toBe(DraftTable.MAX_SLOT_SIZE)
    expect(draftTable.slots[1]?.length).toBe(DraftTable.MAX_SLOT_SIZE)
  })

  it('should not refill slots with remaining tokens', () => {
    const slot1Tokens = draftTable.slots[1]
    draftTable.refill()
    expect(draftTable.slots[1]).toBe(slot1Tokens)
  })

  it('should handle the case where the bag does not have enough tokens to refill all slots', () => {
    const fifteenTokenBag = new Bag<Token>()
    testFifteenTokensMap.forEach((value, key) => {
      for (let i = 0; i < value; i++) {
        fifteenTokenBag.add(new Token(key))
      }
    })
    const smallDraftTable = new DraftTable(fifteenTokenBag)
    smallDraftTable.pickUp(0)

    expect(() => smallDraftTable.refill()).toThrow(DraftTable.INSUFFICIENT_TOKENS_ERROR_MESSAGE)
    try {
      smallDraftTable.refill()
    } catch (error) {
      expect((error as Error).name).toBe('InsufficientTokensError')
    }
  })
})

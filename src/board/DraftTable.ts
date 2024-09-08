import { GameMode } from '../game/Game'
import Bag from './Bag'
import Token from './Token'
import DraftedTokensHolder from './DraftedTokensHolder'

/**
 * Error thrown when the bag is not initialized with tokens.
 */
class UninitializedError extends Error {
  constructor() {
    super()
    this.name = 'UninitializedError'
    this.message = DraftTable.UNINITIALIZED_ERROR_MESSAGE
  }
}

/**
 * Error thrown when there are not enough tokens in the bag to refill the slots.
 */
class InsufficientTokensError extends Error {
  constructor() {
    super()
    this.name = 'InsufficientTokensError'
    this.message = DraftTable.INSUFFICIENT_TOKENS_ERROR_MESSAGE
  }
}

/**
 * Error thrown when an invalid slot number is provided.
 */
class InvalidSlotError extends Error {
  constructor() {
    super()
    this.name = 'InvalidSlotError'
    this.message = DraftTable.INVALID_SLOT_ERROR_MESSAGE
  }
}

/**
 * Represents a draft table that holds tokens in slots.
 */
export default class DraftTable {
  /**
   * Error message for uninitialized bag.
   */
  public static readonly UNINITIALIZED_ERROR_MESSAGE = 'Bag is empty. It should be initialized with tokens.'

  /**
   * Error message for insufficient tokens in the bag.
   */
  public static readonly INSUFFICIENT_TOKENS_ERROR_MESSAGE = 'Not enough tokens in the bag to refill the slots'

  /**
   * Error message for invalid slot number.
   */
  public static readonly INVALID_SLOT_ERROR_MESSAGE = 'Invalid slot number'

  /**
   * Maximum number of slots in the draft table for solo mode.
   */
  public static readonly MAX_SLOTS_SOLO = 3

  /**
   * Maximum number of slots in the draft table for multiplayer mode.
   */
  public static readonly MAX_SLOTS_MULTIPLAYER = 5

  /**
   * Maximum number of tokens in each slot.
   */
  public static readonly MAX_SLOT_SIZE = 3

  /**
   * Array of slots, each containing an array of tokens.
   */
  public readonly slots: Token[][] = []
  public readonly gameMode: GameMode
  public readonly slotCount: number

  private _bag: Bag<Token>
  private _draftedTokens: DraftedTokensHolder

  /**
   * Creates an instance of DraftTable.
   * @param bag - The bag containing tokens.
   * @throws UninitializedError if the bag is empty.
   */
  constructor(bag: Bag<Token>, gameMode: GameMode) {
    if (bag.isEmpty()) throw new UninitializedError()
    this._bag = bag
    this.slotCount = gameMode === 'solo' ? DraftTable.MAX_SLOTS_SOLO : DraftTable.MAX_SLOTS_MULTIPLAYER
    this._draftedTokens = new DraftedTokensHolder()
    this.gameMode = gameMode

    this._initialize()
  }

  private _initialize(): void {
    for (let i = 0; i < this.slotCount; i++) {
      this.slots.push([])
      this._fillSlot(i)
    }
  }

  private _fillSlot(slot: number): void {
    try {
      if (this.slots[slot].length === 0) this.slots[slot] = this._bag.draw(DraftTable.MAX_SLOT_SIZE)
    } catch (e) {
      if (e instanceof RangeError) {
        throw new InsufficientTokensError()
      }
      // Re-throw unexpected errors
      throw e
    }
  }

  /**
   * Picks up tokens from a specific slot.
   * @param slot - The slot number to pick up tokens from.
   * @returns The tokens picked up from the slot.
   * @throws InvalidSlotError if the slot number is invalid.
   */
  pickUp(slot: number): Token[] {
    if (slot < 0 || slot >= this.slotCount) throw new InvalidSlotError()
    const pickedUpTokens = this.slots[slot]
    this.slots[slot] = []
    this._draftedTokens.addMany(pickedUpTokens)
    return pickedUpTokens
  }

  /**
   * Refills all slots with tokens from the bag.
   * @throws InsufficientTokensError if there are not enough tokens in the bag.
   */
  refill(): void {
    for (let i = 0; i < this.slotCount; i++) {
      this._fillSlot(i)
    }
  }

  get draftedTokens(): DraftedTokensHolder {
    return this._draftedTokens
  }
}

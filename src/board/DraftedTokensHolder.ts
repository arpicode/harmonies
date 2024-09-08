import DraftTable from './DraftTable'
import Token from './Token'

export default class DraftedTokensHolder {
  private _tokens: Token[] = []
  private _softRemovedTokens: Token[] = []

  add(token: Token): this {
    if (this.size() + 1 > DraftTable.MAX_SLOT_SIZE) {
      throw new Error('Too many tokens in the holder')
    }
    this._tokens.push(token)
    return this
  }

  addMany(tokens: Token[]): this {
    if (this.size() + tokens.length > DraftTable.MAX_SLOT_SIZE) {
      throw new Error('Too many tokens in the holder')
    }
    this._tokens.push(...tokens)
    return this
  }

  softRemove(token: Token): this {
    if (this._tokens.length === 0) return this

    this._softRemovedTokens.push(token)
    this._tokens = this._tokens.filter((t) => t !== token)
    return this
  }

  restoreAll(): this {
    this._tokens.push(...this._softRemovedTokens)
    this._softRemovedTokens = []
    return this
  }

  size(): number {
    return this._tokens.length
  }

  get tokens(): Token[] {
    return this._tokens
  }
}

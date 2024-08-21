import { TokenType } from '../board/Token'

interface ITrieNode {
  children: Map<TokenType, ITrieNode>
  isEndOfCombination: boolean
}

class TrieNode implements ITrieNode {
  children: Map<TokenType, ITrieNode>
  isEndOfCombination: boolean

  constructor() {
    this.children = new Map()
    this.isEndOfCombination = false
  }
}

export default class Trie {
  private root: ITrieNode

  constructor() {
    this.root = new TrieNode()
  }

  /**
   * Inserts a combination of tokens into the Trie.
   * @param combination - Array of TokenType to insert.
   */
  insert(combination: TokenType[]): void {
    let node: ITrieNode = this.root
    for (const tokenType of combination) {
      if (!node.children.has(tokenType)) {
        node.children.set(tokenType, new TrieNode())
      }
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      node = node.children.get(tokenType)! // We just checked and set the node if it didn't exist
    }
    node.isEndOfCombination = true
  }

  /**
   * Checks if a combination of tokens is valid.
   * @param combination - Array of TokenType to check.
   * @returns True if the combination is valid, otherwise false.
   */
  isValidTokenCombination(combination: TokenType[]): boolean {
    let node: ITrieNode | undefined = this.root
    for (const tokenType of combination) {
      node = node.children.get(tokenType)
      if (!node) return false
    }
    return node.isEndOfCombination
  }
}

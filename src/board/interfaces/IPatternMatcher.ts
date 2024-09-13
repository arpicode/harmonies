import { Hex } from '../Hex'
import { HexBoard } from '../HexBoard'

export default interface IPatternMatcher {
  hasPattern(pattern: HexBoard): boolean
  findAllMatchingPatterns(pattern: HexBoard): Hex[][]
  findSpawnHexFromMatchingPatterns(other: HexBoard): Hex[]
}

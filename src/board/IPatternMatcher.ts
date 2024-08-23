import { HexBoard } from './HexBoard'

export default interface IPatternMatcher {
  hasPattern(pattern: HexBoard): boolean
}

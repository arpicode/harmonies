import { Hex } from './Hex'

export interface Point {
  x: number
  y: number
}

export interface Orientation {
  f0: number
  f1: number
  f2: number
  f3: number
  b0: number
  b1: number
  b2: number
  b3: number
  startAngle: number
}

export const LAYOUT_POINTY: Orientation = {
  f0: Math.sqrt(3.0),
  f1: Math.sqrt(3.0) / 2.0,
  f2: 0.0,
  f3: 3.0 / 2.0,
  b0: Math.sqrt(3.0) / 3.0,
  b1: -1.0 / 3.0,
  b2: 0.0,
  b3: 2.0 / 3.0,
  startAngle: 0.5,
}

export const LAYOUT_FLAT: Orientation = {
  f0: 3.0 / 2.0,
  f1: 0.0,
  f2: Math.sqrt(3.0) / 2.0,
  f3: Math.sqrt(3.0),
  b0: 2.0 / 3.0,
  b1: 0.0,
  b2: -1.0 / 3.0,
  b3: Math.sqrt(3.0) / 3.0,
  startAngle: 0.0,
}

export class Layout {
  public readonly orientation: Orientation
  public readonly size: Point
  public readonly origin: Point

  constructor(orientation: Orientation, size: Point, origin: Point) {
    this.orientation = orientation
    this.size = size
    this.origin = origin
  }

  hexToPixel(hex: Hex): Point {
    const M = this.orientation
    const x = (M.f0 * hex.q + M.f1 * hex.r) * this.size.x
    const y = (M.f2 * hex.q + M.f3 * hex.r) * this.size.y
    return { x: x + this.origin.x, y: y + this.origin.y }
  }

  polygonCorners(hex: Hex): Point[] {
    const corners: Point[] = []
    const center = this.hexToPixel(hex)
    for (let i = 0; i < 6; i++) {
      const offset = this._cornerOffset(i)
      corners.push({ x: center.x + offset.x, y: center.y + offset.y })
    }
    return corners
  }

  private _cornerOffset(corner: number): Point {
    const angle = (2.0 * Math.PI * (this.orientation.startAngle + corner)) / 6
    return { x: this.size.x * Math.cos(angle), y: this.size.y * Math.sin(angle) }
  }
}

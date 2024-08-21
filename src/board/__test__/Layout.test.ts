import { Hex } from '../Hex'
import { Layout, LAYOUT_POINTY, Point } from '../Layout'

describe('Layout', () => {
  let layout: Layout
  const size: Point = { x: 10, y: 10 }
  const origin: Point = { x: 0, y: 0 }

  beforeEach(() => {
    layout = new Layout(LAYOUT_POINTY, size, origin)
  })

  it('should initialize with given orientation, size, and origin', () => {
    expect(layout.orientation).toBe(LAYOUT_POINTY)
    expect(layout.size).toEqual(size)
    expect(layout.origin).toEqual(origin)
  })

  it('should convert hex coordinates to pixel coordinates', () => {
    const hex = new Hex(1, 2, -3)
    const point = layout.hexToPixel(hex)
    expect(point).toEqual({
      x: 10 * (Math.sqrt(3.0) * 1 + (Math.sqrt(3.0) / 2.0) * 2),
      y: 10 * (0.0 * 1 + (3.0 / 2.0) * 2),
    })
  })

  it('should return the correct corner points for a given hex', () => {
    const hex = new Hex(1, 2, -3)
    const corners = layout.polygonCorners(hex)
    expect(corners.length).toBe(6)
    // Check if the corners are correctly calculated
    const center = layout.hexToPixel(hex)
    for (let i = 0; i < 6; i++) {
      const angle = (2.0 * Math.PI * (layout.orientation.startAngle + i)) / 6
      const expectedCorner = { x: center.x + size.x * Math.cos(angle), y: center.y + size.y * Math.sin(angle) }
      expect(corners[i]).toEqual(expectedCorner)
    }
  })
})

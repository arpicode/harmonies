import IRenderer from '~/game/interfaces/IRenderer'
import CompositeRenderer from '../CompositeRenderer'

class MockRenderer implements IRenderer {
  render = vi.fn()
}

describe('CompositeRenderer', () => {
  it('should call render on all added renderers', () => {
    const compositeRenderer = new CompositeRenderer()
    const renderer1 = new MockRenderer()
    const renderer2 = new MockRenderer()

    compositeRenderer.addRenderer(renderer1)
    compositeRenderer.addRenderer(renderer2)

    compositeRenderer.render()

    expect(renderer1.render).toHaveBeenCalledTimes(1)
    expect(renderer2.render).toHaveBeenCalledTimes(1)
  })
})

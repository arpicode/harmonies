import IRenderer from './interfaces/IRenderer'
import CompositeRenderer from './composites/CompositeRenderer'

export default class GameRenderer implements IRenderer {
  private readonly compositeRenderer: CompositeRenderer

  constructor(renderers: IRenderer[]) {
    this.compositeRenderer = new CompositeRenderer()
    renderers.forEach((renderer) => this.compositeRenderer.addRenderer(renderer))
  }

  render() {
    this.compositeRenderer.render()
  }
}

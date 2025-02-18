import IRenderer from '../interfaces/IRenderer'

export default class CompositeRenderer implements IRenderer {
  private _renderers: IRenderer[] = []

  addRenderer(renderer: IRenderer) {
    this._renderers.push(renderer)
  }

  render() {
    this._renderers.forEach((renderer) => renderer.render())
  }
}

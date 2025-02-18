import IInputHandler from './interfaces/IInputHandler'
import CompositeInputHandler from './composites/CompositeInputHandler'

export default class GameInputHandler implements IInputHandler {
  private readonly _compositeInputHandler: CompositeInputHandler

  constructor(inputHandlers: IInputHandler[]) {
    this._compositeInputHandler = new CompositeInputHandler()
    inputHandlers.forEach((inputHandler) => this._compositeInputHandler.addHandler(inputHandler))
  }

  initialize() {
    this._compositeInputHandler.initialize()
    /* c8 ignore start */
    document.addEventListener('contextmenu', (event) => {
      if (event.target instanceof HTMLImageElement || event.target instanceof SVGElement) event.preventDefault()
    })
    /* c8 ignore end */
  }
}

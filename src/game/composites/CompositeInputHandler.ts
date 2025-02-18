import IInputHandler from '../interfaces/IInputHandler'

export default class CompositeInputHandler implements IInputHandler {
  private _inputHandlers: IInputHandler[] = []

  addHandler(handler: IInputHandler) {
    this._inputHandlers.push(handler)
  }

  initialize() {
    this._inputHandlers.forEach((handler) => handler.initialize())
  }
}

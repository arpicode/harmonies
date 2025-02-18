import IInputHandler from '~/game/interfaces/IInputHandler'
import CompositeInputHandler from '../CompositeInputHandler'

class MockInputHandler implements IInputHandler {
  initialize = vi.fn()
}

describe('CompositeInputHandler', () => {
  it('should call initialize on all added input handlers', () => {
    const compositeInputHandler = new CompositeInputHandler()
    const inputHandlerMock1 = new MockInputHandler()
    const inputHandlerMock2 = new MockInputHandler()

    compositeInputHandler.addHandler(inputHandlerMock1)
    compositeInputHandler.addHandler(inputHandlerMock2)

    compositeInputHandler.initialize()

    expect(inputHandlerMock1.initialize).toHaveBeenCalledTimes(1)
    expect(inputHandlerMock2.initialize).toHaveBeenCalledTimes(1)
  })
})

import EventEmitter from '../EventEmitter'

describe('EventEmitter', () => {
  let emitter: EventEmitter
  const handler1 = vi.fn()
  const handler2 = vi.fn()
  const handler3 = vi.fn()
  const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(vi.fn())

  beforeEach(() => {
    emitter = new EventEmitter()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('on', () => {
    it('should register an event handler', () => {
      emitter.on('testEvent', handler1)
      emitter.emit('testEvent')
      expect(handler1).toHaveBeenCalledTimes(1)
    })

    it('should register multiple event handlers and call them in order', () => {
      emitter.on('testEvent', handler1)
      emitter.on('testEvent', handler2)
      emitter.on('testEvent', handler3)
      emitter.emit('testEvent', 'arg1', 'arg2')
      expect(handler1).toHaveBeenCalledTimes(1)
      expect(handler2).toHaveBeenCalledTimes(1)
      expect(handler3).toHaveBeenCalledTimes(1)
      expect(handler1).toHaveBeenCalledWith('arg1', 'arg2')
      expect(handler2).toHaveBeenCalledWith('arg1', 'arg2')
      expect(handler3).toHaveBeenCalledWith('arg1', 'arg2')
    })
  })

  describe('off', () => {
    it('should unregister an event handler', () => {
      emitter.on('testEvent', handler1)
      emitter.emit('testEvent')
      expect(handler1).toHaveBeenCalledTimes(1)
      handler1.mockClear()
      emitter.off('testEvent', handler1)
      emitter.emit('testEvent')
      expect(handler1).not.toHaveBeenCalled()
    })

    it('should unregister one of multiple event handlers', () => {
      emitter.on('testEvent', handler1)
      emitter.on('testEvent', handler2)
      emitter.on('testEvent', handler3)
      emitter.off('testEvent', handler2)
      emitter.emit('testEvent', 'arg1', 'arg2')
      expect(handler1).toHaveBeenCalledTimes(1)
      expect(handler2).not.toHaveBeenCalled()
      expect(handler3).toHaveBeenCalledTimes(1)
      expect(handler1).toHaveBeenCalledWith('arg1', 'arg2')
      expect(handler3).toHaveBeenCalledWith('arg1', 'arg2')
    })

    it('should handle the case where no handlers are registered for the event', () => {
      expect(() => emitter.off('nonExistentEvent', handler1)).not.toThrow()
      expect(emitter.off('nonExistentEvent', handler1)).toBeUndefined()
    })

    it('should do nothing if the handler is not registered', () => {
      emitter.on('testEvent', handler1)
      emitter.off('testEvent', handler2) // handler2 is never registered
      emitter.emit('testEvent')
      expect(handler1).toHaveBeenCalledTimes(1)
    })
  })

  describe('emit', () => {
    it('should call registered handlers with the correct arguments', () => {
      emitter.on('testEvent', handler1)
      emitter.emit('testEvent', 'arg1', 'arg2')
      expect(handler1).toHaveBeenCalledTimes(1)
      expect(handler1).toHaveBeenCalledWith('arg1', 'arg2')
      expect(consoleLogSpy).not.toHaveBeenCalledWith('testEvent')
    })

    it('should handle event emission with no arguments', () => {
      emitter.on('testEvent', handler1)
      emitter.emit('testEvent')
      expect(handler1).toHaveBeenCalledWith()
    })

    it('should handle duplicate handler registration', () => {
      emitter.on('testEvent', handler1)
      emitter.on('testEvent', handler1)
      emitter.emit('testEvent')
      expect(handler1).toHaveBeenCalledTimes(2)
    })

    it('should not call any handlers if none are registered', () => {
      expect(emitter.emit('nonExistentEvent')).toBeUndefined()
      expect(handler1).not.toHaveBeenCalled()
    })

    it('should call handlers in the order they were registered', () => {
      const calls: string[] = []
      const handlerA = () => calls.push('A')
      const handlerB = () => calls.push('B')

      emitter.on('testEvent', handlerA)
      emitter.on('testEvent', handlerB)
      emitter.emit('testEvent')

      expect(calls).toEqual(['A', 'B'])
    })
  })
})

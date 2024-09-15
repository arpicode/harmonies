import IEventEmitter, { EventHandler } from './interfaces/IEventEmitter'

export default class EventEmitter implements IEventEmitter {
  private _events = new Map<string, EventHandler<unknown[]>[]>()

  /**
   * Registers an event handler for a specific event.
   * @param event - The name of the event.
   * @param handler - The handler function to call when the event is emitted.
   */
  on<T extends unknown[]>(event: string, handler: EventHandler<T>) {
    if (!this._events.has(event)) this._events.set(event, [])
    this._events.get(event)?.push(handler as EventHandler<unknown[]>)
  }

  /**
   * Unregisters an event handler for a specific event.
   * @param event - The name of the event.
   * @param handler - The handler function to remove.
   */
  off<T extends unknown[]>(event: string, handler: EventHandler<T>) {
    const handlers = this._events.get(event)
    if (!handlers) return
    this._events.set(
      event,
      handlers.filter((h) => h !== handler)
    )
  }

  /**
   * Emits an event, calling all registered handlers with the provided arguments.
   * @param event - The name of the event.
   * @param args - The arguments to pass to the handler functions.
   */
  emit<T extends unknown[]>(event: string, ...args: T) {
    const handlers = this._events.get(event)
    if (!handlers) return
    console.log(`%c[EventEmitter] %c${event}`, 'color: #61d10e;', 'color: #94e08e;')
    handlers.forEach((handler) => handler(...args))
  }
}

/**
 * A type representing an event handler function.
 */
export type EventHandler = (...args: unknown[]) => void

/**
 * Interface for an event emitter.
 */
export default interface IEventEmitter {
  /**
   * Registers an event handler for a specific event.
   * @param event - The name of the event.
   * @param handler - The handler function to call when the event is emitted.
   */
  on(event: string, handler: EventHandler): void

  /**
   * Unregisters an event handler for a specific event.
   * @param event - The name of the event.
   * @param handler - The handler function to remove.
   */
  off(event: string, handler: EventHandler): void

  /**
   * Emits an event, calling all registered handlers with the provided arguments.
   * @param event - The name of the event.
   * @param args - The arguments to pass to the handler functions.
   */
  emit(event: string, ...args: unknown[]): void
}

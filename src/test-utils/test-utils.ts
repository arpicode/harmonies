export function createEventWithTarget(
  eventName: string,
  targetElement: Element,
  eventOptions: Record<string, unknown> = {}
): Event {
  const defaultOptions = { bubbles: true, cancelable: true } as const
  const event = new Event(eventName, { ...defaultOptions, ...eventOptions })

  Object.defineProperty(event, 'target', {
    writable: false,
    value: targetElement,
  })

  return event
}

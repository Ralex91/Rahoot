import { type RefObject, useEffect } from "react"

type EventType =
  | "mousedown"
  | "mouseup"
  | "touchstart"
  | "touchend"
  | "focusin"
  | "focusout"

export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null> | RefObject<T | null>[],
  handler: (_event: MouseEvent | TouchEvent | FocusEvent) => void,
  eventType: EventType = "mousedown",
  eventListenerOptions: AddEventListenerOptions = {},
): void {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent | FocusEvent) => {
      const target = event.target as Node

      if (!target || !target.isConnected) {
        return
      }

      const isOutside = Array.isArray(ref)
        ? ref
            .filter((r) => Boolean(r.current))
            .every((r) => r.current && !r.current.contains(target))
        : ref.current && !ref.current.contains(target)

      if (isOutside) {
        handler(event)
      }
    }

    document.addEventListener(
      eventType,
      listener as EventListener,
      eventListenerOptions,
    )

    return () => {
      document.removeEventListener(
        eventType,
        listener as EventListener,
        eventListenerOptions,
      )
    }
  }, [ref, handler, eventType, eventListenerOptions])
}

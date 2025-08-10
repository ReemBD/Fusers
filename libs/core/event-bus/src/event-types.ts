/**
 * Common event types used throughout the application
 */
export const EVENT_TYPES = {
  ADD_MODAL_CLICK: 'add-modal-click',
} as const;

/**
 * Type for event type constants
 */
export type EventType = typeof EVENT_TYPES[keyof typeof EVENT_TYPES];

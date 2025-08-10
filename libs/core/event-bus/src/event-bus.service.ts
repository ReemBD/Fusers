import { Injectable } from '@angular/core';
import { Subject, Observable, filter } from 'rxjs';
import { EventType } from './event-types';

export interface EventBusEvent<T = any> {
  type: EventType;
  payload?: T;
  timestamp: number;
  source?: string;
}

export interface EventBusSubscription {
  unsubscribe: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class EventBusService {
  private eventSubject = new Subject<EventBusEvent>();

  /**
   * Publishes an event to the event bus
   * @param type - The type/name of the event
   * @param payload - Optional data to pass with the event
   * @param source - Optional source identifier
   */
  publish<T = any>(type: EventType, payload?: T, source?: string): void {
    const event: EventBusEvent<T> = {
      type,
      payload,
      timestamp: Date.now(),
      source
    };
    this.eventSubject.next(event);
  }

  /**
   * Subscribes to events of a specific type
   * @param eventType - The type of events to listen for
   * @returns Observable that emits events of the specified type
   */
  getEventStream<T = any>(eventType: EventType): Observable<EventBusEvent<T>> {
    return this.eventSubject.asObservable().pipe(
      filter(event => event.type === eventType)
    );
  }

  /**
   * Subscribes to all events
   * @returns Observable that emits all events
   */
  subscribeToAll(): Observable<EventBusEvent> {
    return this.eventSubject.asObservable();
  }

  /**
   * Clears all event subscriptions
   */
  clear(): void {
    this.eventSubject.complete();
  }
}

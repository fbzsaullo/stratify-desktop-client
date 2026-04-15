declare module '@rails/actioncable' {
  export function createConsumer(url?: string): Consumer;

  export interface Consumer {
    subscriptions: Subscriptions;
    disconnect(): void;
    connect(): void;
  }

  export interface Subscriptions {
    create(channel: string | object, obj: SubscriptionEvents): Subscription;
  }

  export interface Subscription {
    unsubscribe(): void;
    perform(action: string, data?: object): void;
  }

  export interface SubscriptionEvents {
    connected?(): void;
    disconnected?(): void;
    received?(data: any): void;
    rejected?(): void;
  }
}

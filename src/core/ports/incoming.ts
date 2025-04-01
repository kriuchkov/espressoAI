import { Result } from "neverthrow";
import type { Subscription } from "@/core/entities/subscription";

export interface ISubscriptionPort {
  subscribe(userId: number, url: string): Promise<Result<Subscription, Error>>;
  unsubscribe(userId: number, subscriptionId: string): Promise<Result<boolean, Error>>;
  setInterval(userId: number, url: string, interval: number): Promise<Result<Subscription, Error>>;
  getSubscriptions(userId: number): Promise<Result<Subscription[], Error>>;
  getAll(): Promise<Result<Subscription[], Error>>;
}

export interface INotificationPort {
  Notifications(): Promise<Result<void, Error>>;
}
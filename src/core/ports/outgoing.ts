import { Result } from "neverthrow";

import type { Subscription } from "../entities/subscription";
import type { User } from "../entities/User";
import type * as model from "../entities";

export interface INewsParser {
  parse(url: string): Promise<model.ParsedNewsItem[]>;
}

export interface IUserRepositoryPort {
  findById(id: number): Promise<User | null>;
  create(user: User): Promise<User>;
  update(user: User): Promise<User>;
  getAll(): Promise<User[]>;
}

export interface ISubscriptionRepositoryPort {
  create(subscription: Subscription): Promise<Result<Subscription, string>>;

  findById(id: string): Promise<Subscription | null>;
  findByUserId(userId: number): Promise<Subscription[]>;
  save(subscription: Subscription): Promise<Subscription>;
  delete(id: string): Promise<boolean>;
  getAll(): Promise<Subscription[]>;
}

export interface INewsRepositoryPort {
  findBySubscriptionId(subscriptionId: string): Promise<model.ParsedNewsItem[]>;
  saveMany(news: model.News[]): Promise<void>;
}

export interface IAIPort {
  summarize(text: string): Promise<string>;
}

export interface INewsPort {
  fetchNewsForAllDueSubscriptions(): Promise<Result<Map<number, model.ParsedNewsItem[]>, Error>>;
}

export interface I18nPort {
  translate(key: string, params?: Record<string, string | number>): string;
}
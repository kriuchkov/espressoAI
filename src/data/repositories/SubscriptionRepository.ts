import type { SQL } from "bun";
import { ok, err, Result } from "neverthrow";

//
import type { Subscription } from "../../core/entities/subscription";
import type { ISubscriptionRepository } from "../../core/ports/ISubscriptionRepository";
import db from "../db";

export class SubscriptionRepository implements ISubscriptionRepository {
  private db: SQL;
  
  constructor(db: SQL) {
    this.db = db;
  }

  async findById(id: string): Promise<Subscription | null> {
    const result = await this.db`SELECT * FROM subscriptions WHERE id = ${id}`;
    return result.length > 0 ? this.mapToSubscription(result[0]) : null;
  }

  async findByUserId(userId: number): Promise<Subscription[]> {
    const result = await this.db`SELECT * FROM subscriptions WHERE user_id = ${userId}`;
    return result.map(this.mapToSubscription);
  }

  async create(subscription: Subscription): Promise<Result<Subscription, string>> {
    const sub = { ...subscription };
    const result = await this.db`
      INSERT INTO subscriptions (user_id, url, interval, last_checked)
      VALUES (${sub.userId}, ${sub.url}, ${sub.interval}, ${sub.lastChecked})
    `;
    return result.count > 0 ? ok(sub) : err('create subscription');
  }

  async save(subscription: Subscription): Promise<Subscription> {
    if (await this.findById(subscription.id)) {
      // Update existing subscription
      await this.db`
        UPDATE subscriptions 
        SET user_id = ${subscription.userId}, 
            url = ${subscription.url}, 
            interval = ${subscription.interval}, 
            last_checked = ${subscription.lastChecked}
        WHERE id = ${subscription.id}
      `;
    } else {
      // Insert new subscription
      await this.db`
        INSERT INTO subscriptions (id, user_id, url, interval, last_checked)
        VALUES (
          ${subscription.id}, 
          ${subscription.userId}, 
          ${subscription.url}, 
          ${subscription.interval}, 
          ${subscription.lastChecked}
        )
      `;
    }
    return subscription;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db`DELETE FROM subscriptions WHERE id = ${id}`;
    return result.count > 0;
  }

  async getAll(): Promise<Subscription[]> {
    const result = await this.db`SELECT * FROM subscriptions`;
    return result.map(this.mapToSubscription);
  }

  private mapToSubscription(row: any): Subscription {
    return {
      id: row.id,
      userId: row.user_id,
      url: row.url,
      interval: row.interval,
      lastChecked: new Date(row.last_checked)
    };
  }
}
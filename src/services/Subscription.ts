import { ok, err, Result } from "neverthrow";
import { v4 as uuidv4 } from "uuid";

import type { ISubscriptionPort } from "@/core/ports/incoming";
import type * as outport from '@/core/ports/outgoing';
import * as model from '@/core/entities';

const DEFAULT_INTERVAL = 60; // Default value in minutes

export interface SubscriptionServiceConfig {
  userRepository: outport.IUserRepositoryPort;
  subscriptionRepository: outport.ISubscriptionRepositoryPort;
  interval?: number; 
}

export class Subscription implements ISubscriptionPort {
  private userRepository: outport.IUserRepositoryPort;
  private subscriptionRepository: outport.ISubscriptionRepositoryPort;
  private interval: number;

  constructor(config: SubscriptionServiceConfig) {
    this.userRepository = config.userRepository;
    this.subscriptionRepository = config.subscriptionRepository;
    this.interval = config.interval ?? DEFAULT_INTERVAL; 
  }
  
  async subscribe(userId: number, url: string): Promise<Result<model.Subscription, Error>> {
    const user = await this.userRepository.findById(userId);
    
    if (!user) {
      return err(new Error("User not found"));
    }
    
    const subscription: model.Subscription = {
      id: uuidv4(),
      userId,
      url,
      interval: this.interval,
      lastChecked: new Date()
    };
    
    await this.subscriptionRepository.save(subscription);
    return ok(subscription);
  }
  
  async setInterval(userId: number, url: string, interval: number): Promise<Result<model.Subscription, Error>> {
    const subscriptions = await this.subscriptionRepository.findByUserId(userId);
    const subscription = subscriptions.find(s => s.url === url);
    
    if (!subscription) {
      return err(new Error("Subscription not found"));
    }
    
    subscription.interval = interval;
    await this.subscriptionRepository.save(subscription);
    
    return ok(subscription);
  }
  
  async getSubscriptions(userId: number): Promise<Result<model.Subscription[], Error>> {
    const subscriptions = await this.subscriptionRepository.findByUserId(userId);
    return ok(subscriptions);
  }
  
  async unsubscribe(userId: number, subscriptionId: string): Promise<Result<boolean, Error>> {
    const subscriptions = await this.subscriptionRepository.findByUserId(userId);
    const subscription = subscriptions.find(s => s.id === subscriptionId);
    
    if (!subscription) {
      return err(new Error("Subscription not found"));
    }
    
    const deleted = await this.subscriptionRepository.delete(subscription.id);
    return ok(deleted);
  }

  async getAll(): Promise<Result<model.Subscription[], Error>> {
    const subscriptions = await this.subscriptionRepository.getAll();
    return ok(subscriptions);
  }
}

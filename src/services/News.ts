import { ok, err, Result } from "neverthrow";
import { v4 as uuidv4 } from 'uuid';
import * as model from '@/core/entities';
import type * as outport from '@/core/ports/outgoing';

export interface NewsOptions {
  subscriptionRepository: outport.ISubscriptionRepositoryPort;
  newsRepository: outport.INewsRepositoryPort;
  parser: outport.INewsParser;
  ai: outport.IAIPort;
}

export class News implements outport.INewsPort {
  private subscriptionRepository: outport.ISubscriptionRepositoryPort;
  private newsRepository: outport.INewsRepositoryPort;
  private newsParser: outport.INewsParser;
  private ai: outport.IAIPort;
  
  constructor(options: NewsOptions) {
    this.subscriptionRepository = options.subscriptionRepository;
    this.newsRepository = options.newsRepository;
    this.newsParser = options.parser;
    this.ai = options.ai;
  }

  public async fetchNewsForAllDueSubscriptions(): Promise<Result<Map<number, model.ParsedNewsItem[]>, Error>> {
    const subscriptions = await this.subscriptionRepository.getAll();
    const now = new Date();
    const dueSubscriptions = subscriptions.filter(sub => {
      const minutesSinceLastCheck = (now.getTime() - sub.lastChecked.getTime()) / (1000 * 60);
      return minutesSinceLastCheck >= sub.interval;
    });
    
    const userNewsMap = new Map<number, model.News[]>();
    for (const subscription of dueSubscriptions) {
      const news = await this.fetchNewsBySubscription(subscription.id);
      if (news.isErr()) {
        return err(new Error(`fetching news for subscription ${subscription.id}: ${news.error.message}`));
      }

      const newsItems = news.value;
      if (newsItems.length === 0) {
        continue;
      }

      const userNews = userNewsMap.get(subscription.userId) || [];
      userNewsMap.set(subscription.userId, userNews);
    }
    return ok(userNewsMap);
  }

  private async fetchNewsBySubscription(subscriptionId: string): Promise<Result<model.News[], Error>> {
    const subscription = await this.subscriptionRepository.findById(subscriptionId);
    
    if (!subscription) {
      return err(new Error("Subscription not found"));
    }
    
    const parsedNews = await this.newsParser.parse(subscription.url);
    const existingNews = await this.newsRepository.findBySubscriptionId(subscriptionId);
    const existingUrls = new Set(existingNews.map(news => news.url));
    
    const newItems = parsedNews.filter(item => !existingUrls.has(item.url));
    
    if (newItems.length === 0) {
      return ok([]);
    }
    
    const newsItems: model.News[] = await Promise.all(
      newItems.map(async item => {
        const summary = await this.ai.summarize(item.content);
        
        return {
          id: uuidv4(),
          subscriptionId,
          title: item.title,
          url: item.url,
          content: item.content,
          summary,
          publishedAt: item.publishedAt,
          createdAt: new Date()
        };
      })
    );
    
    await this.newsRepository.saveMany(newsItems);
    
    // Update the lastChecked timestamp
    subscription.lastChecked = new Date();
    await this.subscriptionRepository.save(subscription);
    
    return ok(newsItems);
  }
}

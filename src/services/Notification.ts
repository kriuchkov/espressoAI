import { Api } from 'grammy';
import { Result, err, ok } from "neverthrow";

import type { INotificationPort } from "@/core/ports/incoming";
import type { IUserRepositoryPort, INewsPort, I18nPort } from "@/core/ports/outgoing";

export interface NotificationOptions {
  api: Api;
  newsService: INewsPort;
  userRepository: IUserRepositoryPort;
  i18n: I18nPort;
  interval?: number; 
}

export class Notification implements INotificationPort {
  private api: Api;
  private newsService: INewsPort;
  private interval: number;
  private i18n: I18nPort;

  constructor(options: NotificationOptions) {
    this.api = options.api;
    this.newsService = options.newsService;
    this.i18n = options.i18n;
    this.interval = options.interval || 60000; 
  }

  Run = async (): Promise<void> => {
    setInterval(async () => {
      try {
        await this.Notifications();
      } catch (error) {
        console.error("sending notifications:", error);
      }
    }, this.interval); 
  }
  
  async Notifications(): Promise<Result<void, Error>> {
    const userNewsResult = await this.newsService.fetchNewsForAllDueSubscriptions();
    if (userNewsResult.isErr()) {
      console.error("fetching news:", userNewsResult.error);
      return err(new Error("Failed to fetch news"));
    }

    for (const [userId, news] of userNewsResult.value.entries()) {
      if (news.length === 0) continue;

      const prepareMessageHTML = `
        <b>📰 ${this.i18n.translate("updateNews")}:</b>\n\n
        ${news.map(item => `
          <b>${item.title}</b>\n
          ${item.content?.substring(0, 200) || ''}...\n
          <a href="${item.url}">${this.i18n.translate("readMore")}</a>\n
        `).join('\n')}
      `;

      await this.api.sendMessage(userId, prepareMessageHTML, { parse_mode: 'HTML' });
      console.log(`Notification sent to user ${userId}`);
    }

    return ok();
  }
}
  

import { Context } from "grammy";
import { ok, err, Result } from "neverthrow";
import logger from "@/logger";

import type { ISubscriptionPort } from "@/core/ports/incoming";
import type { I18nPort } from "@/core/ports/outgoing";

export interface CommandsOptions {
  i18n: I18nPort;
  subscription: ISubscriptionPort;
} 

export class Commands {
  private i18n: I18nPort;
  private subscription: ISubscriptionPort;

  constructor(options: CommandsOptions) {
    this.i18n = options.i18n;
    this.subscription = options.subscription;
  }

  private getValidUrl(url: string | undefined): Result<URL, string> {
    if (!url) return err('Invalid URL format');

    try {
      const parsedUrl = new URL(url);
      return ok(parsedUrl);
    } catch {
      return err('Invalid URL format');
    }
  }

  StartHandler = async (ctx: Context) => {
    return ctx.reply(this.i18n.translate("welcome"));
  };
  
  SubscribeHandler = async (ctx: Context) => {
      if (!ctx.message?.chat) return;
      
      const url = ctx.message.text?.split(" ")[1];
      logger.debug("received subscribe command with URL:", url);
      
      const urlResult = this.getValidUrl(url);
      if (urlResult.isErr()) {
        await ctx.reply(this.i18n.translate("invalidUrl"));
        return;
      }
    
    const validUrl = urlResult.value;
    const userId = ctx.message.chat.id;

    const subscriptionResult = await this.subscription.subscribe(userId, validUrl.href);

    if (subscriptionResult.isErr()) {
      logger.error("creating subscription:", subscriptionResult.error);
      await ctx.reply(this.i18n.translate("subscriptionError"));
      return;
    }
    
    logger.debug("subscription created:", subscriptionResult.isOk());
    let msg = this.i18n.translate("subscribed", { url: validUrl.href });
    await ctx.reply(msg);

    logger.debug("user subscribed:", userId, "to URL:", validUrl.href);
  };
}
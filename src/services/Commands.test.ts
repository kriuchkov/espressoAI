import { Context } from "grammy";
import { ok, err } from "neverthrow";
import { describe, it, expect, beforeEach, jest } from "bun:test";
import { Commands } from "./Commands";

describe("Commands", () => {
  let mockI18n: { translate: jest.Mock };
  let mockSubscription: { subscribe: jest.Mock; unsubscribe: jest.Mock; setInterval: jest.Mock; getSubscriptions: jest.Mock };
  let commands: Commands;

  beforeEach(() => {
    mockI18n = {
      translate: jest.fn(),
    };

    mockSubscription  = {
      subscribe: jest.fn(),
      unsubscribe: jest.fn(),
      setInterval: jest.fn(),
      getSubscriptions: jest.fn(),
    };

    commands = new Commands({ i18n: mockI18n, subscription: mockSubscription });
  });

  describe("getValidUrl", () => {
    it("should return an error if URL is undefined", () => {
      const result = (commands as any).getValidUrl(undefined);
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toBe("Invalid URL format");
    });

    it("should return an error if URL is invalid", () => {
      const result = (commands as any).getValidUrl("invalid-url");
      expect(result.isErr()).toBe(true);
      expect(result._unsafeUnwrapErr()).toBe("Invalid URL format");
    });

    it("should return a valid URL if URL is valid", () => {
      const result = (commands as any).getValidUrl("https://example.com");
      expect(result.isOk()).toBe(true);
      expect(result._unsafeUnwrap().href).toBe("https://example.com/");
    });
  });

  describe("StartHandler", () => {
    it("should reply with a welcome message", async () => {
      const mockCtx = {
        reply: jest.fn(),
      } as unknown as Context;

      mockI18n.translate.mockReturnValue("Welcome!");
      await commands.StartHandler(mockCtx);
      
      expect(mockI18n.translate).toHaveBeenCalledWith("welcome");
      expect(mockCtx.reply).toHaveBeenCalledWith("Welcome!");
    });
  });

  describe("SubscribeHandler", () => {
    it("should reply with an invalid URL message if URL is invalid", async () => {
      const mockCtx = {
        message: {
          chat: { id: 123 },
          text: "/subscribe invalid-url",
        },
        reply: jest.fn(),
      } as unknown as Context;

      mockI18n.translate.mockReturnValue("Invalid URL!");

      await commands.SubscribeHandler(mockCtx);

      expect(mockI18n.translate).toHaveBeenCalledWith("invalidUrl");
      expect(mockCtx.reply).toHaveBeenCalledWith("Invalid URL!");
    });

    it("should reply with a subscription error if subscription fails", async () => {
      const mockCtx = {
        message: {
          chat: { id: 123 },
          text: "/subscribe https://example.com",
        },
        reply: jest.fn(),
      } as unknown as Context;

      mockI18n.translate.mockReturnValue("Subscription error!");
      mockSubscription.subscribe.mockResolvedValue(err("Subscription failed"));

      await commands.SubscribeHandler(mockCtx);

      expect(mockSubscription.subscribe).toHaveBeenCalledWith(123, "https://example.com/");
      expect(mockI18n.translate).toHaveBeenCalledWith("subscriptionError");
      expect(mockCtx.reply).toHaveBeenCalledWith("Subscription error!");
    });

    it("should reply with a success message if subscription succeeds", async () => {
      const mockCtx = {
        message: {
          chat: { id: 123 },
          text: "/subscribe https://example.com",
        },
        reply: jest.fn(),
      } as unknown as Context;

      mockI18n.translate.mockImplementation((key, params) => {
        if (key === "subscribed") return `Subscribed to ${params?.url}`;
        return "";
      });

      mockSubscription.subscribe.mockResolvedValue(ok(true));

      await commands.SubscribeHandler(mockCtx);

      expect(mockSubscription.subscribe).toHaveBeenCalledWith(123, "https://example.com/");
      expect(mockI18n.translate).toHaveBeenCalledWith("subscribed", { url: "https://example.com/" });
      expect(mockCtx.reply).toHaveBeenCalledWith("Subscribed to https://example.com/");
    });
  });
});

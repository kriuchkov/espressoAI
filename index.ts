import { Bot, session,  } from 'grammy';
import db from "./src/data/db";
import config from "./src/config";

async function startBot() {
  console.log("Starting the bot...");
  const bot = new Bot(config.telegram.botToken);
  
  console.log("Bot is starting...");
  await bot.start();
}

startBot().catch(console.error);
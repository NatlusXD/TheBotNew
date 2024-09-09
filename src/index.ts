// src/index.ts
import { session, Telegraf } from 'telegraf';
import dotenv from 'dotenv';
import { connectToMongoDB } from './db';
import { registerCommand } from './commands/register';
import { approveCommand } from './commands/approve';
import { createTicketCommand } from './commands/CreateTicket';
import { checkTicketsCommand } from './commands/checkTickets';
import { setupBot } from './commands/viewTicketCommand';
import { CustomContext } from './types';

dotenv.config();

const botToken = process.env.BOT_TOKEN;
const mongoUri = process.env.MONGODB_URI;

if (!botToken || !mongoUri) {
  throw new Error('Missing environment variables BOT_TOKEN or MONGODB_URI');
}

const bot = new Telegraf<CustomContext>(botToken);
bot.use(session()); // Ensure session middleware is used

const startBot = async () => {
  try {
    await connectToMongoDB();
    registerCommand(bot);
    approveCommand(bot);
    createTicketCommand(bot);
    //checkTicketsCommand(bot);
    setupBot(bot);

    await bot.launch();
    console.log('Bot is running...');
  } catch (err) {
    console.error('Bot initialization error:', err);
    process.exit(1);
  }
};

startBot();

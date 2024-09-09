// src/index.ts
import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';
import { connectToMongoDB } from './db'; // Import your MongoDB connection function
import { registerCommand } from './commands/register';
import { approveCommand } from './commands/approve';
import { createTicketCommand } from './commands/CreateTicket'; // Ensure the file name is correct
import { checkTicketsCommand } from './commands/checkTickets';

dotenv.config();

const botToken = process.env.BOT_TOKEN;
const mongoUri = process.env.MONGODB_URI;

if (!botToken || !mongoUri) {
  throw new Error('Missing environment variables BOT_TOKEN or MONGODB_URI');
}

const bot = new Telegraf(botToken);

const startBot = async () => {
  try {
    await connectToMongoDB();
    registerCommand(bot);
    approveCommand(bot);
    createTicketCommand(bot);
    checkTicketsCommand(bot);

    await bot.launch();
    console.log('Bot is running...');
  } catch (err) {
    console.error('Bot initialization error:', err);
    process.exit(1);
  }
};

startBot();

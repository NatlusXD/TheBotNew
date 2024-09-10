import { session, Telegraf } from 'telegraf';
import dotenv from 'dotenv';
import { connectToMongoDB } from './db';
import { registerCommand } from './commands/register';
import { approveCommand } from './commands/approve';
import { checkTicketsAction } from './commands/checkTickets';
import { CustomContext } from './types';
import { textMessageHandler } from './commands/textMessageHandler';
import { startCommand } from './commands/start';
import { viewTicketCommand } from './commands/viewTicketCommand';
import { createTicketCommand } from './commands/CreateTicket';

dotenv.config();

const botToken = process.env.BOT_TOKEN;
const mongoUri = process.env.MONGODB_URI;

if (!botToken || !mongoUri) {
  throw new Error('Missing environment variables BOT_TOKEN or MONGODB_URI');
}

const bot = new Telegraf<CustomContext>(botToken);
bot.use(session());

const startBot = async () => {
  try {
    await connectToMongoDB();


    startCommand(bot);
    createTicketCommand(bot);
    viewTicketCommand(bot);
    checkTicketsAction(bot);
    registerCommand(bot);
    approveCommand(bot);
    
    await bot.launch();
    console.log('Bot is running...');
  } catch (err) {
    console.error('Bot initialization error:', err);
    process.exit(1);
  }
};

startBot();

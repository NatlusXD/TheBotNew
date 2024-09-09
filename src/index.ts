import { Telegraf, session } from 'telegraf';
import dotenv from 'dotenv';
import { connectToMongoDB } from './db';
import { register } from './commands/register';
import { login } from './commands/login';
import { logout } from './commands/logout';
import { createTicket } from './commands/CreateTicket';
import { checkTicketStatus } from './commands/checkTicketStatus';
import { MyContext } from './types';
import { requestRoleChange } from './commands/requestRoleChange';
import { approve } from './commands/approve';
import { viewAllTickets } from './commands/viewAllTickets';
import { editTicketDetails } from './commands/editTicketDetails';
import { replyToTicket } from './commands/replyToTicket';
import { changeTicketStatus } from './commands/changeTicketStatus';
import { viewReplies } from './commands/viewReplies';

dotenv.config();
connectToMongoDB();

const bot = new Telegraf<MyContext>(process.env.BOT_TOKEN!);

bot.use(session());

bot.command('register', (ctx) => register(ctx as MyContext));
bot.command('login', (ctx) => login(ctx as MyContext));
bot.command('logout', (ctx) => logout(ctx as MyContext));
bot.command('createTicket', (ctx) => createTicket(ctx as MyContext));
bot.command('checkTicketStatus', (ctx) => checkTicketStatus(ctx as MyContext));
bot.command('requestRoleChange', (ctx) => requestRoleChange(ctx as MyContext));
bot.command('approve', (ctx) => approve(ctx as MyContext));
bot.command('viewAllTickets', (ctx) => viewAllTickets(ctx as MyContext));
bot.command('editTicketDetails', (ctx) => editTicketDetails(ctx as MyContext));
bot.command('replyToTicket', (ctx) => replyToTicket(ctx as MyContext));
bot.command('changeTicketStatus', (ctx) => changeTicketStatus(ctx as MyContext));
bot.command('viewReplies', (ctx) => viewReplies(ctx as MyContext));

bot.launch().then(() => console.log('Bot started!'));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

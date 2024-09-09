import { Context, Telegraf } from 'telegraf';
import { Ticket } from '../models/Ticket';

export const checkTicketsCommand = (bot: Telegraf<Context>) => {
  bot.command('check_tickets', async (ctx) => {
    const tickets = await Ticket.find({ username: ctx.from.username || 'Anonymous' });

    if (tickets.length === 0) {
      ctx.reply('No tickets found.');
      return;
    }

    const response = tickets.map(ticket => 
      `Title: ${ticket.title}\nDescription: ${ticket.description}\nStatus: ${ticket.status ? 'Resolved' : 'Pending'}`
    ).join('\n\n');

    ctx.reply(response);
  });
};

import { Telegraf } from 'telegraf';
import { Ticket } from '../models/Ticket';
import { CustomContext } from '../types';

export const checkTicketsAction = (bot: Telegraf<CustomContext>) => {
  bot.action('check_tickets', async (ctx) => {
    const username = ctx.from?.username || 'Anonymous';

    const tickets = await Ticket.find({ username });

    if (tickets.length === 0) {
      ctx.reply('No tickets found.');
      return;
    }

    const response = tickets.map(ticket => 
      `Title: ${ticket.title}\n` +
      `Description: ${ticket.description}\n` +
      `Status: ${ticket.status ? 'Resolved' : 'Pending'}\n` +
      `Response: ${ticket.response || 'No response yet.'}\n`
    ).join('\n\n');

    ctx.reply(response);
  });
};

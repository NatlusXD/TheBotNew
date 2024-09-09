import { Telegraf } from 'telegraf';
import { Ticket } from '../models/Ticket';
import { CustomContext } from '../types';

export const checkTicketsCommand = (bot: Telegraf<CustomContext>) => {
  bot.command('check_tickets', async (ctx) => {
    // Ensure the username is available
    const username = ctx.from?.username || 'Anonymous';

    // Query tickets for the current user
    const tickets = await Ticket.find({ username });

    if (tickets.length === 0) {
      ctx.reply('No tickets found.');
      return;
    }

    // Build response for each ticket
    const response = tickets.map(ticket => 
      `Title: ${ticket.title}\n` +
      `Description: ${ticket.description}\n` +
      `Status: ${ticket.status ? 'Resolved' : 'Pending'}\n` +
      `Response: ${ticket.response || 'No response yet.'}\n`
    ).join('\n\n');

    // Send the response
    ctx.reply(response);
  });
};

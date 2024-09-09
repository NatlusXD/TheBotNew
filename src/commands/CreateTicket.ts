import { Context, Telegraf } from 'telegraf';
import { Ticket } from '../models/Ticket';

export const createTicketCommand = (bot: Telegraf<Context>) => {
  bot.command('create_ticket', async (ctx) => {
    const [_, title, ...descriptionParts] = ctx.message.text.split(' ');
    const description = descriptionParts.join(' ');

    const newTicket = new Ticket({
      username: ctx.from.username || 'Anonymous',
      title,
      description,
    });

    await newTicket.save();
    ctx.reply('Your ticket has been created.');
  });
};

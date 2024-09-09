// src/commands/createTicket.ts
import { Telegraf } from 'telegraf';
import { Ticket } from '../models/Ticket';
import { CustomContext } from '../types';
import { Markup } from 'telegraf';

export const createTicketCommand = (bot: Telegraf<CustomContext>) => {
  bot.command('create_ticket', async (ctx) => {
    // Initialize session if not already done
    if (!ctx.session) {
      ctx.session = {};
    }

    const [_, title, ...descriptionParts] = ctx.message.text.split(' ');
    const description = descriptionParts.join(' ');

    if (!title || !description) {
      return ctx.reply('Please provide both a title and a description. Usage: /create_ticket <title> <description>');
    }

    // Store the ticket data in session for later confirmation
    ctx.session.newTicket = {
      username: ctx.from.username || 'Anonymous',
      title,
      description,
      status: false, // Default status or another appropriate value
      response: ' ',
      adminUsername: ' '
    };

    // Ask for confirmation with inline buttons
    return ctx.reply(
      `Confirm creating the ticket with the following details:\n\nTitle: ${title}\nDescription: ${description}`,
      Markup.inlineKeyboard([
        Markup.button.callback('Confirm', 'confirm_ticket'),
        Markup.button.callback('Cancel', 'cancel_ticket'),
      ])
    );
  });

  // Handle confirmation
  bot.action('confirm_ticket', async (ctx) => {
    if (ctx.session.newTicket) {
      const { username, title, description, status } = ctx.session.newTicket;

      const newTicket = new Ticket({
        username,
        title,
        description,
        status, // Include status when saving to the database
      });

      await newTicket.save();
      await ctx.editMessageText('Your ticket has been created.');
      delete ctx.session.newTicket; // Clear the session
    }
  });

  // Handle cancellation
  bot.action('cancel_ticket', async (ctx) => {
    await ctx.editMessageText('Ticket creation has been canceled.');
    delete ctx.session.newTicket; // Clear the session
  });
};

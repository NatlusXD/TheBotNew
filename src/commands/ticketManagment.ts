import { Telegraf } from 'telegraf';
import { CustomContext } from '../types';
import { Ticket } from '../models/Ticket';
import { Markup } from 'telegraf';

export const ticketManagement = (bot: Telegraf<CustomContext>) => {
  bot.action('view_all_tickets', async (ctx) => {
    if (!ctx.session) {
      ctx.session = {};
    }

    const tickets = await Ticket.find();
    if (tickets.length === 0) {
      await ctx.reply('No tickets found.');
      return;
    }

    const ticketButtons = tickets.map(ticket => 
      Markup.button.callback(`Ticket #${ticket._id}`, `manage_ticket_${ticket._id}`)
    );

    // Generate the inline keyboard markup
    const inlineKeyboard = Markup.inlineKeyboard(ticketButtons).reply_markup;

    await ctx.reply('Select a ticket to manage:', {
      reply_markup: inlineKeyboard,
    });
  });

  bot.action(/manage_ticket_(.+)/, async (ctx) => {
    const ticketId = ctx.match[1];
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      await ctx.reply('Ticket not found.');
      return;
    }

    // Ensure session is initialized
    if (!ctx.session) {
      ctx.session = {};
    }

    ctx.session.ticketManagement = {
      action: 'view',
      ticketId,
    };

    const buttons = [
      Markup.button.callback('Edit Ticket', `edit_ticket_${ticketId}`),
      Markup.button.callback('Reply to Ticket', `reply_ticket_${ticketId}`),
      Markup.button.callback('Delete Ticket', `delete_ticket_${ticketId}`)
    ];

    // Generate the inline keyboard markup
    const inlineKeyboard = Markup.inlineKeyboard(buttons).reply_markup;

    await ctx.reply(`Ticket Details:\n\nTitle: ${ticket.title}\nDescription: ${ticket.description}\nStatus: ${ticket.status ? 'Resolved' : 'Unresolved'}`, {
      reply_markup: inlineKeyboard,
    });
  });

  bot.action(/edit_ticket_(.+)/, async (ctx) => {
    const ticketId = ctx.match[1];

    // Ensure session is initialized
    if (!ctx.session) {
      ctx.session = {};
    }

    ctx.session.ticketManagement = {
      action: 'edit',
      ticketId,
    };

    await ctx.reply('Please enter the new title for the ticket:');
  });

  bot.action(/reply_ticket_(.+)/, async (ctx) => {
    const ticketId = ctx.match[1];

    // Ensure session is initialized
    if (!ctx.session) {
      ctx.session = {};
    }

    ctx.session.ticketManagement = {
      action: 'reply',
      ticketId,
    };

    await ctx.reply('Please enter your response to the ticket:');
  });

  bot.action(/delete_ticket_(.+)/, async (ctx) => {
    const ticketId = ctx.match[1];
    await Ticket.findByIdAndDelete(ticketId);
    await ctx.reply('Ticket has been deleted.');
  });

  bot.on('text', async (ctx) => {
    if (!ctx.session || !ctx.session.ticketManagement) return;

    const { action, ticketId } = ctx.session.ticketManagement;
    const text = ctx.message.text;

    if (action === 'edit' && ticketId) {
      const ticket = await Ticket.findById(ticketId);
      if (ticket) {
        ticket.title = text;
        await ticket.save();
        await ctx.reply('Ticket title has been updated.');
        delete ctx.session.ticketManagement;
      }
    } else if (action === 'reply' && ticketId) {
      const ticket = await Ticket.findById(ticketId);
      if (ticket) {
        ticket.response = text;
        ticket.status = true; // Set ticket as resolved or based on your logic
        await ticket.save();
        await ctx.reply('Your response has been recorded.');
        delete ctx.session.ticketManagement;
      }
    }
  });
};

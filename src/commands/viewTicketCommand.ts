import { Telegraf } from 'telegraf';
import { CallbackQuery } from 'telegraf/typings/core/types/typegram';
import { Ticket } from '../models/Ticket';
import { User } from '../models/User';
import { CustomContext } from '../types';

export const setupBot = (bot: Telegraf<CustomContext>) => {
  bot.start(async (ctx) => {
    const telegramUsername = ctx.from?.username;

    if (!telegramUsername) {
      ctx.reply('Your Telegram username is required to use this bot.');
      return;
    }

    const user = await User.findOne({ telegramUsername });

    if (!user) {
      // User is not registered; show "Share Your Number" button
      ctx.reply('Welcome! Please choose an option:', {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'Share Your Number', callback_data: 'share_number' }],
            [{ text: 'View All Tickets', callback_data: 'view_tickets' }],
            [{ text: 'Check Your Tickets', callback_data: 'check_tickets' }]
          ],
        },
      });
    } else {
      // User is registered; show "View All Tickets" and "Check Your Tickets" buttons only
      ctx.reply('Welcome back! Please choose an option:', {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'View All Tickets', callback_data: 'view_tickets' }],
            [{ text: 'Check Your Tickets', callback_data: 'check_tickets' }]
          ],
        },
      });
    }
  });

  bot.action('share_number', (ctx) => {
    ctx.reply('Please share your phone number for registration.', {
      reply_markup: {
        one_time_keyboard: true,
        keyboard: [[{ text: 'Share Phone Number', request_contact: true }]],
      },
    });
  });

  bot.action('view_tickets', async (ctx) => {
    if (!ctx.session) {
      ctx.session = {};
    }

    const telegramUsername = ctx.from?.username;
    if (!telegramUsername) {
      ctx.reply('Your Telegram username is required to use this command.');
      return;
    }

    const user = await User.findOne({ telegramUsername });

    if (!user) {
      ctx.reply('You are not registered.');
      return;
    }

    if (user.role !== 'ADMIN') {
      ctx.reply('This command is only available to admins.');
      return;
    }

    const tickets = await Ticket.find({});

    if (tickets.length === 0) {
      ctx.reply('No tickets available.');
      return;
    }

    const ticketButtons = tickets.map((ticket) => [
      { text: ticket.title, callback_data: `ticket_${ticket._id}` },
    ]);

    ctx.reply('Select a ticket to view and edit:', {
      reply_markup: {
        inline_keyboard: ticketButtons,
      },
    });
  });

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

  bot.on('callback_query', async (ctx) => {
    if (!ctx.session) {
      ctx.session = {};
    }

    const callbackQuery = ctx.callbackQuery as CallbackQuery.DataQuery;

    const telegramUsername = ctx.from?.username;
    if (!telegramUsername) {
      ctx.reply('Your Telegram username is required to use this command.');
      return;
    }

    const user = await User.findOne({ telegramUsername });
    if (!user || user.role !== 'ADMIN') {
      ctx.reply('You are not authorized to perform this action.');
      return;
    }

    if (callbackQuery.data && callbackQuery.data.startsWith('ticket_')) {
      const ticketId = callbackQuery.data.split('_')[1];
      const ticket = await Ticket.findById(ticketId);

      if (!ticket) {
        ctx.reply('Ticket not found.');
        return;
      }

      ctx.session.editingTicketId = ticketId;
      ctx.session.editingField = undefined; // Initialize as undefined

      ctx.reply(
        `Title: ${ticket.title}\nDescription: ${ticket.description}\nStatus: ${
          ticket.status ? 'Active' : 'Resolved'
        }\nResponse: ${ticket.response || 'No response yet.'}\n\nWhat would you like to do?`,
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: 'Edit Title', callback_data: `edit_title_${ticket._id}` }],
              [{ text: 'Edit Description', callback_data: `edit_description_${ticket._id}` }],
              [{ text: 'Mark as Resolved', callback_data: `resolve_${ticket._id}` }],
              [{ text: 'Delete Ticket', callback_data: `delete_${ticket._id}` }],
              [{ text: 'Reply to Ticket', callback_data: `reply_${ticket._id}` }],
            ],
          },
        }
      );
    } else if (callbackQuery.data && callbackQuery.data.startsWith('reply_')) {
      const ticketId = callbackQuery.data.split('_')[1];
      ctx.session.editingTicketId = ticketId;
      ctx.session.editingField = 'response'; // Set field to response
      ctx.reply('Please enter your response:');
    } else if (callbackQuery.data && callbackQuery.data.startsWith('edit_title_')) {
      const ticketId = callbackQuery.data.split('_')[2];
      ctx.session.editingTicketId = ticketId;
      ctx.session.editingField = 'title';
      ctx.reply('Please enter the new title:');
    } else if (callbackQuery.data && callbackQuery.data.startsWith('edit_description_')) {
      const ticketId = callbackQuery.data.split('_')[2];
      ctx.session.editingTicketId = ticketId;
      ctx.session.editingField = 'description';
      ctx.reply('Please enter the new description:');
    } else if (callbackQuery.data && callbackQuery.data.startsWith('resolve_')) {
      const ticketId = callbackQuery.data.split('_')[1];
      const ticket = await Ticket.findById(ticketId);
      if (ticket) {
        await Ticket.findByIdAndUpdate(ticketId, { status: false });
        const user = await User.findOne({ telegramUsername: ticket.username });
        if (user) {
          try {
            await ctx.telegram.sendMessage(user.id, `Your ticket "${ticket.title}" has been marked as resolved.`);
          } catch (error) {
            console.error(`Failed to send message to user ${user.id}:`, error);
          }
        }
      }
      ctx.reply('Ticket marked as resolved.');
    } else if (callbackQuery.data && callbackQuery.data.startsWith('delete_')) {
      const ticketId = callbackQuery.data.split('_')[1];
      const ticket = await Ticket.findById(ticketId);
      if (ticket) {
        await Ticket.findByIdAndDelete(ticketId);
        const user = await User.findOne({ telegramUsername: ticket.username });
        if (user) {
          try {
            await ctx.telegram.sendMessage(user.id, `Your ticket "${ticket.title}" has been deleted.`);
          } catch (error) {
            console.error(`Failed to send message to user ${user.id}:`, error);
          }
        }
      }
      ctx.reply('Ticket deleted.');
    }

    ctx.answerCbQuery();
  });

  bot.on('text', async (ctx) => {
    if (!ctx.session) {
      ctx.session = {};
    }

    if (ctx.session.editingTicketId && ctx.session.editingField) {
      const ticketId = ctx.session.editingTicketId;
      const updateField = ctx.session.editingField;
      const updateValue = ctx.message.text;

      const updateData: any = {};
      updateData[updateField] = updateValue;

      const ticket = await Ticket.findById(ticketId);
      if (ticket) {
        await Ticket.findByIdAndUpdate(ticketId, updateData);
        const user = await User.findOne({ telegramUsername: ticket.username });
        if (user) {
          try {
            await ctx.telegram.sendMessage(user.id, `Your ticket "${ticket.title}" has been updated. ${updateField}: ${updateValue}`);
          } catch (error) {
            console.error(`Failed to send message to user ${user.id}:`, error);
          }
        }
      }

      ctx.reply(`Ticket ${updateField} updated successfully.`);
      
      delete ctx.session.editingTicketId;
      ctx.session.editingField = undefined; // Initialize as undefined
    }
  });
};

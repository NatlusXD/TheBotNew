import { Telegraf } from 'telegraf';
import { CustomContext } from '../types';
import { Markup } from 'telegraf';
import { User } from '../models/User';

export const startCommand = (bot: Telegraf<CustomContext>) => {
  console.log("startCommand initialized");

  bot.command('start', async (ctx) => {
    console.log('Received /start command');
    await ctx.reply('Hello! This is a test message.');
    try {
      const telegramUsername = ctx.from?.username;

      if (!telegramUsername) {
        await ctx.reply('Your Telegram username is required to use this bot.');
        return;
      }

      const user = await User.findOne({ telegramUsername });

      if (!user) {
        await ctx.reply('Welcome! Please register to use this bot by typing /register.', {
          reply_markup: Markup.inlineKeyboard([
            Markup.button.callback('Register', 'register')
          ]).reply_markup
        });
      } else {
        await ctx.reply('Welcome back! Please choose an option:', {
          reply_markup: Markup.inlineKeyboard([
            Markup.button.callback('Create New Ticket', 'create_ticket_command'),
            Markup.button.callback('View All Tickets', 'view_tickets'),
            Markup.button.callback('Check Your Tickets', 'check_tickets'),
            Markup.button.callback('See approvals requests', 'approve')
          ]).reply_markup,
        });
      }
    } catch (err) {
      console.error('Error in start command:', err);
      await ctx.reply('There was an error processing your request.');
    }
  });
};

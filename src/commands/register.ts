// src/commands/register.ts
import { Context, Telegraf } from 'telegraf';
import { User } from '../models/User';
import { Roles } from '../models/Roles';

export const registerCommand = (bot: Telegraf<Context>) => {
  bot.command('register', async (ctx) => {
    const userId = ctx.from.id.toString();
    const username = ctx.from.username || 'Anonymous';
    let user = await User.findOne({ phone_number: userId });

    if (user) {
      ctx.reply('You are already registered.');
      return;
    }

    ctx.reply('Please share your phone number for registration.', {
      reply_markup: {
        one_time_keyboard: true,
        keyboard: [[{ text: 'Share Phone Number', request_contact: true }]],
      },
    });
  });

  bot.on('contact', async (ctx) => {
    const { phone_number } = ctx.message.contact;
    const username = ctx.from.username || 'Anonymous';
    let user = await User.findOne({ phone_number });

    if (!user) {
      user = new User({
        phone_number,
        telegramUsername: username,
        role: Roles.USER,
      });
      await user.save();
      ctx.reply('Registration successful!');
    } else {
      ctx.reply('Logged in successfully!');
    }
  });
};

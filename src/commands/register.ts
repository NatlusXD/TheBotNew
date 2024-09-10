import { Telegraf } from 'telegraf';
import { User } from '../models/User';
import { Roles } from '../models/Roles';
import { CustomContext } from '../types';

export const registerCommand = (bot: Telegraf<CustomContext>) => {
  console.log("Register command initialized");

  bot.action('register', async (ctx) => {
    console.log('Received /register command');
    const username = ctx.from?.username || 'Anonymous';
    
    await ctx.reply('Please share your phone number for registration.', {
      reply_markup: {
        one_time_keyboard: true,
        keyboard: [[{ text: 'Share Phone Number', request_contact: true }]],
      },
    });
  });

  bot.on('contact', async (ctx) => {
    console.log('Received contact message:', ctx.message);

    try {
      const contact = ctx.message?.contact;
      if (!contact) {
        console.error('No contact data received');
        return;
      }

      const { phone_number } = contact;
      const username = ctx.from?.username || 'Anonymous';
      
      if (!phone_number) {
        console.error('Contact does not have a phone number');
        await ctx.reply('Failed to register. Please try again.');
        return;
      }

      let user = await User.findOne({ phone_number });

      if (!user) {
        user = new User({
          phone_number,
          telegramUsername: username,
          role: Roles.USER,
        });
        await user.save();
        await ctx.reply('Registration successful!');
      } else {
        await ctx.reply('Logged in successfully!');
      }
    } catch (err) {
      console.error('Error handling contact:', err);
      await ctx.reply('An error occurred during registration. Please try again.');
    }
  });
};
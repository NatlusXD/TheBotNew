import { Context, Telegraf } from 'telegraf';
import { User } from '../models/User';
import { Roles } from '../models/Roles';
import { CustomContext } from '../types';

export const approveCommand = (bot: Telegraf<CustomContext>) => {
  bot.command('approve', async (ctx) => {
    if (ctx.from.id.toString() !== '66dec21eba4040fe545bbf03') {
      ctx.reply('You are not authorized to use this command.');
      return;
    }

    const [_, username] = ctx.message.text.split(' ');
    const user = await User.findOne({ telegramUsername: username });

    if (user && user.requestedRole === Roles.ADMIN) {
      user.role = Roles.ADMIN;
      user.requestedRole = undefined;
      await user.save();
      ctx.reply(`${username} has been promoted to ADMIN.`);
    } else {
      ctx.reply('User not found or not requested for ADMIN role.');
    }
  });
};

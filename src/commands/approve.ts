import { MyContext } from '../types';
import { User } from '../models/User';
import { Message } from 'telegraf/typings/core/types/typegram';

export const approve = async (ctx: MyContext) => {
  if (!ctx.session) {
    return ctx.reply('Session not initialized. Please try again.');
  }

  if (!ctx.session.user || ctx.session.user.role !== 'SUPREME_ADMIN') {
    return ctx.reply('Only SUPREME_ADMIN can approve role changes.');
  }

  const message = ctx.message as Message.TextMessage | undefined;

  if (message?.text) {
    const [command, username] = message.text.split(' ') || [];

    if (!username) {
      return ctx.reply('Usage: /approve <username>');
    }

    const user = await User.findOne({ username });
    if (!user || !user.requestedRole) {
      return ctx.reply('No role change request found for this user.');
    }

    user.role = user.requestedRole;
    user.requestedRole = '';
    await user.save();

    ctx.reply(`User ${username} promoted to ${user.role} successfully.`);
  } else {
    return ctx.reply('Please send a text message with the approve command.');
  }
};

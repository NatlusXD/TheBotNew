import { MyContext } from '../types';
import { User } from '../models/User';
import { Message } from 'telegraf/typings/core/types/typegram';

export const requestRoleChange = async (ctx: MyContext) => {
  if (!ctx.session) {
    return ctx.reply('Session not initialized. Please try again.');
  }

  if (!ctx.session.user) {
    return ctx.reply('You must be logged in to request a role change.');
  }

  if (ctx.session.user.role !== 'USER') {
    return ctx.reply('You must be a USER to request a role change.');
  }

  const message = ctx.message as Message.TextMessage | undefined;

  if (message?.text) {
    const requestedRole = message.text.split(' ')[1];

    if (!requestedRole || !['ADMIN'].includes(requestedRole)) {
      return ctx.reply('Invalid role request. Only ADMIN role is available.');
    }

    const user = await User.findOne({ phone_number: ctx.session.user.phone_number });
    if (user) {
      user.requestedRole = requestedRole;
      await user.save();
      ctx.reply(`Role change request to ${requestedRole} submitted successfully.`);
    } else {
      ctx.reply('Error finding user.');
    }
  } else {
    return ctx.reply('Please send a text message with your role request.');
  }
};

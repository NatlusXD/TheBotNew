import { MyContext } from '../types';
import { User } from '../models/User';
import { Roles } from '../models/Roles';
import { Message } from 'telegraf/typings/core/types/typegram';

export const register = async (ctx: MyContext) => {
  const message = ctx.message as Message.TextMessage;

  if (!message?.text) {
    return ctx.reply('Usage: /register <username> <password>');
  }

  const [username, password] = message.text.split(' ').slice(1);

  if (!username || !password) {
    return ctx.reply('Usage: /register <username> <password>');
  }

  const user = new User({ username, password, role: Roles.USER });
  await user.save();

  ctx.reply("User ${username} registered successfully with role ${Roles.USER}");
};
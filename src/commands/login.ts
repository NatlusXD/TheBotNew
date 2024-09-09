import { MyContext } from '../types';
import { User } from '../models/User';
import { Message } from 'telegraf/typings/core/types/typegram';

export const login = async (ctx: MyContext) => {
  const message = ctx.message as Message.TextMessage;

  if (!message?.text) {
    return ctx.reply('Usage: /login <username> <password>');
  }

  const [username, password] = message.text.split(' ').slice(1);

  if (!username || !password) {
    return ctx.reply('Usage: /login <username> <password>');
  }

  const user = await User.findOne({ username });
  if (!user || !(await user.comparePassword(password))) {
    return ctx.reply('Invalid username or password');
  }

  if (!ctx.session) {
    ctx.session = {};
  }

  ctx.session.user = user;
  ctx.reply("User ${username} logged in successfully");
};
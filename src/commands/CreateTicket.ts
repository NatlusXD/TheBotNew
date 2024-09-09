import { MyContext } from '../types';
import { Ticket } from '../models/Ticket';
import { Message } from 'telegraf/typings/core/types/typegram';

export const createTicket = async (ctx: MyContext) => {
  const message = ctx.message as Message.TextMessage;

  const commandText = message.text.trim();
  const args = commandText.split(/ (?=(?:(?:[^"]*"){2})*[^"]*$)/).slice(1); 

  if (args.length < 2) {
    return ctx.reply('Usage: /createTicket <title> <description>');
  }

  const [title, description] = args;
  
  if (!ctx.session?.user) {
    return ctx.reply('You need to be logged in to create a ticket.');
  }

  const ticket = new Ticket({
    username: ctx.session.user.username,
    title,
    description,
    status: false,
  });

  await ticket.save();

  ctx.reply(`Ticket "${title}" created successfully`);
};

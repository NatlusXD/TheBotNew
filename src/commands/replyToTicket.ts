import { MyContext } from '../types';
import { Ticket } from '../models/Ticket';
import { Message } from 'telegraf/typings/core/types/typegram';

export const replyToTicket = async (ctx: MyContext) => {
  if (!ctx.session || !ctx.session.user) {
    return ctx.reply('Session not initialized. Please try again.');
  }

  if (ctx.session.user.role !== 'ADMIN') {
    return ctx.reply('Only ADMIN can reply to tickets.');
  }

  const message = ctx.message as Message.TextMessage;

  const [command, ticketId, ...replyTextParts] = message.text.split(' ');
  const replyText = replyTextParts.join(' ');

  if (!ticketId || !replyText) {
    return ctx.reply('Usage: /replyToTicket <ticketId> <replyText>');
  }

  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    return ctx.reply('Ticket not found.');
  }

  if (!ticket.replies) {
    ticket.replies = [];
  }

  ticket.replies.push({
    username: ctx.session.user.username,
    text: replyText,
    date: new Date(),
  });

  await ticket.save();

  ctx.reply(`Replied to ticket ${ticketId} successfully.`);
};

import { MyContext } from '../types';
import { Ticket } from '../models/Ticket';
import { Message } from 'telegraf/typings/core/types/typegram';

export const changeTicketStatus = async (ctx: MyContext) => {
  if (!ctx.session) {
    return ctx.reply('Session not initialized. Please try again.');
  }

  const user = ctx.session.user;
  if (!user || user.role !== 'ADMIN') {
    return ctx.reply('Only ADMIN can change ticket status.');
  }

  const message = ctx.message as Message.TextMessage;

  const [command, ticketId, newStatus] = message.text.split(' ');

  if (!ticketId || !newStatus) {
    return ctx.reply('Usage: /changeTicketStatus <ticketId> <newStatus>. New status can be "open" or "closed".');
  }

  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    return ctx.reply('Ticket not found.');
  }

  if (newStatus === 'open') {
    ticket.status = false;
  } else if (newStatus === 'closed') {
    ticket.status = true;
  } else {
    return ctx.reply('Invalid status. Use "open" or "closed".');
  }

  await ticket.save();

  ctx.reply(`Ticket ${ticketId} status changed to ${newStatus}.`);
};

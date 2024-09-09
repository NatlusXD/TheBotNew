import { MyContext } from '../types';
import { Ticket } from '../models/Ticket';
import { Message } from 'telegraf/typings/core/types/typegram';

export const viewReplies = async (ctx: MyContext) => {
  if (!ctx.session) {
    return ctx.reply('Session not initialized. Please try again.');
  }

  if (!ctx.session.user) {
    return ctx.reply('You need to be logged in to view replies.');
  }

  const tickets = await Ticket.find({ username: ctx.session.user.phone_number });

  if (tickets.length === 0) {
    return ctx.reply('You have no tickets.');
  }

  tickets.forEach(ticket => {
    let replyText = `Ticket ID: ${ticket._id}\nTitle: ${ticket.title}\nDescription: ${ticket.description}\nStatus: ${ticket.status ? 'Closed' : 'Open'}\n\nReplies:\n`;

    if (!ticket.replies || ticket.replies.length === 0) {
      replyText += 'No replies found.';
    } else {
      ticket.replies.forEach(reply => {
        replyText += `\nReply by ${reply.username} on ${reply.date.toISOString()}:\n${reply.text}`;
      });
    }

    ctx.reply(replyText);
  });
};

import { MyContext } from '../types';
import { Ticket } from '../models/Ticket';
import { Message } from 'telegraf/typings/core/types/typegram';

export const editTicketDetails = async (ctx: MyContext) => {
  if (!ctx.session || !ctx.session.user) {
    return ctx.reply('Session not initialized. Please try again.');
  }

  if (ctx.session.user.role !== 'ADMIN') {
    return ctx.reply('Only ADMIN can edit ticket details.');
  }

  const message = ctx.message as Message.TextMessage;

  const commandText = message.text.trim();
  const args = commandText.split(/ (?=(?:(?:[^"]*"){2})*[^"]*$)/).slice(1);

  const [ticketId, field, ...newDetails] = args;
  const newDetailText = newDetails.join(' ');

  if (!ticketId || !field || !newDetailText) {
    return ctx.reply('Usage: /editTicketDetails <ticketId> <field> <newDetails>. Fields can be "title" or "description".');
  }

  const ticket = await Ticket.findById(ticketId);
  if (!ticket) {
    return ctx.reply('Ticket not found.');
  }

  if (field === 'title') {
    ticket.title = newDetailText;
  } else if (field === 'description') {
    ticket.description = newDetailText;
  } else {
    return ctx.reply('Invalid field. Use "title" or "description".');
  }

  await ticket.save();

  ctx.reply(`Ticket ${ticketId} updated successfully.`);
};

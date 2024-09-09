import { MyContext } from '../types';
import { Ticket } from '../models/Ticket';

export const viewAllTickets = async (ctx: MyContext) => {
  if (!ctx.session) {
    return ctx.reply('Session not initialized. Please try again.');
  }

  if (!ctx.session.user || ctx.session.user.role !== 'ADMIN') {
    return ctx.reply('Only ADMIN can view all tickets.');
  }

  const tickets = await Ticket.find();

  if (tickets.length === 0) {
    return ctx.reply('No tickets found.');
  }

  tickets.forEach(ticket => {
    ctx.reply(`Ticket ID: ${ticket._id}\nUsername: ${ticket.username}\nTitle: ${ticket.title}\nDescription: ${ticket.description}\nStatus: ${ticket.status ? 'Closed' : 'Open'}`);
  });
};

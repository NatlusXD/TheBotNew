import { Ticket } from '../models/Ticket';
import { MyContext } from '../types';

export const checkTicketStatus = async (ctx: MyContext) => {
  if (!ctx.session || !ctx.session.user) {
    return ctx.reply('You need to log in to check ticket status');
  }

  const tickets = await Ticket.find({ username: ctx.session.user.username });

  if (tickets.length === 0) {
    return ctx.reply('No tickets found');
  }

  tickets.forEach(ticket => {
    ctx.reply(`Title: ${ticket.title}, Status: ${ticket.status ? 'Closed' : 'Open'}`);
  });
};

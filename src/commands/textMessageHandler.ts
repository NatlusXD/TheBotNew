import { Telegraf } from 'telegraf';
import { Ticket } from '../models/Ticket';
import { User } from '../models/User';
import { CustomContext } from '../types';

export const textMessageHandler = (bot: Telegraf<CustomContext>) => {
  bot.on('text', async (ctx) => {
    if (!ctx.session) {
      ctx.session = {};
    }

    if (ctx.session.editingTicketId && ctx.session.editingField) {
      const ticketId = ctx.session.editingTicketId;
      const updateField = ctx.session.editingField;
      const updateValue = ctx.message.text;

      const updateData: any = {};
      updateData[updateField] = updateValue;

      const ticket = await Ticket.findById(ticketId);
      if (ticket) {
        await Ticket.findByIdAndUpdate(ticketId, updateData);
        const user = await User.findOne({ telegramUsername: ticket.username });
        if (user) {
          try {
            await ctx.telegram.sendMessage(user.id, `Your ticket "${ticket.title}" has been updated. ${updateField}: ${updateValue}`);
          } catch (error) {
            console.error(`Failed to send message to user ${user.id}:`, error);
          }
        }
      }

      ctx.reply(`Ticket ${updateField} updated successfully.`);
      
      delete ctx.session.editingTicketId;
      ctx.session.editingField = undefined; // Initialize as undefined
    }
  });
};
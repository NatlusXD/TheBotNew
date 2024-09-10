import { Telegraf } from 'telegraf';
import { Ticket } from '../models/Ticket';
import { CustomContext } from '../types';

const handleCreateTicketStart = async (ctx: CustomContext) => {
    if (!ctx.session) {
        ctx.session = {}; // Ensure ctx.session is initialized
    }
    ctx.session.ticketCreation = { step: 'title' };
    await ctx.reply('Please enter the title for your ticket.');
};

const isTextMessage = (message: any): message is { text: string } => {
    return message && typeof message.text === 'string';
};

const handleTicketTextInput = async (ctx: CustomContext) => {
  if (!ctx.session || !ctx.session.ticketCreation || !isTextMessage(ctx.message)) {
      return;
  }

  const { step } = ctx.session.ticketCreation;
  const text = ctx.message.text;

  if (step === 'title') {
      ctx.session.ticketCreation.title = text;
      ctx.session.ticketCreation.step = 'description';
      await ctx.reply('Please enter the description for your ticket.');
  } else if (step === 'description') {
      await createTicket(ctx, text);
  }
};

const createTicket = async (ctx: CustomContext, description: string) => {
  const ticketCreation = ctx.session?.ticketCreation;

  if (!ticketCreation || !ticketCreation.title) {
      await ctx.reply('Error: Ticket title is missing.');
      return;
  }

  const { title } = ticketCreation;

  const newTicket = new Ticket({
      username: ctx.from?.username || 'Anonymous',
      title,
      description,
      status: false,
  });

  await newTicket.save();
  await ctx.reply('Your ticket has been created.');
  delete ctx.session.ticketCreation;
};

export const createTicketCommand = (bot: Telegraf<CustomContext>) => {
    bot.action('create_ticket_command', handleCreateTicketStart);
    bot.on('text', handleTicketTextInput);
};
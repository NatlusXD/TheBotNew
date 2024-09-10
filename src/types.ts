import { Context } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';

export interface TicketData {
  username: string;
  title?: string;
  description?: string;
  status?: boolean;
  response?: string;
  adminUsername?: string;
}

export interface SessionData {
  ticketCreation?: { step: string; title?: string; };
  editingTicketId?: string;
  editingField?: string | null;
  newTicket?: TicketData;
  ticketManagement?: {
    action: 'view' | 'edit' | 'reply';
    ticketId: string;
  };
}

export interface CustomContext extends Context<Update> {
  session: SessionData;
}

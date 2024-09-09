// src/types/customContext.ts
import { Context } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';

// Define the structure of the ticket data
export interface TicketData {
  username: string;
  title: string;
  description: string;
  status: boolean; // Or use an appropriate type for status
  response?: string;
  adminUsername: String, // Field to store the admin's username who responded
}

// Define the structure of your session data
export interface SessionData {
  editingTicketId?: string;
  editingField?: string | null; // Allow null here
  newTicket?: TicketData;
}

// Extend the Telegraf context to include session data
export interface CustomContext extends Context<Update> {
  session: SessionData;
}

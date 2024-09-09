// src/models/Ticket.ts
import mongoose, { Document, Schema } from 'mongoose';
import { TicketData } from '../types';

const ticketSchema = new Schema<TicketData>({
  username: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: Boolean, default: true },
  response: { type: String, default: null },
});

export const Ticket = mongoose.model<TicketData>('Ticket', ticketSchema);

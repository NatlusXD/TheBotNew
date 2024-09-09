import { Schema, model } from 'mongoose';

const ticketSchema = new Schema({
  username: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: Boolean, default: false },
});

export const Ticket = model('Ticket', ticketSchema);

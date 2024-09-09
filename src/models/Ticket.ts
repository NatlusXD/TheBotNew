// models/Ticket.ts
import mongoose, { Schema, Document } from 'mongoose';

interface Reply {
  username: string;
  text: string;
  date: Date;
}

interface Ticket extends Document {
  username: string;
  title: string;
  description: string;
  status: boolean;
  replies?: Reply[];
}

const ReplySchema: Schema = new Schema({
  username: { type: String, required: true },
  text: { type: String, required: true },
  date: { type: Date, default: Date.now },  // Add date field
});

const TicketSchema: Schema = new Schema({
  username: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: Boolean, required: true },
  replies: [ReplySchema],  // Add replies field
});

export const Ticket = mongoose.model<Ticket>('Ticket', TicketSchema);
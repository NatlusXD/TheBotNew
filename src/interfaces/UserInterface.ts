import { Document } from 'mongoose';

export interface IUser extends Document {
  phone_number: string;
  telegramUsername: string;
  role: string;
  requestedRole?: string;
}

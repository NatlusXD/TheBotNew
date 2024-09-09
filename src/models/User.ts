import { Schema, model } from 'mongoose';
import { Roles } from './Roles';

const userSchema = new Schema({
  phone_number: { type: String, required: true, unique: true },
  telegramUsername: { type: String, required: true },
  role: { type: String, enum: Roles, default: Roles.USER },
  requestedRole: { type: String, enum: Roles },
});

export const User = model('User', userSchema);

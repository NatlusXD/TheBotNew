import { Model, Schema, model } from 'mongoose';
import { Roles } from './Roles';
import bcrypt from 'bcrypt';
import { IUser } from '../interfaces/UserInterface';

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: Roles, default: Roles.USER },
  requestedRole: { type: String, default: '' },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (candidatePassword: string): Promise<boolean> {
  const bcrypt = require('bcrypt');
  return bcrypt.compare(candidatePassword, this.password);
};

export const User: Model<IUser> = model<IUser>('User', userSchema);
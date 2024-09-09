import { Context as TelegrafContext } from 'telegraf';
import { IUser } from './interfaces/UserInterface';

interface SessionData {
  user?: IUser;
}

export interface MyContext extends TelegrafContext {
  session?: SessionData;
}

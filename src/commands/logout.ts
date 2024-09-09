import { MyContext } from "../types";

export const logout = (ctx: MyContext) => {
  if (ctx.session) {
    delete ctx.session.user;  
  } else {
    ctx.reply('No active session to log out from');
    return;
  }

  ctx.reply('Logged out successfully');
};

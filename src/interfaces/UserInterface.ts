export interface IUser extends Document {
    phone_number: string;
    username: string;
    role: string;
    requestedRole?: string;
    comparePassword(candidatePassword: string): Promise<boolean>;
  }
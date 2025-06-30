export interface IUser {
  id: number;
  username?: string;
  email: string;
  role?: string;
}

export interface IGoogleUser {
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
  googleId: string;
}
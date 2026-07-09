export interface IUser {
  id: string;
  name: string;
  email: string;
  createdAt: number;
}

export interface IUserInput {
  name: string;
  email: string;
}

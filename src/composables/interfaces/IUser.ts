export interface IUserLogin {
  email: string;
  password: string;
}

export interface IUserRegistration {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface IUser {
  name: string;
  email: string;
  role: 'admin' | 'teacher';
}

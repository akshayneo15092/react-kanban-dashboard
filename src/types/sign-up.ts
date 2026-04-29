export interface RegistrationForm {
  name: string;
  username: string;
  email: string;
  contact: string;
  date?:string;
  password: string;
}

export interface RegistrationErrors {
  name?: string;
  username?: string;
  email?: string;
  contact?: string;
  password?: string;
}

export interface RegistrationForm {
  name: string;
  username: string;
  email: string;
  contact: string;
  date?:string;
  password: string;
  terms: boolean;
}

export interface RegistrationErrors {
  name?: string;
  username?: string;
  email?: string;
  password?: string;
  terms?: string;
}
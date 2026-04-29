
export interface LoginForm {
  email: string;
  password: string;
  captchaChecked: boolean;
}

export interface LoginErrors {
  email?: string;
  password?: string;
  captcha?: string;
}
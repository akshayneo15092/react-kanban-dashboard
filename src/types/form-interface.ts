export interface FieldConfig {
  name: string;
  label: string;
  type?: string;
  date?:boolean;
  options?:any;
}

export interface AuthFormProps {
  title: string;
  fields: FieldConfig[];
  values: any;
  options?:any;
  errors: any;
  onChange: (name: string, value: any) => void;
  onSubmit: () => void;
  showCaptcha?: boolean;
  submitText: string;
  footerText: string;
  footerActionText: string;
  inputLabelProps?:boolean;
  onFooterAction: () => void;
}

export interface MailOptions {
  to: string;
  subject: string;
  template?: string;
  text?: string;
  html?: string;
  context?: {
    [key: string]: any;
  };
}

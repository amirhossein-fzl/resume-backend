export interface IValidationErrors {
    name: string;
    email: string;
    email_or_phone: string;
    message: string;
    captcha: string;
}

export interface IFormData {
    name: string;
    email: string;
    phone: string;
    message: string;
    'g-recaptcha-response': string;
}

export type FormData = {
    name: string,
    email: string,
    phone: string,
    message: string,
    'g-recaptcha-response': string,
};

export type Fields = 'name' | 'email' | 'email_or_phone' | 'message';

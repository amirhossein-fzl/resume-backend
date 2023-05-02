export interface IValidationErrors {
    name: string;
    email: string;
    email_or_phone: string;
    message: string;
}

export interface IFormData {
    name: string;
    email: string;
    phone: string;
    message: string;
}

export type Fields = 'name' | 'email' | 'email_or_phone' | 'message';

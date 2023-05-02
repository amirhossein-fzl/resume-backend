import type { IValidationErrors } from "../types/contact-form";
import type { IRule } from "../types/validation";

export class ValidationErrors<T extends keyof IValidationErrors> {
    private _errors: IValidationErrors;

    public constructor() {
        this._errors = {
            name: '',
            email: '',
            email_or_phone: '',
            message: '',
        };

        this.get_error.bind(this);
    }

    public get_error(field: T): string {
        return this._errors[field];
    }

    public set_error(field: T, message: string): void {
        this._errors[field] = message;
    }

    public is_error(field: T): boolean {
        return this._errors[field].length != 0;
    }

    public has_error(): boolean {
        let error_counts = Object.values(this._errors).filter((value: string) => {
            return value != '';
        }).length;

        return error_counts != 0;
    }
}

export default class Validation<T extends keyof IValidationErrors> extends ValidationErrors<T> {
    private _rules: Map<T, IRule>;
    public constructor() {
        super();
        this._rules = new Map();

        this.is_empty.bind(this);
        this.is_email.bind(this);
        this.require_one.bind(this);
        this.add_rule.bind(this);
        this.run_rule.bind(this);
    }

    public is_empty(value: string): boolean {
        if (value.trim().length == 0) {
            return true;
        }

        return false;
    }

    public is_email(value: string): boolean {
        let email_regex: RegExp =
            /([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|"([]!#-[^-~ \t]|(\\[\t -~]))+")@([0-9A-Za-z]([0-9A-Za-z-]{0,61}[0-9A-Za-z])?(\.[0-9A-Za-z]([0-9A-Za-z-]{0,61}[0-9A-Za-z])?)*|\[((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|IPv6:((((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){6}|::((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){5}|[0-9A-Fa-f]{0,4}::((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){4}|(((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):)?(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}))?::((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){3}|(((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){0,2}(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}))?::((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){2}|(((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){0,3}(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}))?::(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):|(((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){0,4}(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}))?::)((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3})|(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3})|(((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){0,5}(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}))?::(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3})|(((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){0,6}(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}))?::)|(?!IPv6:)[0-9A-Za-z-]*[0-9A-Za-z]:[!-Z^-~]+)])/;

        if (this.is_empty(value)) {
            return false;
        }

        return !email_regex.test(value);
    }

    public require_one(value1: string, value2: string): boolean {
        if (this.is_empty(value1) && this.is_empty(value2)) {
            return true;
        }

        return false;
    }

    public add_rule(field: T, method: any, message: string) {
        this._rules.set(field, { method, message });
    }

    public run_rule(field: T, ...args: string[]): void {
        let rule = this._rules.get(field);
        if (typeof rule != 'undefined') {
            let condition = rule.method.call(this, ...args);
            this.set_error(field, condition ? rule.message : '');
        }
    }
}

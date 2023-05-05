"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationErrors = void 0;
const axios_1 = __importDefault(require("axios"));
class ValidationErrors {
    _errors;
    constructor() {
        this._errors = {
            name: '',
            email: '',
            email_or_phone: '',
            message: '',
            captcha: ''
        };
        this.get_error.bind(this);
    }
    get_error(field) {
        return this._errors[field];
    }
    get_all_error() {
        let errors = Object.entries(this._errors);
        let filtered_errors = errors.filter(([key, value]) => value.length != 0);
        return Object.fromEntries(filtered_errors);
    }
    set_error(field, message) {
        this._errors[field] = message;
    }
    is_error(field) {
        return this._errors[field].length != 0;
    }
    has_error() {
        let error_counts = Object.values(this._errors).filter((value) => {
            return value != '';
        }).length;
        return error_counts != 0;
    }
}
exports.ValidationErrors = ValidationErrors;
class Validation extends ValidationErrors {
    _rules;
    constructor() {
        super();
        this._rules = new Map();
        this.is_empty.bind(this);
        this.is_email.bind(this);
        this.require_one.bind(this);
        this.add_rule.bind(this);
        this.run_rule.bind(this);
    }
    is_empty(value) {
        if (value.trim().length == 0) {
            return true;
        }
        return false;
    }
    is_email(value) {
        let email_regex = /([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|"([]!#-[^-~ \t]|(\\[\t -~]))+")@([0-9A-Za-z]([0-9A-Za-z-]{0,61}[0-9A-Za-z])?(\.[0-9A-Za-z]([0-9A-Za-z-]{0,61}[0-9A-Za-z])?)*|\[((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|IPv6:((((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){6}|::((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){5}|[0-9A-Fa-f]{0,4}::((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){4}|(((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):)?(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}))?::((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){3}|(((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){0,2}(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}))?::((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){2}|(((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){0,3}(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}))?::(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):|(((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){0,4}(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}))?::)((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3})|(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3})|(((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){0,5}(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}))?::(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3})|(((0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}):){0,6}(0|[1-9A-Fa-f][0-9A-Fa-f]{0,3}))?::)|(?!IPv6:)[0-9A-Za-z-]*[0-9A-Za-z]:[!-Z^-~]+)])/;
        if (this.is_empty(value)) {
            return false;
        }
        return !email_regex.test(value);
    }
    require_one(value1, value2) {
        if (this.is_empty(value1) && this.is_empty(value2)) {
            return true;
        }
        return false;
    }
    async verify_recaptcha(response) {
        let verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${response}`;
        let result = await axios_1.default.get(verificationUrl);
        if (result.data.success !== undefined && !result.data.success) {
            return false;
        }
        return true;
    }
    add_rule(field, method, message) {
        this._rules.set(field, { method, message });
    }
    run_rule(field, ...args) {
        let rule = this._rules.get(field);
        if (typeof rule != 'undefined') {
            let condition = rule.method.call(this, ...args);
            this.set_error(field, condition ? rule.message : '');
        }
    }
}
exports.default = Validation;

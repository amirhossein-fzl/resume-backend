import { Context } from 'hono';
import Validation from '../core/validation';
import axios from 'axios';

let index = async (ctx: Context) => {
    let data = await ctx.req.parseBody();
    let validation = new Validation();
    validation.add_rule(
        'name',
        validation.is_empty,
        'validation-errors.name.required'
    );
    validation.add_rule(
        'email',
        validation.is_email,
        'validation-errors.email.invalid'
    );
    validation.add_rule(
        'email_or_phone',
        validation.require_one,
        'validation-errors.email_or_phone'
    );
    validation.add_rule(
        'message',
        validation.is_empty,
        'validation-errors.message.required'
    );
    validation.add_rule(
        'captcha',
        validation.is_empty,
        'validation-errors.captcha.required'
    );

    if (typeof data['g-recaptcha-response'] == 'string') {
        validation.run_rule('captcha', data['g-recaptcha-response']);
        let recaptcha_status = await validation.verify_recaptcha(data['g-recaptcha-response']);
        if (!validation.is_error('captcha')) {
            validation.set_error('captcha', !recaptcha_status ? 'validation-errors.captcha.invalid' : '');
        }
    } else {
        validation.set_error('captcha', 'validation-errors.captcha.required');
    }

    if (typeof data.name == 'string') {
        validation.run_rule('name', data.name);
    } else {
        validation.set_error('name', 'validation-errors.name.required');
    }

    if (typeof data.email == 'string' && typeof data.phone == 'string') {
        validation.run_rule('email_or_phone', data.email, data.phone);
    } else {
        validation.set_error('email_or_phone', 'validation-errors.email_or_phone');
    }

    if (typeof data.email == 'string') {
        validation.run_rule('email', data.email);
    } else {
        validation.set_error('email', 'validation-errors.email.required');
    }

    if (typeof data.message == 'string') {
        validation.run_rule('message', data.message);
    } else {
        validation.set_error('message', 'validation-errors.message.required');
    }

    if (validation.has_error()) {
        return ctx.json({
            messages: validation.get_all_error()
        }, 400);
    }
};

export default { index };

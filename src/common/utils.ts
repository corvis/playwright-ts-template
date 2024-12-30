import {test} from "playwright/test";
import * as Mustache from "mustache";
import * as moment from 'moment';


/**
 * Decorator function to wrap a method in a Playwright test step.
 * @param stepName - The name of the step (optional). Step name can be a template string in this case function arguments
 * will be available in context by index. E.g. {{0}}, {{1}}, etc. If argument is an object, its properties can be accessed
 * by name. E.g. {{0.name}} - property name of the first argument.
 * @returns A decorator function.
 */
export function step(stepName?: string) {
    return function (target: Function, context: ClassMethodDecoratorContext) {
        return function replacementMethod(...args: any) {
            if (stepName) {
                const params = Object.assign({}, args);
                stepName = render_template(stepName, params);
            }
            const name = stepName || this.constructor.name + '.' + (context.name as string);
            return test.step(name, async () => {
                return await target.call(this, ...args);
            });
        };
    }
}

/**
 * Generates a random string of the specified length.
 * @param length - The length of the random string.
 * @returns A random string.
 */
export function generateRandomString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


/**
 * Renders a Mustache template with the provided data.
 * @param template - The Mustache template.
 * @param data - The data to render the template with.
 * @returns The rendered template.
 */
export function render_template(template: string, data: object): string {
    return Mustache.render(template, data);
}

/**
 * Ensures the input is a Date object.
 * @param date - The input date, either as a Date object or a string.
 * @param format - The format to parse the date string (optional). If not provided, ISO format will be used.
 * @returns A Date object.
 */
export function ensureDate(date: Date | string, format?: string): Date {
    if (date instanceof Date) {
        return date;
    } else {
        return format ? moment(date, format).toDate() : new Date(date);
    }
}
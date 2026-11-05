// Field rules shared by the boundary (form) classes. Not a BCE class.
//
// All data-field validation (required fields, lengths, formats) happens in the BOUNDARY,
// before a controller is called. Controllers and entities only receive input that has
// already passed these checks; entities only check things that need the stored data
// (e.g. "username already registered", "record not found").

// a username must be at least 3 characters
export const MIN_USERNAME = 3;
// a password must be at least 6 characters
export const MIN_PASSWORD = 6;

// check: is the value text that is not blank?
export function isFilled(value) {
    // true only if it is a string and not just spaces
    return typeof value === 'string' && value.trim() !== '';
}

// check: does the value look like an email address?
export function isEmail(value) {
    // true if it matches "something@something.something" with no spaces
    return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

// Optional field: blank is allowed, otherwise 8-15 digits (spaces, "-" and a leading "+" allowed)
export function isContactNumberOrBlank(value) {
    // blank is allowed (the field is optional)
    if (value == null || String(value).trim() === '') return true;
    // otherwise: may start with +, digits / spaces / dashes only...
    return /^\+?[0-9][0-9 -]{6,18}[0-9]$/.test(String(value).trim())
        // ...and must have 8 to 15 digits in total
        && String(value).replace(/\D/g, '').length >= 8 && String(value).replace(/\D/g, '').length <= 15;
}

// check: is the value a whole number above 0? (used for IDs)
export function isPositiveInteger(value) {
    // true only for 1, 2, 3, ...
    return Number.isInteger(value) && value > 0;
}

// Report dates (US44-46): a Date, "YYYY-MM-DD" or "YYYY-MM" (first day of that month). null if invalid.
export function parseDate(value) {
    // already a date object -> return it (or null if it is an invalid date)
    if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
    // split the text into year, month and (optional) day
    const m = /^(\d{4})-(\d{2})(?:-(\d{2}))?$/.exec(String(value ?? '').trim());
    // wrong format -> null
    if (!m) return null;
    // turn the parts into numbers (day 1 if no day was given)
    const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3] ?? 1)];
    // build the date (JavaScript months count from 0, so subtract 1)
    const date = new Date(y, mo - 1, d);
    // return it only if it is a real date (e.g. 2026-02-31 is rejected)
    return date.getFullYear() === y && date.getMonth() === mo - 1 && date.getDate() === d ? date : null;
}

// Runs a list of [condition, message] rules; returns the first failing message, or null if all pass
export function firstError(rules) {
    // go through the rules in order; the first failing one gives its message
    for (const [ok, message] of rules) if (!ok) return message;
    // nothing found
    return null;
}

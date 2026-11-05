// Field rules shared by the boundary (form) classes. Not a BCE class.
//
// All data-field validation (required fields, lengths, formats) happens in the BOUNDARY,
// before a controller is called. Controllers and entities only receive input that has
// already passed these checks; entities only check things that need the stored data
// (e.g. "username already registered", "record not found").

export const MIN_USERNAME = 3;
export const MIN_PASSWORD = 6;

export function isFilled(value) {
    return typeof value === 'string' && value.trim() !== '';
}

export function isEmail(value) {
    return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

// Optional field: blank is allowed, otherwise 8-15 digits (spaces, "-" and a leading "+" allowed)
export function isContactNumberOrBlank(value) {
    if (value == null || String(value).trim() === '') return true;
    return /^\+?[0-9][0-9 -]{6,18}[0-9]$/.test(String(value).trim())
        && String(value).replace(/\D/g, '').length >= 8 && String(value).replace(/\D/g, '').length <= 15;
}

export function isPositiveInteger(value) {
    return Number.isInteger(value) && value > 0;
}

// Report dates (US44-46): a Date, "YYYY-MM-DD" or "YYYY-MM" (first day of that month). null if invalid.
export function parseDate(value) {
    if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
    const m = /^(\d{4})-(\d{2})(?:-(\d{2}))?$/.exec(String(value ?? '').trim());
    if (!m) return null;
    const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3] ?? 1)];
    const date = new Date(y, mo - 1, d);
    return date.getFullYear() === y && date.getMonth() === mo - 1 && date.getDate() === d ? date : null;
}

// Runs a list of [condition, message] rules; returns the first failing message, or null if all pass
export function firstError(rules) {
    for (const [ok, message] of rules) if (!ok) return message;
    return null;
}

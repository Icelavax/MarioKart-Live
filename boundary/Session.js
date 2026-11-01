import { AsyncLocalStorage } from 'node:async_hooks';

// Who is logged in. Set by the four Login pages, cleared by the four Logout pages (killSession).
//
// On the web server every browser gets its own session: server.js runs each request inside
// runWithSession(<that browser's data>), so Session.userId means "the user of THIS request".
// Outside a request (e.g. node test.js) one shared default session is used.
const store = new AsyncLocalStorage();
const defaultSession = { userId: null, profileId: null, fullName: null };

export const Session = new Proxy({}, {
    get: (_, key) => (store.getStore() ?? defaultSession)[key],
    set: (_, key, value) => { (store.getStore() ?? defaultSession)[key] = value; return true; },
});

export function newSessionData() {
    return { userId: null, profileId: null, fullName: null };
}

export function runWithSession(data, fn) {
    return store.run(data, fn);
}

// Profile IDs of the four built-in roles (created by database/seed.js).
// Each Login page passes its own role as the userProfile argument.
export const Role = Object.freeze({
    USER_ADMIN: 1,
    INTERIOR_DESIGNER: 2,
    CUSTOMER: 3,
    PLATFORM_MANAGER: 4,
});

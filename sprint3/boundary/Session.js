// ==========================================================================
// PRESENTATION NOTE
// Session - who is logged in (not a BCE class)
//
// What to say: The four Login pages set Session.userId, profileId and fullName; the four Logout
//              pages clear them with killSession(). Each browser gets its own session through a
//              cookie, so several people can use the site at once.
//
// Q: How long does a login last?
// A: 8 hours of no activity, then the session expires and the user is sent back to the login
//    page.
// ==========================================================================

// bring in Node's AsyncLocalStorage: lets each browser request keep its own login data
import { AsyncLocalStorage } from 'node:async_hooks';

// Who is logged in. Set by the four Login pages, cleared by the four Logout pages (killSession).
//
// On the web server every browser gets its own session: server.js runs each request inside
// runWithSession(<that browser's data>), so Session.userId means "the user of THIS request".
// Outside a request (e.g. node test.js) one shared default session is used.
const store = new AsyncLocalStorage();
// login data used outside a web request (e.g. in test.js): nobody logged in
const defaultSession = { userId: null, profileId: null, fullName: null };

// Session looks like a normal object (Session.userId etc.), but reads and writes go to...
export const Session = new Proxy({}, {
    // ...the current browser's login data when reading a value...
    get: (_, key) => (store.getStore() ?? defaultSession)[key],
    // ...and the same place when writing a value
    set: (_, key, value) => { (store.getStore() ?? defaultSession)[key] = value; return true; },
});

// make empty login data for a new browser (called by server.js)
export function newSessionData() {
    // nobody logged in yet
    return { userId: null, profileId: null, fullName: null };
}

// run fn with this browser's login data as "the" Session (called by server.js on every request)
export function runWithSession(data, fn) {
    // everything inside fn sees this browser's Session
    return store.run(data, fn);
}

// Profile IDs of the four built-in roles (created by database/seed.js).
// Each Login page passes its own role as the userProfile argument.
export const Role = Object.freeze({
    // User Admin = profile 1
    USER_ADMIN: 1,
    // Interior Designer = profile 2
    INTERIOR_DESIGNER: 2,
    // Customer = profile 3
    CUSTOMER: 3,
    // Platform Manager = profile 4
    PLATFORM_MANAGER: 4,
});

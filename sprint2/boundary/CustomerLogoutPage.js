// bring in Session - who is logged in and which role they have
import { Session } from './Session.js';

// <<Boundary>> CustomerLogoutPage - US36 Customer Logout
// (No controller / entity in the BCE: logging out only ends the session.)
export default class CustomerLogoutPage {
    // what the screen is currently showing (type + message + data); starts empty
    output = null;

    // +clickLogout(): void
    // UI event: the actor does "click logout" on the screen
    clickLogout() {
        // BCE method: end the login session
        this.killSession();
    }

    // +killSession(): void
    // If the session has already expired, the user is simply directed to login.
    killSession() {
        // remember if someone was logged in before we clear it
        const wasLoggedIn = Session.userId != null;
        // clear the logged-in user ID...
        Session.userId = null;
        // ...their role...
        Session.profileId = null;
        // ...and their name = logged out
        Session.fullName = null;
        // show "Logout successful" if someone was logged in...
        this.#show(wasLoggedIn ? 'success' : 'message',
            // ...otherwise tell them the session had already ended
            wasLoggedIn ? 'Logout successful' : 'Session expired - please log in again');
    }

    // private helper: puts something on the 'screen' (every display... method ends up here)
    #show(type, message, data) {
        // remember what is on screen now, e.g. { type: 'error', message: 'Full name is required' }
        this.output = { type, message, data };
        // also print it to the terminal, tagged with the page name, so we can follow what happened
        console.log(`[CustomerLogoutPage] ${message ?? ''}`, data ?? '');
    }
}

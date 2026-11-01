import { Session } from './Session.js';

// <<Boundary>> PlatformManagerLogoutPage - US48 Platform Manager Logout
// (No controller / entity in the BCE: logging out only ends the session.)
export default class PlatformManagerLogoutPage {
    output = null;

    // +clickLogout(): void
    clickLogout() {
        this.killSession();
    }

    // +killSession(): void
    // If the session has already expired, the user is simply directed to login.
    killSession() {
        const wasLoggedIn = Session.userId != null;
        Session.userId = null;
        Session.profileId = null;
        Session.fullName = null;
        this.#show(wasLoggedIn ? 'success' : 'message',
            wasLoggedIn ? 'Logout successful' : 'Session expired - please log in again');
    }

    #show(type, message, data) {
        this.output = { type, message, data };
        console.log(`[PlatformManagerLogoutPage] ${message ?? ''}`, data ?? '');
    }
}

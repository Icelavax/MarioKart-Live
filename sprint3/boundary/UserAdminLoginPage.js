// ==========================================================================
// PRESENTATION NOTE
// US11 User Admin Login - <<Boundary>> UserAdminLoginPage
//
// What to say: This is the screen for US11. It passes the user's request to
//              UserAdminLoginController.login(), and then shows the result with displaySuccess()
//              or displayError(), following the sequence diagram.
//
// Q: What happens if a suspended user, or the wrong role, tries to log in?
// A: UserAccount.login() checks the password, that the account is Active and that the profile
//    matches. If any check fails it returns null and the page shows displayError().
// ==========================================================================

// bring in UserAdminLoginController - this page passes the user's request to it
import UserAdminLoginController from '../control/UserAdminLoginController.js';
// bring in Session, Role - who is logged in and which role they have
import { Session, Role } from './Session.js';

// <<Boundary>> UserAdminLoginPage - US11 User Admin Login
// BOUNDARY class: the screen the actor uses. It checks the input, calls the controller and shows the result
export default class UserAdminLoginPage {
    // Stand-in for the username / password input fields (until the UI exists)
    form = { username: '', password: '' };
    // what the screen is currently showing (type + message + data); starts empty
    output = null;

    // +displayMsg(): void - shows the login form
    // BCE method: show the form message "Please enter your username and password"
    displayMsg() { this.#show('form', 'Please enter your username and password'); }

    // +clickLogin(): void
    // UI event: the actor does "click login" on the screen
    clickLogin() {
        // ask the controller to log in...
        const userAccount = new UserAdminLoginController()
            // ...with the typed username and password, as a User Admin
            .login(this.form.username, this.form.password, Role.USER_ADMIN);
        if (userAccount != null) {                    // [userAccount != null]
            // login worked -> remember who is logged in: their user ID...
            Session.userId = userAccount.userId;
            // ...their role...
            Session.profileId = userAccount.profileId;
            // ...and their name (for "Welcome, <name>")
            Session.fullName = userAccount.fullName;
            // BCE method: show "Login successful"
            this.displaySuccess();
        } else {                                     // [userAccount == null]
            // BCE method: show "Invalid username or password"
            this.displayError();
        }
    }

    // +displaySuccess(): void
    // BCE method: show the success message "Login successful"
    displaySuccess() { this.#show('success', 'Login successful'); }

    // +displayError(): void
    // BCE method: show the error message "Invalid username or password, or account is not active"
    displayError() { this.#show('error', 'Invalid username or password, or account is not active'); }

    // private helper: puts something on the 'screen' (every display... method ends up here)
    #show(type, message, data) {
        // remember what is on screen now, e.g. { type: 'error', message: 'Full name is required' }
        this.output = { type, message, data };
        // also print it to the terminal, tagged with the page name, so we can follow what happened
        console.log(`[UserAdminLoginPage] ${message ?? ''}`, data ?? '');
    }
}

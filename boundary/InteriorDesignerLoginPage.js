import InteriorDesignerLoginController from '../control/InteriorDesignerLoginController.js';
import { Session, Role } from './Session.js';

// <<Boundary>> InteriorDesignerLoginPage - US18 Interior Designer Login
export default class InteriorDesignerLoginPage {
    // Stand-in for the username / password input fields (until the UI exists)
    form = { username: '', password: '' };
    output = null;

    // +displayMsg(): void - shows the login form
    displayMsg() { this.#show('form', 'Please enter your username and password'); }

    // +clickLogin(): void
    clickLogin() {
        const userAccount = new InteriorDesignerLoginController()
            .login(this.form.username, this.form.password, Role.INTERIOR_DESIGNER);
        if (userAccount != null) {                    // [userAccount != null]
            Session.userId = userAccount.userId;
            Session.profileId = userAccount.profileId;
            Session.fullName = userAccount.fullName;
            this.displaySuccess();
        } else {                                     // [userAccount == null]
            this.displayError();
        }
    }

    // +displaySuccess(): void
    displaySuccess() { this.#show('success', 'Login successful'); }

    // +displayError(): void
    displayError() { this.#show('error', 'Invalid username or password, or account is not active'); }

    #show(type, message, data) {
        this.output = { type, message, data };
        console.log(`[InteriorDesignerLoginPage] ${message ?? ''}`, data ?? '');
    }
}

// ==========================================================================
// PRESENTATION NOTE
// US2 View User Account - <<Boundary>> ViewUserAccountPage
//
// What to say: This is the screen for US2. It passes the user's request to
//              ViewUserAccountController.viewUserAccount(), and then shows the result with
//              displaySuccess() or displayError(), following the sequence diagram.
//
// Q: What if the record does not exist or was deleted?
// A: The entity returns null and the page shows an error message instead of the details.
// ==========================================================================

// bring in ViewUserAccountController - this page passes the user's request to it
import ViewUserAccountController from '../control/ViewUserAccountController.js';

// <<Boundary>> ViewUserAccountPage - US2 View User Account
// BOUNDARY class: the screen the actor uses. It checks the input, calls the controller and shows the result
export default class ViewUserAccountPage {
    // what the screen is currently showing (type + message + data); starts empty
    output = null;

    // +selectAccount(userId: Integer): void
    // UI event: the actor does "select account" on the screen (gets: userId)
    selectAccount(userId) {
        // ask the controller for the account with this ID
        const account = new ViewUserAccountController().viewUserAccount(userId);
        if (account != null) this.displayAccountDetails(account);   // [account found]
        else this.displayError('Account not found');                 // [account not found]
    }

    // +displayAccountDetails(account: UserAccount): void   (never shows the password hash)
    // BCE method displayAccountDetails() (gets: account)
    displayAccountDetails(account) {
        // copy every field EXCEPT the password hash (so it is never shown)
        const { passwordHash, ...details } = account;
        // show the account details
        this.#show('data', 'Account details', details);
    }

    // +displayError(message: String): void
    // BCE method: show the error message that was passed in (message)
    displayError(message) { this.#show('error', message); }

    // private helper: puts something on the 'screen' (every display... method ends up here)
    #show(type, message, data) {
        // remember what is on screen now, e.g. { type: 'error', message: 'Full name is required' }
        this.output = { type, message, data };
        // also print it to the terminal, tagged with the page name, so we can follow what happened
        console.log(`[ViewUserAccountPage] ${message ?? ''}`, data ?? '');
    }
}

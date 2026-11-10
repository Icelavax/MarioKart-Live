// bring in SuspendUserAccountController - this page passes the user's request to it
import SuspendUserAccountController from '../control/SuspendUserAccountController.js';

// <<Boundary>> SuspendUserAccountPage - US4 Suspend User Account
// BOUNDARY class: the screen the actor uses. It checks the input, calls the controller and shows the result
export default class SuspendUserAccountPage {
    account = null;          // the account currently shown
    // is the Yes/No confirmation pop-up open? starts closed
    confirmationOpen = false;
    // what the screen is currently showing (type + message + data); starts empty
    output = null;

    // ---- UI events (actor arrows in the sequence diagram; not BCE methods) ----
    // User Admin clicks "Suspend User Account"
    clickSuspendUserAccount() { this.displayConfirmation(); }
    // User Admin clicks "Yes" in the confirmation pop-up
    clickYes() {
        // ignore the click if the pop-up is not open or no account has been picked
        if (!this.confirmationOpen || this.account == null) return;
        // mark the Yes/No pop-up as closed
        this.confirmationOpen = false;
        // ask the controller to suspend this account
        const result = new SuspendUserAccountController().suspendUserAccount(this.account.userId);
        // controller said it worked -> show the success message
        if (result === true) this.displaySuccess('User Account Suspended');
        // otherwise show why it failed
        else this.#show('error', 'Account could not be suspended (not found or already suspended)');
    }
    // User Admin clicks "No" in the confirmation pop-up
    clickNo() { this.closeConfirmation(); }

    // ---- BCE methods ----
    // +displaySuspendUserAccount(account: UserAccount): void
    // BCE method displaySuspendUserAccount() (gets: account)
    displaySuspendUserAccount(account) {
        // remember which account is shown
        this.account = account;
        // copy every field EXCEPT the password hash (so it is never shown)
        const { passwordHash, ...details } = account;
        // show the account details
        this.#show('data', 'User account', details);
    }

    // +displayConfirmation(): void
    // BCE method: open the "Are you sure?" Yes/No pop-up
    displayConfirmation() {
        // mark the Yes/No pop-up as open
        this.confirmationOpen = true;
        // open the pop-up with this question
        this.#show('confirm', 'Suspend this user account?');
    }

    // +closeConfirmation(): void
    // BCE method: close the pop-up without changing anything
    closeConfirmation() {
        // mark the Yes/No pop-up as closed
        this.confirmationOpen = false;
        // show that nothing was changed
        this.#show('message', 'Suspension cancelled');
    }

    // +displaySuccess(message: String): void
    // BCE method: show the success message that was passed in (message)
    displaySuccess(message) { this.#show('success', message); }

    // private helper: puts something on the 'screen' (every display... method ends up here)
    #show(type, message, data) {
        // remember what is on screen now, e.g. { type: 'error', message: 'Full name is required' }
        this.output = { type, message, data };
        // also print it to the terminal, tagged with the page name, so we can follow what happened
        console.log(`[SuspendUserAccountPage] ${message ?? ''}`, data ?? '');
    }
}

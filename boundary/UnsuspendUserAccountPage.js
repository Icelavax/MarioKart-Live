import UnsuspendUserAccountController from '../control/UnsuspendUserAccountController.js';

// <<Boundary>> UnsuspendUserAccountPage - Unsuspend User Account (extra, pairs with US4)
export default class UnsuspendUserAccountPage {
    account = null;          // the account currently shown
    confirmationOpen = false;
    output = null;

    // ---- UI events (actor arrows in the sequence diagram; not BCE methods) ----
    // User Admin clicks "Unsuspend User Account"
    clickUnsuspendUserAccount() { this.displayConfirmation(); }
    // User Admin clicks "Yes" in the confirmation pop-up
    clickYes() {
        if (!this.confirmationOpen || this.account == null) return;
        this.confirmationOpen = false;
        const result = new UnsuspendUserAccountController().unsuspendUserAccount(this.account.userId);
        if (result === true) this.displaySuccess('User Account Unsuspended');
        else this.displayError('Account could not be unsuspended (not found or not suspended)');
    }
    // User Admin clicks "No" in the confirmation pop-up
    clickNo() { this.closeConfirmation(); }

    // ---- BCE methods ----
    // +displayUnsuspendUserAccount(account: UserAccount): void
    displayUnsuspendUserAccount(account) {
        this.account = account;
        const { passwordHash, ...details } = account;
        this.#show('data', 'User account', details);
    }

    // +displayConfirmation(): void
    displayConfirmation() {
        this.confirmationOpen = true;
        this.#show('confirm', 'Unsuspend this user account? The user will be able to log in again.');
    }

    // +closeConfirmation(): void
    closeConfirmation() {
        this.confirmationOpen = false;
        this.#show('message', 'Unsuspension cancelled');
    }

    // +displaySuccess(message: String): void
    displaySuccess(message) { this.#show('success', message); }

    // +displayError(message: String): void
    displayError(message) { this.#show('error', message); }

    #show(type, message, data) {
        this.output = { type, message, data };
        console.log(`[UnsuspendUserAccountPage] ${message ?? ''}`, data ?? '');
    }
}

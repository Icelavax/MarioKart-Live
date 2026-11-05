import SuspendUserAccountController from '../control/SuspendUserAccountController.js';

// <<Boundary>> SuspendUserAccountPage - US4 Suspend User Account
export default class SuspendUserAccountPage {
    account = null;          // the account currently shown
    confirmationOpen = false;
    output = null;

    // ---- UI events (actor arrows in the sequence diagram; not BCE methods) ----
    // User Admin clicks "Suspend User Account"
    clickSuspendUserAccount() { this.displayConfirmation(); }
    // User Admin clicks "Yes" in the confirmation pop-up
    clickYes() {
        if (!this.confirmationOpen || this.account == null) return;
        this.confirmationOpen = false;
        const result = new SuspendUserAccountController().suspendUserAccount(this.account.userId);
        if (result === true) this.displaySuccess('User Account Suspended');
        else this.#show('error', 'Account could not be suspended (not found or already suspended)');
    }
    // User Admin clicks "No" in the confirmation pop-up
    clickNo() { this.closeConfirmation(); }

    // ---- BCE methods ----
    // +displaySuspendUserAccount(account: UserAccount): void
    displaySuspendUserAccount(account) {
        this.account = account;
        const { passwordHash, ...details } = account;
        this.#show('data', 'User account', details);
    }

    // +displayConfirmation(): void
    displayConfirmation() {
        this.confirmationOpen = true;
        this.#show('confirm', 'Suspend this user account?');
    }

    // +closeConfirmation(): void
    closeConfirmation() {
        this.confirmationOpen = false;
        this.#show('message', 'Suspension cancelled');
    }

    // +displaySuccess(message: String): void
    displaySuccess(message) { this.#show('success', message); }

    #show(type, message, data) {
        this.output = { type, message, data };
        console.log(`[SuspendUserAccountPage] ${message ?? ''}`, data ?? '');
    }
}

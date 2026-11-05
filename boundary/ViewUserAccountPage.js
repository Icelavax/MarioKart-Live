import ViewUserAccountController from '../control/ViewUserAccountController.js';

// <<Boundary>> ViewUserAccountPage - US2 View User Account
export default class ViewUserAccountPage {
    output = null;

    // +selectAccount(userId: Integer): void
    selectAccount(userId) {
        const account = new ViewUserAccountController().viewUserAccount(userId);
        if (account != null) this.displayAccountDetails(account);   // [account found]
        else this.displayError('Account not found');                 // [account not found]
    }

    // +displayAccountDetails(account: UserAccount): void   (never shows the password hash)
    displayAccountDetails(account) {
        const { passwordHash, ...details } = account;
        this.#show('data', 'Account details', details);
    }

    // +displayError(message: String): void
    displayError(message) { this.#show('error', message); }

    #show(type, message, data) {
        this.output = { type, message, data };
        console.log(`[ViewUserAccountPage] ${message ?? ''}`, data ?? '');
    }
}

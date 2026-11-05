import SearchUserAccountController from '../control/SearchUserAccountController.js';
import { isFilled } from './Validator.js';

// <<Boundary>> SearchUserAccountPage - US5 Search User Account
export default class SearchUserAccountPage {
    results = [];
    output = null;

    // ---- UI events (actor arrows in the sequence diagram; not BCE methods) ----
    // User Admin enters a keyword (full name, user ID or email), clicks "Search"
    clickSearch(keyword) {
        if (!isFilled(keyword)) { this.displayError('Please enter a full name, user ID or email'); return; }   // boundary
        const accounts = new SearchUserAccountController().searchUserAccount(keyword.trim());
        if (accounts.length > 0) this.displayResults(accounts);              // [accounts is not empty]
        else this.displayError('No matching user accounts found');           // [accounts is empty]
    }
    // User Admin selects a user account from the list
    selectAccount(account) { this.displayAccountDetails(account); }

    // ---- BCE methods ----
    // +displayResults(accounts: List<UserAccount>): void
    displayResults(accounts) {
        this.results = accounts;
        this.#show('data', `${accounts.length} account(s) found`, accounts.map(a => ({
            userId: a.userId, fullName: a.fullName, email: a.email, accountStatus: a.accountStatus })));
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
        console.log(`[SearchUserAccountPage] ${message ?? ''}`, data ?? '');
    }
}

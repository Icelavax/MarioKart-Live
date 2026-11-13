// ==========================================================================
// PRESENTATION NOTE
// US5 Search User Account - <<Boundary>> SearchUserAccountPage
//
// What to say: This is the screen for US5. It first checks the input with Validator.js (blank
//              fields, formats). Only if the input is valid does it call
//              SearchUserAccountController.searchUserAccount(), and then it shows the result with
//              displaySuccess() or displayError(), following the sequence diagram.
//
// Q: Why is field validation in the boundary and not in the entity?
// A: Bad input is stopped at the screen, so the controller and entity only ever receive clean
//    data. The entity only checks rules that need stored data (e.g. duplicates).
//
// Q: How does the search match?
// A: It trims the keyword and does a case-insensitive "contains" match on the record's text
//    fields. An empty result shows a "no results" message (the alternate flow).
// ==========================================================================

// bring in SearchUserAccountController - this page passes the user's request to it
import SearchUserAccountController from '../control/SearchUserAccountController.js';
// bring in the shared field-check helpers we need: isFilled
import { isFilled } from './Validator.js';

// <<Boundary>> SearchUserAccountPage - US5 Search User Account
// BOUNDARY class: the screen the actor uses. It checks the input, calls the controller and shows the result
export default class SearchUserAccountPage {
    // the last search results shown on screen; starts as an empty list
    results = [];
    // what the screen is currently showing (type + message + data); starts empty
    output = null;

    // ---- UI events (actor arrows in the sequence diagram; not BCE methods) ----
    // User Admin enters a keyword (full name, user ID or email), clicks "Search"
    clickSearch(keyword) {
        if (!isFilled(keyword)) { this.displayError('Please enter a full name, user ID or email'); return; }   // boundary
        // ask the controller for accounts matching the trimmed keyword
        const accounts = new SearchUserAccountController().searchUserAccount(keyword.trim());
        if (accounts.length > 0) this.displayResults(accounts);              // [accounts is not empty]
        else this.displayError('No matching user accounts found');           // [accounts is empty]
    }
    // User Admin selects a user account from the list
    selectAccount(account) { this.displayAccountDetails(account); }

    // ---- BCE methods ----
    // +displayResults(accounts: List<UserAccount>): void
    // BCE method displayResults() (gets: accounts)
    displayResults(accounts) {
        // remember the results
        this.results = accounts;
        // show how many were found and, for each, only these fields:
        this.#show('data', `${accounts.length} account(s) found`, accounts.map(a => ({
            // user ID, full name, email and status (never the password hash)
            userId: a.userId, fullName: a.fullName, email: a.email, accountStatus: a.accountStatus })));
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
        console.log(`[SearchUserAccountPage] ${message ?? ''}`, data ?? '');
    }
}

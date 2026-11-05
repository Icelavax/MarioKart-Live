import SearchSavedIDPController from '../control/SearchSavedIDPController.js';
import { Session } from './Session.js';
import { isFilled } from './Validator.js';

// <<Boundary>> SearchSavedIDPPage - US33 Search Saved IDP
export default class SearchSavedIDPPage {
    results = [];
    output = null;

    // +searchSavedIDP(title: String): void   - customer enters a title, clicks "Search"
    searchSavedIDP(title) {
        if (!isFilled(title)) { this.#show('error', 'Please enter an IDP title'); return; }    // boundary
        const idps = new SearchSavedIDPController().searchSavedIDP(Session.userId, title.trim());
        if (idps.length > 0) this.displayResult(idps);     // idps not empty
        else this.displayNoResults();                     // idps empty
    }

    // +displayResult(idps: List<IDP>): void
    displayResult(idps) {
        this.results = idps;
        this.#show('data', `${idps.length} saved IDP(s) found`, idps.map(i => ({ ...i })));
    }

    // +displayNoResults(): void
    displayNoResults() { this.#show('message', 'No results found'); }

    #show(type, message, data) {
        this.output = { type, message, data };
        console.log(`[SearchSavedIDPPage] ${message ?? ''}`, data ?? '');
    }
}

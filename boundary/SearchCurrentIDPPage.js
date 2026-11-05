import SearchCurrentIDPController from '../control/SearchCurrentIDPController.js';
import { Session } from './Session.js';
import { isFilled, isPositiveInteger } from './Validator.js';

// <<Boundary>> SearchCurrentIDPPage - US24 Search Current IDP
export default class SearchCurrentIDPPage {
    form = { keyword: '', categoryId: null };   // stand-in for the search bar + category drop-down
    #criteria = null;
    results = [];
    output = null;

    // ---- UI events (actor arrows in the sequence diagram; not BCE methods) ----
    // Designer enters a keyword and/or picks a category, clicks "Search"
    enterSearchCriteria(keyword, categoryId) {
        this.form = { keyword, categoryId };
        this.captureSearchCriteria();
        const c = this.#criteria;
        if (!isFilled(c.keyword) && c.categoryId == null) {                  // field validation (boundary)
            this.#show('error', 'Please enter a keyword or choose a category');
            return;
        }
        if (c.categoryId != null && !isPositiveInteger(c.categoryId)) { this.displayFailure(); return; }
        // Only this designer's own projects are listed
        const idpList = new SearchCurrentIDPController().searchIDP((c.keyword ?? '').trim(), c.categoryId)
            .filter(i => i.designerId === Session.userId);
        if (idpList.length > 0) this.displaySearchResults(idpList);         // [idpList is not empty]
        else this.displayNoResults();                                      // [idpList is empty]
    }

    // ---- BCE methods ----
    // +displaySearchForm(): void
    displaySearchForm() { this.#show('form', 'Search current IDPs'); }

    // +captureSearchCriteria(): void
    captureSearchCriteria() { this.#criteria = { ...this.form }; }

    // +displaySearchResults(idpList: List<IDP>): void
    displaySearchResults(idpList) {
        this.results = idpList;
        this.#show('data', `${idpList.length} current IDP(s) found`, idpList.map(i => ({ ...i })));
    }

    // +displayNoResults(): void
    displayNoResults() { this.#show('message', 'No matching current IDPs found'); }

    // +displayFailure(): void
    displayFailure() { this.#show('failure', 'Search failed - please check the search criteria'); }

    #show(type, message, data) {
        this.output = { type, message, data };
        console.log(`[SearchCurrentIDPPage] ${message ?? ''}`, data ?? '');
    }
}

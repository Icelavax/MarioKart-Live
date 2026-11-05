import SearchPastIDPController from '../control/SearchPastIDPController.js';
import { Session } from './Session.js';
import { isFilled, isPositiveInteger } from './Validator.js';

// <<Boundary>> SearchPastIDPPage - US29 Search Past IDP
// Sequence: displaySearchForm() -> enterSearchCriteria(keyword, categoryId) -> captureSearchCriteria() -> searchIDP()
export default class SearchPastIDPPage {
    form = { keyword: '', categoryId: null };   // stand-in for the search bar + category drop-down
    #criteria = null;
    results = [];
    output = null;

    // +displaySearchForm(): void
    displaySearchForm() { this.#show('form', 'Search past IDPs'); }

    // +enterSearchCriteria(keyword: String, categoryId: Integer): void
    enterSearchCriteria(keyword, categoryId) {
        this.form = { keyword, categoryId };
        this.captureSearchCriteria();
        const c = this.#criteria;
        if (!isFilled(c.keyword) && c.categoryId == null) {                  // field validation (boundary)
            this.#show('error', 'Please enter a keyword or choose a category');
            return;
        }
        if (c.categoryId != null && !isPositiveInteger(c.categoryId)) { this.displayFailure(); return; }  // [Search operation failed]
        // Only this designer's own projects are listed
        const idpList = new SearchPastIDPController().searchIDP((c.keyword ?? '').trim(), c.categoryId)
            .filter(i => i.designerId === Session.userId);
        if (idpList.length > 0) this.displaySearchResults(idpList);         // [Matching IDPs found]
        else this.displayNoResults();                                      // [Matching IDPs not found]
    }

    // +captureSearchCriteria(): void
    captureSearchCriteria() { this.#criteria = { ...this.form }; }

    // +displaySearchResults(idpList: List<IDP>): void
    displaySearchResults(idpList) {
        this.results = idpList;
        this.#show('data', `${idpList.length} past IDP(s) found`, idpList.map(i => ({ ...i })));
    }

    // +displayNoResults(): void
    displayNoResults() { this.#show('message', 'No matching past IDPs found - try another keyword or category'); }

    // +displayFailure(): void
    displayFailure() { this.#show('failure', 'Search failed - please check the search criteria and retry'); }

    #show(type, message, data) {
        this.output = { type, message, data };
        console.log(`[SearchPastIDPPage] ${message ?? ''}`, data ?? '');
    }
}

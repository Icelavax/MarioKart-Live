// bring in SearchPastIDPController - this page passes the user's request to it
import SearchPastIDPController from '../control/SearchPastIDPController.js';
// bring in Session - who is logged in and which role they have
import { Session } from './Session.js';
// bring in the shared field-check helpers we need: isFilled, isPositiveInteger
import { isFilled, isPositiveInteger } from './Validator.js';

// <<Boundary>> SearchPastIDPPage - US29 Search Past IDP
// Sequence: displaySearchForm() -> enterSearchCriteria(keyword, categoryId) -> captureSearchCriteria() -> searchIDP()
export default class SearchPastIDPPage {
    form = { keyword: '', categoryId: null };   // stand-in for the search bar + category drop-down
    // private copy of the search criteria captured from the form
    #criteria = null;
    // the last search results shown on screen; starts as an empty list
    results = [];
    // what the screen is currently showing (type + message + data); starts empty
    output = null;

    // +displaySearchForm(): void
    // BCE method: show the form message "Search past IDPs"
    displaySearchForm() { this.#show('form', 'Search past IDPs'); }

    // +enterSearchCriteria(keyword: String, categoryId: Integer): void
    // UI event: the actor does "enter search criteria" on the screen (gets: keyword, categoryId)
    enterSearchCriteria(keyword, categoryId) {
        // remember what was typed / picked
        this.form = { keyword, categoryId };
        // copy it into #criteria
        this.captureSearchCriteria();
        // short name for the captured criteria
        const c = this.#criteria;
        if (!isFilled(c.keyword) && c.categoryId == null) {                  // field validation (boundary)
            // nothing typed AND no category picked -> show this message
            this.#show('error', 'Please enter a keyword or choose a category');
            // stop here
            return;
        }
        if (c.categoryId != null && !isPositiveInteger(c.categoryId)) { this.displayFailure(); return; }  // [Search operation failed]
        // Only this designer's own projects are listed
        const idpList = new SearchPastIDPController().searchIDP((c.keyword ?? '').trim(), c.categoryId)
            // ...and keep only the ones belonging to the logged-in designer
            .filter(i => i.designerId === Session.userId);
        if (idpList.length > 0) this.displaySearchResults(idpList);         // [Matching IDPs found]
        else this.displayNoResults();                                      // [Matching IDPs not found]
    }

    // +captureSearchCriteria(): void
    // BCE method: copy the form values into #criteria
    captureSearchCriteria() { this.#criteria = { ...this.form }; }

    // +displaySearchResults(idpList: List<IDP>): void
    // BCE method displaySearchResults() (gets: idpList)
    displaySearchResults(idpList) {
        // remember the results
        this.results = idpList;
        // show how many were found and the list
        this.#show('data', `${idpList.length} past IDP(s) found`, idpList.map(i => ({ ...i })));
    }

    // +displayNoResults(): void
    // BCE method: show the message message "No matching past IDPs found - try another keyword or category"
    displayNoResults() { this.#show('message', 'No matching past IDPs found - try another keyword or category'); }

    // +displayFailure(): void
    // BCE method: show the failure message "Search failed - please check the search criteria and retry"
    displayFailure() { this.#show('failure', 'Search failed - please check the search criteria and retry'); }

    // private helper: puts something on the 'screen' (every display... method ends up here)
    #show(type, message, data) {
        // remember what is on screen now, e.g. { type: 'error', message: 'Full name is required' }
        this.output = { type, message, data };
        // also print it to the terminal, tagged with the page name, so we can follow what happened
        console.log(`[SearchPastIDPPage] ${message ?? ''}`, data ?? '');
    }
}

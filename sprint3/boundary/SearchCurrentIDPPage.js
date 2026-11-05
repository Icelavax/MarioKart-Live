// bring in SearchCurrentIDPController - this page passes the user's request to it
import SearchCurrentIDPController from '../control/SearchCurrentIDPController.js';
// bring in Session - who is logged in and which role they have
import { Session } from './Session.js';
// bring in the shared field-check helpers we need: isFilled, isPositiveInteger
import { isFilled, isPositiveInteger } from './Validator.js';

// <<Boundary>> SearchCurrentIDPPage - US24 Search Current IDP
// BOUNDARY class: the screen the actor uses. It checks the input, calls the controller and shows the result
export default class SearchCurrentIDPPage {
    form = { keyword: '', categoryId: null };   // stand-in for the search bar + category drop-down
    // private copy of the search criteria captured from the form
    #criteria = null;
    // the last search results shown on screen; starts as an empty list
    results = [];
    // what the screen is currently showing (type + message + data); starts empty
    output = null;

    // ---- UI events (actor arrows in the sequence diagram; not BCE methods) ----
    // Designer enters a keyword and/or picks a category, clicks "Search"
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
        // a category value was given but it is not a valid ID -> show the failure message and stop
        if (c.categoryId != null && !isPositiveInteger(c.categoryId)) { this.displayFailure(); return; }
        // Only this designer's own projects are listed
        const idpList = new SearchCurrentIDPController().searchIDP((c.keyword ?? '').trim(), c.categoryId)
            // ...and keep only the ones belonging to the logged-in designer
            .filter(i => i.designerId === Session.userId);
        if (idpList.length > 0) this.displaySearchResults(idpList);         // [idpList is not empty]
        else this.displayNoResults();                                      // [idpList is empty]
    }

    // ---- BCE methods ----
    // +displaySearchForm(): void
    // BCE method: show the form message "Search current IDPs"
    displaySearchForm() { this.#show('form', 'Search current IDPs'); }

    // +captureSearchCriteria(): void
    // BCE method: copy the form values into #criteria
    captureSearchCriteria() { this.#criteria = { ...this.form }; }

    // +displaySearchResults(idpList: List<IDP>): void
    // BCE method displaySearchResults() (gets: idpList)
    displaySearchResults(idpList) {
        // remember the results
        this.results = idpList;
        // show how many were found and the list
        this.#show('data', `${idpList.length} current IDP(s) found`, idpList.map(i => ({ ...i })));
    }

    // +displayNoResults(): void
    // BCE method: show the message message "No matching current IDPs found"
    displayNoResults() { this.#show('message', 'No matching current IDPs found'); }

    // +displayFailure(): void
    // BCE method: show the failure message "Search failed - please check the search criteria"
    displayFailure() { this.#show('failure', 'Search failed - please check the search criteria'); }

    // private helper: puts something on the 'screen' (every display... method ends up here)
    #show(type, message, data) {
        // remember what is on screen now, e.g. { type: 'error', message: 'Full name is required' }
        this.output = { type, message, data };
        // also print it to the terminal, tagged with the page name, so we can follow what happened
        console.log(`[SearchCurrentIDPPage] ${message ?? ''}`, data ?? '');
    }
}

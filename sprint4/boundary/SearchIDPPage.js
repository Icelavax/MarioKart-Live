// ==========================================================================
// PRESENTATION NOTE
// US30 Search IDP - <<Boundary>> SearchIDPPage
//
// What to say: This is the screen for US30. It first checks the input with Validator.js (blank
//              fields, formats). Only if the input is valid does it call
//              SearchIDPController.searchIDP(), and then it shows the result with
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

// bring in SearchIDPController - this page passes the user's request to it
import SearchIDPController from '../control/SearchIDPController.js';
// bring in the shared field-check helpers we need: isFilled
import { isFilled } from './Validator.js';

// <<Boundary>> SearchIDPPage - US30 Search IDP
// BOUNDARY class: the screen the actor uses. It checks the input, calls the controller and shows the result
export default class SearchIDPPage {
    // what the screen is currently showing (type + message + data); starts empty
    output = null;

    // +enterSearchCriteria(criteria: String): void
    // UI event: the actor does "enter search criteria" on the screen (gets: criteria)
    enterSearchCriteria(criteria) {
        if (!isFilled(criteria)) { this.#show('error', 'Please enter search criteria'); return; }   // boundary
        // ask the controller for IDPs matching the trimmed search text
        const idps = new SearchIDPController().searchIDP(criteria.trim());
        if (idps.length > 0) this.displayResult(idps);   // [IDPs found]
        else this.displayNoResults();                    // [No matching IDPs found]
    }

    // +displayResult(idps: IDP[]): void
    // BCE method displayResult() (gets: idps)
    displayResult(idps) {
        // show how many were found and the list
        this.#show('data', `${idps.length} result(s)`, idps.map(i => ({ ...i })));
    }

    // +displayNoResults(): void
    // BCE method: show the message message "No results found"
    displayNoResults() { this.#show('message', 'No results found'); }

    // private helper: puts something on the 'screen' (every display... method ends up here)
    #show(type, message, data) {
        // remember what is on screen now, e.g. { type: 'error', message: 'Full name is required' }
        this.output = { type, message, data };
        // also print it to the terminal, tagged with the page name, so we can follow what happened
        console.log(`[SearchIDPPage] ${message ?? ''}`, data ?? '');
    }
}

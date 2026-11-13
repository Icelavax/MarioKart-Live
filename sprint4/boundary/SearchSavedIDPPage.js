// ==========================================================================
// PRESENTATION NOTE
// US33 Search Saved IDP - <<Boundary>> SearchSavedIDPPage
//
// What to say: This is the screen for US33. It first checks the input with Validator.js (blank
//              fields, formats). Only if the input is valid does it call
//              SearchSavedIDPController.searchSavedIDP(), and then it shows the result with
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

// bring in SearchSavedIDPController - this page passes the user's request to it
import SearchSavedIDPController from '../control/SearchSavedIDPController.js';
// bring in Session - who is logged in and which role they have
import { Session } from './Session.js';
// bring in the shared field-check helpers we need: isFilled
import { isFilled } from './Validator.js';

// <<Boundary>> SearchSavedIDPPage - US33 Search Saved IDP
// BOUNDARY class: the screen the actor uses. It checks the input, calls the controller and shows the result
export default class SearchSavedIDPPage {
    // the last search results shown on screen; starts as an empty list
    results = [];
    // what the screen is currently showing (type + message + data); starts empty
    output = null;

    // +searchSavedIDP(title: String): void   - customer enters a title, clicks "Search"
    // BCE method searchSavedIDP() (gets: title)
    searchSavedIDP(title) {
        if (!isFilled(title)) { this.#show('error', 'Please enter an IDP title'); return; }    // boundary
        // ask the controller for this customer's saved IDPs whose title matches
        const idps = new SearchSavedIDPController().searchSavedIDP(Session.userId, title.trim());
        if (idps.length > 0) this.displayResult(idps);     // idps not empty
        else this.displayNoResults();                     // idps empty
    }

    // +displayResult(idps: List<IDP>): void
    // BCE method displayResult() (gets: idps)
    displayResult(idps) {
        // remember the results
        this.results = idps;
        // show how many were found and the list
        this.#show('data', `${idps.length} saved IDP(s) found`, idps.map(i => ({ ...i })));
    }

    // +displayNoResults(): void
    // BCE method: show the message message "No results found"
    displayNoResults() { this.#show('message', 'No results found'); }

    // private helper: puts something on the 'screen' (every display... method ends up here)
    #show(type, message, data) {
        // remember what is on screen now, e.g. { type: 'error', message: 'Full name is required' }
        this.output = { type, message, data };
        // also print it to the terminal, tagged with the page name, so we can follow what happened
        console.log(`[SearchSavedIDPPage] ${message ?? ''}`, data ?? '');
    }
}

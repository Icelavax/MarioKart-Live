// ==========================================================================
// PRESENTATION NOTE
// US43 Search IDP Category - <<Boundary>> SearchIDPCategoryPage
//
// What to say: This is the screen for US43. It first checks the input with Validator.js (blank
//              fields, formats). Only if the input is valid does it call
//              SearchIDPCategoryController.searchCategory(), and then it shows the result with
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

// bring in SearchIDPCategoryController - this page passes the user's request to it
import SearchIDPCategoryController from '../control/SearchIDPCategoryController.js';
// bring in the shared field-check helpers we need: isFilled
import { isFilled } from './Validator.js';

// <<Boundary>> SearchIDPCategoryPage - US43 Search IDP Category
// BOUNDARY class: the screen the actor uses. It checks the input, calls the controller and shows the result
export default class SearchIDPCategoryPage {
    // the keyword typed in (starts empty)
    keyword = '';
    // the last search results shown on screen; starts as an empty list
    results = [];
    // what the screen is currently showing (type + message + data); starts empty
    output = null;

    // +enterKeyword(keyword: String): void
    // UI event: actor types a keyword
    enterKeyword(keyword) { this.keyword = keyword; }

    // +clickSearch(): void
    // UI event: the actor does "click search" on the screen
    clickSearch() {
        if (!isFilled(this.keyword)) {                                       // [Keyword = Null] (A2)
            // keyword is blank -> show this message
            this.displayError('Please enter a keyword');
            // stop here
            return;
        }
        // ask the controller for categories matching the trimmed keyword
        const categories = new SearchIDPCategoryController().searchCategory(this.keyword.trim());
        if (categories.length > 0) this.displaySearchResults(categories);   // [Matching Categories Found]
        else this.displayError('No categories found.');                     // [No Matching Categories] (A1)
    }

    // +displaySearchResults(categories: List<IDPCategory>): void
    // BCE method displaySearchResults() (gets: categories)
    displaySearchResults(categories) {
        // remember the results
        this.results = categories;
        // show how many were found ("1 category" / "2 categories")...
        this.#show('data', `${categories.length} categor${categories.length === 1 ? 'y' : 'ies'} found`,
            // ...and the list (copies, so the screen cannot change the stored data)
            categories.map(c => ({ ...c })));
    }

    // +displayError(message: String): void
    // BCE method: show the error message that was passed in (message)
    displayError(message) { this.#show('error', message); }

    // private helper: puts something on the 'screen' (every display... method ends up here)
    #show(type, message, data) {
        // remember what is on screen now, e.g. { type: 'error', message: 'Full name is required' }
        this.output = { type, message, data };
        // also print it to the terminal, tagged with the page name, so we can follow what happened
        console.log(`[SearchIDPCategoryPage] ${message ?? ''}`, data ?? '');
    }
}

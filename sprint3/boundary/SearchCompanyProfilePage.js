// bring in SearchCompanyProfileController - this page passes the user's request to it
import SearchCompanyProfileController from '../control/SearchCompanyProfileController.js';
// bring in the shared field-check helpers we need: isFilled
import { isFilled } from './Validator.js';

// <<Boundary>> SearchCompanyProfilePage - US17 Search Company Profile
// BOUNDARY class: the screen the actor uses. It checks the input, calls the controller and shows the result
export default class SearchCompanyProfilePage {
    // the last search results shown on screen; starts as an empty list
    results = [];
    // what the screen is currently showing (type + message + data); starts empty
    output = null;

    // +displaySearchOption(): void
    // BCE method: show the form message "Search company profiles"
    displaySearchOption() { this.#show('form', 'Search company profiles'); }

    // +enterSearchKeyword(keyword: String): void
    // UI event: the actor does "enter search keyword" on the screen (gets: keyword)
    enterSearchKeyword(keyword) {
        if (!isFilled(keyword)) { this.#show('error', 'Please enter a company name or keyword'); return; }   // boundary
        // ask the controller for company profiles matching the trimmed keyword, and remember them
        this.results = new SearchCompanyProfileController().searchCompanyProfile(keyword.trim());
        if (this.results.length > 0) this.displaySearchResults();     // Profiles Found
        else this.displayNoResults();                                // no matching profile
    }

    // UI event: designer selects a company profile from the results
    selectCompanyProfile(companyProfile) { this.displayCompanyDetails(companyProfile); }

    // +displaySearchResults(): void
    // BCE method displaySearchResults()
    displaySearchResults() {
        // show how many were found and the list (copies, so the screen cannot change the stored data)
        this.#show('data', `${this.results.length} company profile(s) found`, this.results.map(c => ({ ...c })));
    }

    // +displayNoResults(): void
    // BCE method: show the message message "No matching company profile found"
    displayNoResults() { this.#show('message', 'No matching company profile found'); }

    // +displayCompanyDetails(companyProfile: CompanyProfile): void
    // BCE method: show the company profile details (a copy, so the screen cannot change the stored data)
    displayCompanyDetails(companyProfile) { this.#show('data', 'Company profile', { ...companyProfile }); }

    // private helper: puts something on the 'screen' (every display... method ends up here)
    #show(type, message, data) {
        // remember what is on screen now, e.g. { type: 'error', message: 'Full name is required' }
        this.output = { type, message, data };
        // also print it to the terminal, tagged with the page name, so we can follow what happened
        console.log(`[SearchCompanyProfilePage] ${message ?? ''}`, data ?? '');
    }
}

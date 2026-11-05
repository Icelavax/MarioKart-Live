import SearchCompanyProfileController from '../control/SearchCompanyProfileController.js';
import { isFilled } from './Validator.js';

// <<Boundary>> SearchCompanyProfilePage - US17 Search Company Profile
export default class SearchCompanyProfilePage {
    results = [];
    output = null;

    // +displaySearchOption(): void
    displaySearchOption() { this.#show('form', 'Search company profiles'); }

    // +enterSearchKeyword(keyword: String): void
    enterSearchKeyword(keyword) {
        if (!isFilled(keyword)) { this.#show('error', 'Please enter a company name or keyword'); return; }   // boundary
        this.results = new SearchCompanyProfileController().searchCompanyProfile(keyword.trim());
        if (this.results.length > 0) this.displaySearchResults();     // Profiles Found
        else this.displayNoResults();                                // no matching profile
    }

    // UI event: designer selects a company profile from the results
    selectCompanyProfile(companyProfile) { this.displayCompanyDetails(companyProfile); }

    // +displaySearchResults(): void
    displaySearchResults() {
        this.#show('data', `${this.results.length} company profile(s) found`, this.results.map(c => ({ ...c })));
    }

    // +displayNoResults(): void
    displayNoResults() { this.#show('message', 'No matching company profile found'); }

    // +displayCompanyDetails(companyProfile: CompanyProfile): void
    displayCompanyDetails(companyProfile) { this.#show('data', 'Company profile', { ...companyProfile }); }

    #show(type, message, data) {
        this.output = { type, message, data };
        console.log(`[SearchCompanyProfilePage] ${message ?? ''}`, data ?? '');
    }
}

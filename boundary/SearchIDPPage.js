import SearchIDPController from '../control/SearchIDPController.js';
import { isFilled } from './Validator.js';

// <<Boundary>> SearchIDPPage - US30 Search IDP
export default class SearchIDPPage {
    output = null;

    // +enterSearchCriteria(criteria: String): void
    enterSearchCriteria(criteria) {
        if (!isFilled(criteria)) { this.#show('error', 'Please enter search criteria'); return; }   // boundary
        const idps = new SearchIDPController().searchIDP(criteria.trim());
        if (idps.length > 0) this.displayResult(idps);   // [IDPs found]
        else this.displayNoResults();                    // [No matching IDPs found]
    }

    // +displayResult(idps: IDP[]): void
    displayResult(idps) {
        this.#show('data', `${idps.length} result(s)`, idps.map(i => ({ ...i })));
    }

    // +displayNoResults(): void
    displayNoResults() { this.#show('message', 'No results found'); }

    #show(type, message, data) {
        this.output = { type, message, data };
        console.log(`[SearchIDPPage] ${message ?? ''}`, data ?? '');
    }
}

import SearchIDPCategoryController from '../control/SearchIDPCategoryController.js';
import { isFilled } from './Validator.js';

// <<Boundary>> SearchIDPCategoryPage - US43 Search IDP Category
export default class SearchIDPCategoryPage {
    keyword = '';
    results = [];
    output = null;

    // +enterKeyword(keyword: String): void
    enterKeyword(keyword) { this.keyword = keyword; }

    // +clickSearch(): void
    clickSearch() {
        if (!isFilled(this.keyword)) {                                       // [Keyword = Null] (A2)
            this.displayError('Please enter a keyword');
            return;
        }
        const categories = new SearchIDPCategoryController().searchCategory(this.keyword.trim());
        if (categories.length > 0) this.displaySearchResults(categories);   // [Matching Categories Found]
        else this.displayError('No categories found.');                     // [No Matching Categories] (A1)
    }

    // +displaySearchResults(categories: List<IDPCategory>): void
    displaySearchResults(categories) {
        this.results = categories;
        this.#show('data', `${categories.length} categor${categories.length === 1 ? 'y' : 'ies'} found`,
            categories.map(c => ({ ...c })));
    }

    // +displayError(message: String): void
    displayError(message) { this.#show('error', message); }

    #show(type, message, data) {
        this.output = { type, message, data };
        console.log(`[SearchIDPCategoryPage] ${message ?? ''}`, data ?? '');
    }
}

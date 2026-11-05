import ViewIDPCategoryController from '../control/ViewIDPCategoryController.js';

// <<Boundary>> ViewIDPCategoryPage - US40 View IDP Category
export default class ViewIDPCategoryPage {
    output = null;

    // +selectCategory(categoryId: Integer): void
    selectCategory(categoryId) {
        const category = new ViewIDPCategoryController().viewCategory(categoryId);
        if (category != null) this.displayCategoryDetails(category);   // [IDPCategory != null]
        else this.displayMessage('Category not found');                // [IDPCategory == null]
    }

    // +displayCategoryDetails(category: IDPCategory): void
    displayCategoryDetails(category) { this.#show('data', 'Category details', { ...category }); }

    // +displayMessage(message: String): void
    displayMessage(message) { this.#show('error', message); }

    #show(type, message, data) {
        this.output = { type, message, data };
        console.log(`[ViewIDPCategoryPage] ${message ?? ''}`, data ?? '');
    }
}

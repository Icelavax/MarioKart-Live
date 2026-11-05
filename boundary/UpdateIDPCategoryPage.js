import UpdateIDPCategoryController from '../control/UpdateIDPCategoryController.js';
import { isFilled, isPositiveInteger } from './Validator.js';

// <<Boundary>> UpdateIDPCategoryPage - US41 Update IDP Category
export default class UpdateIDPCategoryPage {
    category = null;
    output = null;

    // +clickUpdate(categoryID: int): void   - shows the current category information
    clickUpdate(categoryID) {
        const category = isPositiveInteger(categoryID) ? new UpdateIDPCategoryController().getCategory(categoryID) : null;
        if (category == null) { this.displayError('Category not found'); return; }    // A3
        this.displayCategoryDetails(category);
    }

    // +displayCategoryDetails(category: IDPCategory): void
    displayCategoryDetails(category) {
        this.category = category;
        this.#show('form', 'Update category form', { ...category });
    }

    // +updateCategory(categoryID: int, categoryName: String, categoryDescription: String): void
    updateCategory(categoryID, categoryName, categoryDescription) {
        if (!isFilled(categoryName)) { this.displayError('Category name is required'); return; }   // A1 (boundary)
        const updateResult = new UpdateIDPCategoryController()
            .updateCategory(categoryID, categoryName.trim(), (categoryDescription ?? '').trim());
        if (updateResult === true) this.displaySuccess('Category updated successfully');      // [Update Successful]
        else this.displayError('Category name already exists or category not found');         // [Update Failed]
    }

    // +displaySuccess(message: String): void
    displaySuccess(message) { this.#show('success', message); }

    // +displayError(message: String): void
    displayError(message) { this.#show('error', message); }

    #show(type, message, data) {
        this.output = { type, message, data };
        console.log(`[UpdateIDPCategoryPage] ${message ?? ''}`, data ?? '');
    }
}

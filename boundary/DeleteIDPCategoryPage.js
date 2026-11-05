import DeleteIDPCategoryController from '../control/DeleteIDPCategoryController.js';

// <<Boundary>> DeleteIDPCategoryPage - US42 Delete IDP Category
export default class DeleteIDPCategoryPage {
    categoryID = null;
    confirmationOpen = false;
    output = null;

    // +clickDelete(categoryID: int): void
    clickDelete(categoryID) {
        this.categoryID = categoryID;
        this.displayConfirmation();
    }

    // +displayConfirmation(): void
    displayConfirmation() {
        this.confirmationOpen = true;
        this.#show('confirm', 'Delete this category?');
    }

    // +confirmDelete(categoryID: int): void   - Manager Confirms Deletion
    confirmDelete(categoryID) {
        this.confirmationOpen = false;
        const result = new DeleteIDPCategoryController().deleteCategory(categoryID);
        if (result === true) this.displaySuccess('Category deleted successfully');                       // [Boolean == True]
        else this.displayError('Category cannot be deleted - it may not exist or is still used by IDPs');  // [Boolean == False]
    }

    // +cancelDelete(): void   - Manager Cancels Deletion
    cancelDelete() {
        this.confirmationOpen = false;
        this.#show('message', 'Deletion cancelled');
    }

    // +displaySuccess(message: String): void
    displaySuccess(message) { this.#show('success', message); }

    // +displayError(message: String): void
    displayError(message) { this.#show('error', message); }

    #show(type, message, data) {
        this.output = { type, message, data };
        console.log(`[DeleteIDPCategoryPage] ${message ?? ''}`, data ?? '');
    }
}

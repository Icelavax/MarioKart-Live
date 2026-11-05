// bring in DeleteIDPCategoryController - this page passes the user's request to it
import DeleteIDPCategoryController from '../control/DeleteIDPCategoryController.js';

// <<Boundary>> DeleteIDPCategoryPage - US42 Delete IDP Category
// BOUNDARY class: the screen the actor uses. It checks the input, calls the controller and shows the result
export default class DeleteIDPCategoryPage {
    // the ID of the category picked for deleting (none yet)
    categoryID = null;
    // is the Yes/No confirmation pop-up open? starts closed
    confirmationOpen = false;
    // what the screen is currently showing (type + message + data); starts empty
    output = null;

    // +clickDelete(categoryID: int): void
    // UI event: the actor does "click delete" on the screen (gets: categoryID)
    clickDelete(categoryID) {
        // remember which category was picked
        this.categoryID = categoryID;
        // ask "Are you sure?"
        this.displayConfirmation();
    }

    // +displayConfirmation(): void
    // BCE method: open the "Are you sure?" Yes/No pop-up
    displayConfirmation() {
        // mark the Yes/No pop-up as open
        this.confirmationOpen = true;
        // open the pop-up with this question
        this.#show('confirm', 'Delete this category?');
    }

    // +confirmDelete(categoryID: int): void   - Manager Confirms Deletion
    // BCE method confirmDelete() (gets: categoryID)
    confirmDelete(categoryID) {
        // mark the Yes/No pop-up as closed
        this.confirmationOpen = false;
        // ask the controller to delete the category (fails if IDPs still use it)
        const result = new DeleteIDPCategoryController().deleteCategory(categoryID);
        if (result === true) this.displaySuccess('Category deleted successfully');                       // [Boolean == True]
        else this.displayError('Category cannot be deleted - it may not exist or is still used by IDPs');  // [Boolean == False]
    }

    // +cancelDelete(): void   - Manager Cancels Deletion
    // UI event: the actor does "cancel delete" on the screen
    cancelDelete() {
        // mark the Yes/No pop-up as closed
        this.confirmationOpen = false;
        // show that nothing was deleted
        this.#show('message', 'Deletion cancelled');
    }

    // +displaySuccess(message: String): void
    // BCE method: show the success message that was passed in (message)
    displaySuccess(message) { this.#show('success', message); }

    // +displayError(message: String): void
    // BCE method: show the error message that was passed in (message)
    displayError(message) { this.#show('error', message); }

    // private helper: puts something on the 'screen' (every display... method ends up here)
    #show(type, message, data) {
        // remember what is on screen now, e.g. { type: 'error', message: 'Full name is required' }
        this.output = { type, message, data };
        // also print it to the terminal, tagged with the page name, so we can follow what happened
        console.log(`[DeleteIDPCategoryPage] ${message ?? ''}`, data ?? '');
    }
}

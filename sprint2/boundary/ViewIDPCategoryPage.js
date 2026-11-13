// ==========================================================================
// PRESENTATION NOTE
// US40 View IDP Category - <<Boundary>> ViewIDPCategoryPage
//
// What to say: This is the screen for US40. It passes the user's request to
//              ViewIDPCategoryController.viewCategory(), and then shows the result with
//              displaySuccess() or displayError(), following the sequence diagram.
//
// Q: What if the record does not exist or was deleted?
// A: The entity returns null and the page shows an error message instead of the details.
// ==========================================================================

// bring in ViewIDPCategoryController - this page passes the user's request to it
import ViewIDPCategoryController from '../control/ViewIDPCategoryController.js';

// <<Boundary>> ViewIDPCategoryPage - US40 View IDP Category
// BOUNDARY class: the screen the actor uses. It checks the input, calls the controller and shows the result
export default class ViewIDPCategoryPage {
    // what the screen is currently showing (type + message + data); starts empty
    output = null;

    // +selectCategory(categoryId: Integer): void
    // UI event: the actor does "select category" on the screen (gets: categoryId)
    selectCategory(categoryId) {
        // ask the controller for the category with this ID
        const category = new ViewIDPCategoryController().viewCategory(categoryId);
        if (category != null) this.displayCategoryDetails(category);   // [IDPCategory != null]
        else this.displayMessage('Category not found');                // [IDPCategory == null]
    }

    // +displayCategoryDetails(category: IDPCategory): void
    // BCE method: show the category details (a copy)
    displayCategoryDetails(category) { this.#show('data', 'Category details', { ...category }); }

    // +displayMessage(message: String): void
    // BCE method: show the error message that was passed in (message)
    displayMessage(message) { this.#show('error', message); }

    // private helper: puts something on the 'screen' (every display... method ends up here)
    #show(type, message, data) {
        // remember what is on screen now, e.g. { type: 'error', message: 'Full name is required' }
        this.output = { type, message, data };
        // also print it to the terminal, tagged with the page name, so we can follow what happened
        console.log(`[ViewIDPCategoryPage] ${message ?? ''}`, data ?? '');
    }
}

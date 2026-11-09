// bring in UpdateIDPCategoryController - this page passes the user's request to it
import UpdateIDPCategoryController from '../control/UpdateIDPCategoryController.js';
// bring in the shared field-check helpers we need: isFilled, isPositiveInteger
import { isFilled, isPositiveInteger } from './Validator.js';

// <<Boundary>> UpdateIDPCategoryPage - US41 Update IDP Category
// BOUNDARY class: the screen the actor uses. It checks the input, calls the controller and shows the result
export default class UpdateIDPCategoryPage {
    // the category picked for updating (none yet)
    category = null;
    // what the screen is currently showing (type + message + data); starts empty
    output = null;

    // +clickUpdate(categoryID: int): void   - shows the current category information
    // UI event: the actor does "click update" on the screen (gets: categoryID)
    clickUpdate(categoryID) {
        // load the category only if the ID is a valid positive number (otherwise null)
        const category = isPositiveInteger(categoryID) ? new UpdateIDPCategoryController().getCategory(categoryID) : null;
        if (category == null) { this.displayError('Category not found'); return; }    // A3
        // show its details
        this.displayCategoryDetails(category);
    }

    // +displayCategoryDetails(category: IDPCategory): void
    // BCE method displayCategoryDetails() (gets: category)
    displayCategoryDetails(category) {
        // remember which category is being updated
        this.category = category;
        // show the update form filled in with its values
        this.#show('form', 'Update category form', { ...category });
    }

    // +updateCategory(categoryID: int, categoryName: String, categoryDescription: String): void
    // BCE method updateCategory() (gets: categoryID, categoryName, categoryDescription)
    updateCategory(categoryID, categoryName, categoryDescription) {
        if (!isFilled(categoryName)) { this.displayError('Category name is required'); return; }   // A1 (boundary)
        // ask the controller to update the category...
        const updateResult = new UpdateIDPCategoryController()
            // ...with the trimmed name and description
            .updateCategory(categoryID, categoryName.trim(), (categoryDescription ?? '').trim());
        if (updateResult === true) this.displaySuccess('Category updated successfully');      // [Update Successful]
        else this.displayError('Category name already exists or category not found');         // [Update Failed]
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
        console.log(`[UpdateIDPCategoryPage] ${message ?? ''}`, data ?? '');
    }
}

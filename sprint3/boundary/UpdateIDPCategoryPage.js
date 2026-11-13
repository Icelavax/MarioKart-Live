// ==========================================================================
// PRESENTATION NOTE
// US41 Update IDP Category - <<Boundary>> UpdateIDPCategoryPage
//
// What to say: This is the screen for US41. It first checks the input with Validator.js (blank
//              fields, formats). Only if the input is valid does it call
//              UpdateIDPCategoryController.getCategory(), and then it shows the result with
//              displaySuccess() or displayError(), following the sequence diagram.
//
// Q: Why is field validation in the boundary and not in the entity?
// A: Bad input is stopped at the screen, so the controller and entity only ever receive clean
//    data. The entity only checks rules that need stored data (e.g. duplicates).
//
// Q: When is the change actually saved?
// A: Only after the user clicks Yes on the confirmation pop-up (displayConfirmation() in the
//    sequence diagram). Then the entity updates the record and db.js saves it to Neon.
// ==========================================================================

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

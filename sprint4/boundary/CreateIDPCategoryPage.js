// ==========================================================================
// PRESENTATION NOTE
// US39 Create IDP Category - <<Boundary>> CreateIDPCategoryPage
//
// What to say: This is the screen for US39. It first checks the input with Validator.js (blank
//              fields, formats). Only if the input is valid does it call
//              CreateIDPCategoryController.createCategory(), and then it shows the result with
//              displaySuccess() or displayError(), following the sequence diagram.
//
// Q: Why is field validation in the boundary and not in the entity?
// A: Bad input is stopped at the screen, so the controller and entity only ever receive clean
//    data. The entity only checks rules that need stored data (e.g. duplicates).
//
// Q: Where is the duplicate check done, and why there?
// A: Field formats (blank, length, email) are checked in the boundary. A duplicate check needs
//    the stored data, so the entity does it and returns false, and the page shows displayError().
// ==========================================================================

// bring in CreateIDPCategoryController - this page passes the user's request to it
import CreateIDPCategoryController from '../control/CreateIDPCategoryController.js';
// bring in the shared field-check helpers we need: isFilled
import { isFilled } from './Validator.js';

// <<Boundary>> CreateIDPCategoryPage - US39 Create IDP Category
// BOUNDARY class: the screen the actor uses. It checks the input, calls the controller and shows the result
export default class CreateIDPCategoryPage {
    // Stand-in for the category name / description input fields
    form = { categoryName: '', categoryDescription: '' };
    // what the screen is currently showing (type + message + data); starts empty
    output = null;

    // +clickCreate(): void
    // UI event: the actor does "click create" on the screen
    clickCreate() {
        if (!isFilled(this.form.categoryName)) {                       // field validation (boundary)
            // name is blank -> show this message (field validation in the boundary)
            this.displayMessage('Category name is required');
            // stop here
            return;
        }
        // input OK -> ask the controller to create the category...
        const result = new CreateIDPCategoryController()
            // ...with the trimmed name and description
            .createCategory(this.form.categoryName.trim(), (this.form.categoryDescription ?? '').trim());
        if (result === true) this.displayMessage('Category created successfully');   // [Boolean == true]
        else this.displayMessage('Unable to create category');                       // [Boolean == false]
    }

    // +displayMessage(message: String): void
    // BCE method displayMessage() (gets: message)
    displayMessage(message) {
        // show it green (success) if it was created, red (error) otherwise
        this.#show(message === 'Category created successfully' ? 'success' : 'error', message);
    }

    // private helper: puts something on the 'screen' (every display... method ends up here)
    #show(type, message, data) {
        // remember what is on screen now, e.g. { type: 'error', message: 'Full name is required' }
        this.output = { type, message, data };
        // also print it to the terminal, tagged with the page name, so we can follow what happened
        console.log(`[CreateIDPCategoryPage] ${message ?? ''}`, data ?? '');
    }
}

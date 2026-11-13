// ==========================================================================
// PRESENTATION NOTE
// US20 Create Current IDP - <<Boundary>> CreateCurrentIDPPage
//
// What to say: This is the screen for US20. It first checks the input with Validator.js (blank
//              fields, formats). Only if the input is valid does it call
//              CreateCurrentIDPController.createIDP(), and then it shows the result with
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

// bring in CreateCurrentIDPController - this page passes the user's request to it
import CreateCurrentIDPController from '../control/CreateCurrentIDPController.js';
// bring in Session - who is logged in and which role they have
import { Session } from './Session.js';
// bring in the shared field-check helpers we need: isFilled, isPositiveInteger
import { isFilled, isPositiveInteger } from './Validator.js';

// <<Boundary>> CreateCurrentIDPPage - US20 Create Current IDP
// BOUNDARY class: the screen the actor uses. It checks the input, calls the controller and shows the result
export default class CreateCurrentIDPPage {
    // Stand-in for the category / title / description input fields
    form = { categoryId: null, title: '', description: '' };
    // private copy of the details captured from the form
    #details = null;
    // what the screen is currently showing (type + message + data); starts empty
    output = null;

    // +displayCreateForm(): void
    // US20 sequence: displayCreateForm() -> captureIDPDetails() -> validateInput() -> createIDP()
    displayCreateForm() {
        // show the empty "Create IDP" form
        this.#show('form', 'Create current IDP form');
        // copy what was typed into the form
        this.captureIDPDetails();
        // check the input; if something is missing, show the failure message and stop
        if (!this.validateInput()) { this.displayFailure(); return; }

        // input OK -> ask the controller to create the IDP...
        const success = new CreateCurrentIDPController().createIDP(
            // ...for the logged-in designer, in the chosen category, with the trimmed title and description
            Session.userId, this.#details.categoryId, this.#details.title.trim(), this.#details.description.trim());
        if (success === true) this.displaySuccess();      // [success = true]
        else this.displayFailure();                       // [success = false]
    }

    // +captureIDPDetails(): void
    // BCE method: copy the form values into #details
    captureIDPDetails() { this.#details = { ...this.form }; }

    // +validateInput(): boolean
    // All field validation for US20 is here; the IDP entity only stores the record.
    validateInput() {
        // short name for the captured details
        const d = this.#details;
        // valid only if: details were captured, a designer is logged in, a category was picked...
        return d != null && Session.userId != null && isPositiveInteger(d.categoryId)
            // ...and the title and description are not blank
            && isFilled(d.title) && isFilled(d.description);
    }

    // +displaySuccess(): void
    // BCE method: show the success message "IDP created"
    displaySuccess() { this.#show('success', 'IDP created'); }

    // +displayFailure(): void
    // BCE method: show the failure message "Unable to create IDP - please correct the details and retry"
    displayFailure() { this.#show('failure', 'Unable to create IDP - please correct the details and retry'); }

    // private helper: puts something on the 'screen' (every display... method ends up here)
    #show(type, message, data) {
        // remember what is on screen now, e.g. { type: 'error', message: 'Full name is required' }
        this.output = { type, message, data };
        // also print it to the terminal, tagged with the page name, so we can follow what happened
        console.log(`[CreateCurrentIDPPage] ${message ?? ''}`, data ?? '');
    }
}

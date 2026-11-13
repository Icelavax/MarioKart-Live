// ==========================================================================
// PRESENTATION NOTE
// US6 Create User Profile - <<Boundary>> CreateUserProfilePage
//
// What to say: This is the screen for US6. It first checks the input with Validator.js (blank
//              fields, formats). Only if the input is valid does it call
//              CreateUserProfileController.createUserProfile(), and then it shows the result with
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

// bring in CreateUserProfileController - this page passes the user's request to it
import CreateUserProfileController from '../control/CreateUserProfileController.js';
// bring in the shared field-check helpers we need: isFilled
import { isFilled } from './Validator.js';

// <<Boundary>> CreateUserProfilePage - US6 Create User Profile
// BOUNDARY class: the screen the actor uses. It checks the input, calls the controller and shows the result
export default class CreateUserProfilePage {
    // what the screen is currently showing (type + message + data); starts empty
    output = null;

    // +displayCreationForm(): void
    // BCE method: show the form message "Create user profile form"
    displayCreationForm() { this.#show('form', 'Create user profile form'); }

    // +submitForm(profileName: String, description: String): void
    // BCE method submitForm() (gets: profileName, description)
    submitForm(profileName, description) {
        // rule: profile name must not be blank -> show the error and stop
        if (!isFilled(profileName)) { this.displayError('Profile name is required'); return; }

        // input OK -> ask the controller to create the profile...
        const result = new CreateUserProfileController()
            // ...with the trimmed name and description
            .createUserProfile(profileName.trim(), (description ?? '').trim());
        // controller said it worked -> show the success message
        if (result === true) this.displaySuccess('Profile created');
        // otherwise it failed -> show the error message
        else this.displayError('A profile with this name already exists');
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
        console.log(`[CreateUserProfilePage] ${message ?? ''}`, data ?? '');
    }
}

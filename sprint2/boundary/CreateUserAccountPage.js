// ==========================================================================
// PRESENTATION NOTE
// US1 Create User Account - <<Boundary>> CreateUserAccountPage
//
// What to say: This is the screen for US1. It first checks the input with Validator.js (blank
//              fields, formats). Only if the input is valid does it call
//              CreateUserAccountController.createUserAccount(), and then it shows the result with
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

// bring in CreateUserAccountController - this page passes the user's request to it
import CreateUserAccountController from '../control/CreateUserAccountController.js';
// bring in the shared field-check helpers we need: isFilled, isEmail, isContactNumberOrBlank, isPositiveInteger, firstError ...
import { isFilled, isEmail, isContactNumberOrBlank, isPositiveInteger, firstError,
         // ...and the minimum lengths for username and password
         MIN_USERNAME, MIN_PASSWORD } from './Validator.js';

// <<Boundary>> CreateUserAccountPage - US1 Create User Account
// BOUNDARY class: the screen the actor uses. It checks the input, calls the controller and shows the result
export default class CreateUserAccountPage {
    output = null;   // what the page is showing (stand-in for the screen)

    // +displayCreationForm(): void
    // BCE method: show the form message "Create user account form"
    displayCreationForm() { this.#show('form', 'Create user account form'); }

    // +submitForm(username: String, email: String, password: String,
    //             fullName: String, contactNumber: String, profileId: Integer): void
    // Field validation is done here (boundary); the entity only checks for duplicates.
    submitForm(username, email, password, fullName, contactNumber, profileId) {
        // check every field in order; error = message of the first rule that fails (null = all OK)
        const error = firstError([
            // rule: username must be filled in and at least 3 characters
            [isFilled(username) && username.trim().length >= MIN_USERNAME, `Username must be at least ${MIN_USERNAME} characters`],
            // rule: email must look like name@domain.com
            [isEmail(email), 'Please enter a valid email address'],
            // rule: password must be at least 6 characters
            [typeof password === 'string' && password.length >= MIN_PASSWORD, `Password must be at least ${MIN_PASSWORD} characters`],
            // rule: full name must not be blank
            [isFilled(fullName), 'Full name is required'],
            // rule: contact number is optional, but if given it must be 8-15 digits
            [isContactNumberOrBlank(contactNumber), 'Contact number must be 8-15 digits'],
            // rule: a user profile (role) must be picked from the drop-down
            [isPositiveInteger(profileId), 'Please select a user profile'],
        ]);
        // a field failed its check -> show that message and stop (the controller is NOT called)
        if (error) { this.displayError(error); return; }

        // all fields OK -> pass the details to the controller...
        const result = new CreateUserAccountController().createUserAccount(
            // ...trimmed (no extra spaces); the password is passed as typed
            username.trim(), email.trim(), password, fullName.trim(), (contactNumber ?? '').trim(), profileId);
        // controller said it worked -> show the success message
        if (result === true) this.displaySuccess('Account created');
        // otherwise it failed -> show the error message
        else this.displayError('Username or email is already registered');
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
        console.log(`[CreateUserAccountPage] ${message ?? ''}`, data ?? '');
    }
}

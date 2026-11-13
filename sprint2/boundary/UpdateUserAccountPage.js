// ==========================================================================
// PRESENTATION NOTE
// US3 Update User Account - <<Boundary>> UpdateUserAccountPage
//
// What to say: This is the screen for US3. It first checks the input with Validator.js (blank
//              fields, formats). Only if the input is valid does it call
//              UpdateUserAccountController.updateUserAccount(), and then it shows the result with
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

// bring in UpdateUserAccountController - this page passes the user's request to it
import UpdateUserAccountController from '../control/UpdateUserAccountController.js';
// bring in the shared field-check helpers we need: isFilled, isEmail, isContactNumberOrBlank, firstError
import { isFilled, isEmail, isContactNumberOrBlank, firstError } from './Validator.js';

// <<Boundary>> UpdateUserAccountPage - US3 Update User Account
// BOUNDARY class: the screen the actor uses. It checks the input, calls the controller and shows the result
export default class UpdateUserAccountPage {
    // Stand-in for the editable fields of the update form
    form = { userId: null, fullName: '', email: '', contactNumber: '' };
    // is the Yes/No confirmation pop-up open? starts closed
    confirmationOpen = false;
    // what the screen is currently showing (type + message + data); starts empty
    output = null;

    // ---- UI events (actor arrows in the sequence diagram; not BCE methods) ----
    // User Admin clicks "Update Account" on a selected account
    clickUpdateAccount(account) { this.displayUpdateForm(account); }
    // User Admin edits details, clicks "Save Changes"
    clickSaveChanges() { this.displayConfirmation(); }
    // User Admin clicks "Yes" in the confirmation pop-up
    clickYes() {
        // ignore the click if no confirmation pop-up is open
        if (!this.confirmationOpen) return;
        // mark the Yes/No pop-up as closed
        this.confirmationOpen = false;
        // take the 4 values out of the form
        const { userId, fullName, email, contactNumber } = this.form;
        const error = firstError([                                       // field validation (boundary)
            // rule: full name must not be blank
            [isFilled(fullName), 'Full name is required'],
            // rule: email must look like name@domain.com
            [isEmail(email), 'Please enter a valid email address'],
            // rule: contact number is optional, but if given it must be 8-15 digits
            [isContactNumberOrBlank(contactNumber), 'Contact number must be 8-15 digits'],
        ]);
        // a field failed its check -> show that message and stop (the controller is NOT called)
        if (error) { this.displayError(error); return; }
        // ask the controller to update the account...
        const result = new UpdateUserAccountController()
            // ...with the trimmed name, email and contact number
            .updateUserAccount(userId, fullName.trim(), email.trim(), (contactNumber ?? '').trim());
        if (result === true) this.displaySuccess('Changes saved successfully');   // [result == true]
        else this.displayError('Invalid input');                                 // [result == false]
    }
    // User Admin clicks "No" in the confirmation pop-up
    clickNo() { this.closeConfirmation(); }

    // ---- BCE methods ----
    // +displayUpdateForm(account: UserAccount): void
    // BCE method displayUpdateForm() (gets: account)
    displayUpdateForm(account) {
        // fill the form with the account's current values...
        this.form = { userId: account.userId, fullName: account.fullName,
                      // ...email and contact number
                      email: account.email, contactNumber: account.contactNumber };
        // show the update form
        this.#show('form', 'Update account form', { ...this.form });
    }

    // +displayConfirmation(): void
    // BCE method: open the "Are you sure?" Yes/No pop-up
    displayConfirmation() {
        // mark the Yes/No pop-up as open
        this.confirmationOpen = true;
        // open the pop-up with this question
        this.#show('confirm', 'Save changes to this account?');
    }

    // +closeConfirmation(): void
    // BCE method: close the pop-up without changing anything
    closeConfirmation() {
        // mark the Yes/No pop-up as closed
        this.confirmationOpen = false;
        // show the form again with what was typed, saying the changes were not saved
        this.#show('form', 'Changes not saved', { ...this.form });
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
        console.log(`[UpdateUserAccountPage] ${message ?? ''}`, data ?? '');
    }
}

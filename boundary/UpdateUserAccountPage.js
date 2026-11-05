import UpdateUserAccountController from '../control/UpdateUserAccountController.js';
import { isFilled, isEmail, isContactNumberOrBlank, firstError } from './Validator.js';

// <<Boundary>> UpdateUserAccountPage - US3 Update User Account
export default class UpdateUserAccountPage {
    // Stand-in for the editable fields of the update form
    form = { userId: null, fullName: '', email: '', contactNumber: '' };
    confirmationOpen = false;
    output = null;

    // ---- UI events (actor arrows in the sequence diagram; not BCE methods) ----
    // User Admin clicks "Update Account" on a selected account
    clickUpdateAccount(account) { this.displayUpdateForm(account); }
    // User Admin edits details, clicks "Save Changes"
    clickSaveChanges() { this.displayConfirmation(); }
    // User Admin clicks "Yes" in the confirmation pop-up
    clickYes() {
        if (!this.confirmationOpen) return;
        this.confirmationOpen = false;
        const { userId, fullName, email, contactNumber } = this.form;
        const error = firstError([                                       // field validation (boundary)
            [isFilled(fullName), 'Full name is required'],
            [isEmail(email), 'Please enter a valid email address'],
            [isContactNumberOrBlank(contactNumber), 'Contact number must be 8-15 digits'],
        ]);
        if (error) { this.displayError(error); return; }
        const result = new UpdateUserAccountController()
            .updateUserAccount(userId, fullName.trim(), email.trim(), (contactNumber ?? '').trim());
        if (result === true) this.displaySuccess('Changes saved successfully');   // [result == true]
        else this.displayError('Invalid input');                                 // [result == false]
    }
    // User Admin clicks "No" in the confirmation pop-up
    clickNo() { this.closeConfirmation(); }

    // ---- BCE methods ----
    // +displayUpdateForm(account: UserAccount): void
    displayUpdateForm(account) {
        this.form = { userId: account.userId, fullName: account.fullName,
                      email: account.email, contactNumber: account.contactNumber };
        this.#show('form', 'Update account form', { ...this.form });
    }

    // +displayConfirmation(): void
    displayConfirmation() {
        this.confirmationOpen = true;
        this.#show('confirm', 'Save changes to this account?');
    }

    // +closeConfirmation(): void
    closeConfirmation() {
        this.confirmationOpen = false;
        this.#show('form', 'Changes not saved', { ...this.form });
    }

    // +displaySuccess(message: String): void
    displaySuccess(message) { this.#show('success', message); }

    // +displayError(message: String): void
    displayError(message) { this.#show('error', message); }

    #show(type, message, data) {
        this.output = { type, message, data };
        console.log(`[UpdateUserAccountPage] ${message ?? ''}`, data ?? '');
    }
}

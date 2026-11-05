// bring in UpdateCompanyProfileController - this page passes the user's request to it
import UpdateCompanyProfileController from '../control/UpdateCompanyProfileController.js';
// bring in Session - who is logged in and which role they have
import { Session } from './Session.js';
// bring in the shared field-check helpers we need: isFilled, isEmail, isContactNumberOrBlank, firstError
import { isFilled, isEmail, isContactNumberOrBlank, firstError } from './Validator.js';

// <<Boundary>> UpdateCompanyProfilePage - US15 Update Company Profile
// BOUNDARY class: the screen the actor uses. It checks the input, calls the controller and shows the result
export default class UpdateCompanyProfilePage {
    // Stand-in for the editable fields
    form = { companyName: '', registrationNumber: '', companyDescription: '', contactEmail: '', contactNumber: '' };
    // is the Yes/No confirmation pop-up open? starts closed
    confirmationOpen = false;
    // what the screen is currently showing (type + message + data); starts empty
    output = null;

    // ---- UI events (actor arrows in the sequence diagram; not BCE methods) ----
    // Interior Designer clicks "Update Profile" on their company profile
    clickUpdateProfile() {
        // ask the controller for the logged-in designer's company profile
        const profile = new UpdateCompanyProfileController().getCompanyProfile(Session.userId);
        // none found -> show this message and stop
        if (profile == null) { this.displayError('No company profile is available'); return; }
        // show the current details
        this.displayCompanyDetails(profile);
        // open the update form, filled in with them
        this.displayUpdateForm();
    }
    // Interior Designer clicks "Yes" in the confirmation pop-up
    clickYes() {
        // ignore the click if no confirmation pop-up is open
        if (!this.confirmationOpen) return;
        // mark the Yes/No pop-up as closed
        this.confirmationOpen = false;
        // short name for the form values
        const f = this.form;
        const error = firstError([                                     // field validation (boundary)
            // rule: company name must not be blank
            [isFilled(f.companyName), 'Company name is required'],
            // rule: registration number must not be blank
            [isFilled(f.registrationNumber), 'Company registration number is required'],
            // rule: email must look like name@domain.com
            [isEmail(f.contactEmail), 'Please enter a valid company email'],
            // rule: contact number must be filled in and be 8-15 digits
            [isFilled(f.contactNumber) && isContactNumberOrBlank(f.contactNumber), 'Company contact number must be 8-15 digits'],
        ]);
        // a field failed its check -> show that message and stop (the controller is NOT called)
        if (error) { this.displayError(error); return; }
        // all fields OK -> ask the controller to update the profile of the logged-in designer...
        const result = new UpdateCompanyProfileController().updateCompanyProfile(Session.userId,
            // ...with the trimmed name, registration number and description...
            f.companyName.trim(), f.registrationNumber.trim(), (f.companyDescription ?? '').trim(),
            // ...and the trimmed email and contact number
            f.contactEmail.trim(), f.contactNumber.trim());
        if (result === true) this.displaySuccess();                  // == true
        else this.displayError('Unable to save changes');           // == false
    }
    // Interior Designer clicks "No" in the confirmation pop-up (closeConfirmation() in the sequence diagram)
    clickNo() { this.closeConfirmation(); }
    // BCE method: close the pop-up without changing anything
    closeConfirmation() {
        // mark the Yes/No pop-up as closed
        this.confirmationOpen = false;
        // show the form again with what was typed, saying the changes were not saved
        this.#show('form', 'Changes not saved', { ...this.form });
    }

    // ---- BCE methods ----
    // +displayCompanyDetails(companyProfile: CompanyProfile): void   (also fills the form)
    // BCE method displayCompanyDetails() (gets: companyProfile)
    displayCompanyDetails(companyProfile) {
        // take these 5 fields out of the company profile...
        const { companyName, registrationNumber, companyDescription, contactEmail, contactNumber } = companyProfile;
        // ...and put them into the form
        this.form = { companyName, registrationNumber, companyDescription, contactEmail, contactNumber };
        // show the company profile
        this.#show('data', 'Company profile', { ...companyProfile });
    }

    // +displayUpdateForm(): void
    // BCE method: show the update form filled in with the current values
    displayUpdateForm() { this.#show('form', 'Update company profile form', { ...this.form }); }

    // +submitForm(companyName: String, registrationNumber: String, companyDescription: String,
    //             contactEmail: String, contactNumber: String): void
    // "Save Changes": keeps the edited values and asks for confirmation
    submitForm(companyName, registrationNumber, companyDescription, contactEmail, contactNumber) {
        // ...and put them into the form
        this.form = { companyName, registrationNumber, companyDescription, contactEmail, contactNumber };
        // ask "Are you sure?"
        this.displayConfirmation();
    }

    // +displayConfirmation(): void
    // BCE method: open the "Are you sure?" Yes/No pop-up
    displayConfirmation() {
        // mark the Yes/No pop-up as open
        this.confirmationOpen = true;
        // open the pop-up with this question
        this.#show('confirm', 'Save changes to your company profile?');
    }

    // +displaySuccess(): void
    // BCE method: show the success message "Changes saved successfully"
    displaySuccess() { this.#show('success', 'Changes saved successfully'); }

    // +displayError(message: String): void
    // BCE method: show the error message that was passed in (message)
    displayError(message) { this.#show('error', message); }

    // private helper: puts something on the 'screen' (every display... method ends up here)
    #show(type, message, data) {
        // remember what is on screen now, e.g. { type: 'error', message: 'Full name is required' }
        this.output = { type, message, data };
        // also print it to the terminal, tagged with the page name, so we can follow what happened
        console.log(`[UpdateCompanyProfilePage] ${message ?? ''}`, data ?? '');
    }
}

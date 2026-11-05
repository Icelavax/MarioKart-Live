import UpdateCompanyProfileController from '../control/UpdateCompanyProfileController.js';
import { Session } from './Session.js';
import { isFilled, isEmail, isContactNumberOrBlank, firstError } from './Validator.js';

// <<Boundary>> UpdateCompanyProfilePage - US15 Update Company Profile
export default class UpdateCompanyProfilePage {
    // Stand-in for the editable fields
    form = { companyName: '', registrationNumber: '', companyDescription: '', contactEmail: '', contactNumber: '' };
    confirmationOpen = false;
    output = null;

    // ---- UI events (actor arrows in the sequence diagram; not BCE methods) ----
    // Interior Designer clicks "Update Profile" on their company profile
    clickUpdateProfile() {
        const profile = new UpdateCompanyProfileController().getCompanyProfile(Session.userId);
        if (profile == null) { this.displayError('No company profile is available'); return; }
        this.displayCompanyDetails(profile);
        this.displayUpdateForm();
    }
    // Interior Designer clicks "Yes" in the confirmation pop-up
    clickYes() {
        if (!this.confirmationOpen) return;
        this.confirmationOpen = false;
        const f = this.form;
        const error = firstError([                                     // field validation (boundary)
            [isFilled(f.companyName), 'Company name is required'],
            [isFilled(f.registrationNumber), 'Company registration number is required'],
            [isEmail(f.contactEmail), 'Please enter a valid company email'],
            [isFilled(f.contactNumber) && isContactNumberOrBlank(f.contactNumber), 'Company contact number must be 8-15 digits'],
        ]);
        if (error) { this.displayError(error); return; }
        const result = new UpdateCompanyProfileController().updateCompanyProfile(Session.userId,
            f.companyName.trim(), f.registrationNumber.trim(), (f.companyDescription ?? '').trim(),
            f.contactEmail.trim(), f.contactNumber.trim());
        if (result === true) this.displaySuccess();                  // == true
        else this.displayError('Unable to save changes');           // == false
    }
    // Interior Designer clicks "No" in the confirmation pop-up (closeConfirmation() in the sequence diagram)
    clickNo() { this.closeConfirmation(); }
    closeConfirmation() {
        this.confirmationOpen = false;
        this.#show('form', 'Changes not saved', { ...this.form });
    }

    // ---- BCE methods ----
    // +displayCompanyDetails(companyProfile: CompanyProfile): void   (also fills the form)
    displayCompanyDetails(companyProfile) {
        const { companyName, registrationNumber, companyDescription, contactEmail, contactNumber } = companyProfile;
        this.form = { companyName, registrationNumber, companyDescription, contactEmail, contactNumber };
        this.#show('data', 'Company profile', { ...companyProfile });
    }

    // +displayUpdateForm(): void
    displayUpdateForm() { this.#show('form', 'Update company profile form', { ...this.form }); }

    // +submitForm(companyName: String, registrationNumber: String, companyDescription: String,
    //             contactEmail: String, contactNumber: String): void
    // "Save Changes": keeps the edited values and asks for confirmation
    submitForm(companyName, registrationNumber, companyDescription, contactEmail, contactNumber) {
        this.form = { companyName, registrationNumber, companyDescription, contactEmail, contactNumber };
        this.displayConfirmation();
    }

    // +displayConfirmation(): void
    displayConfirmation() {
        this.confirmationOpen = true;
        this.#show('confirm', 'Save changes to your company profile?');
    }

    // +displaySuccess(): void
    displaySuccess() { this.#show('success', 'Changes saved successfully'); }

    // +displayError(message: String): void
    displayError(message) { this.#show('error', message); }

    #show(type, message, data) {
        this.output = { type, message, data };
        console.log(`[UpdateCompanyProfilePage] ${message ?? ''}`, data ?? '');
    }
}

import DeleteCompanyProfileController from '../control/DeleteCompanyProfileController.js';
import { Session } from './Session.js';

// <<Boundary>> DeleteCompanyProfilePage - US16 Delete Company Profile
export default class DeleteCompanyProfilePage {
    confirmationOpen = false;
    output = null;

    // ---- UI events (actor arrows in the sequence diagram; not BCE methods) ----
    // Interior Designer clicks "Delete Company Profile"
    clickDeleteCompanyProfile() { this.displayConfirmation(); }
    // Confirms deletion
    clickYes() {
        if (!this.confirmationOpen) return;
        this.confirmationOpen = false;
        const result = new DeleteCompanyProfileController().deleteCompanyProfile(Session.userId);
        if (result === true) this.displaySuccess();      // == True
        else this.displayError();                        // == False
    }
    // Cancels deletion
    clickNo() { this.cancelDeletion(); }
    cancelDeletion() {
        this.confirmationOpen = false;
        this.displayCompanyProfilePage();
    }

    // ---- BCE methods ----
    // +displayCompanyDetails(companyProfile: CompanyProfile): void
    displayCompanyDetails(companyProfile) { this.#show('data', 'Company profile', { ...companyProfile }); }

    // +displayConfirmation(): void
    displayConfirmation() {
        this.confirmationOpen = true;
        this.#show('confirm', 'Delete your company profile? This cannot be undone.');
    }

    // +displaySuccess(): void
    displaySuccess() { this.#show('success', 'Company profile deleted'); }

    // +displayError(): void
    displayError() { this.#show('error', 'Unable to delete company profile'); }

    // +displayCompanyProfilePage(): void   - back to the profile, nothing deleted
    displayCompanyProfilePage() { this.#show('message', 'Deletion cancelled'); }

    #show(type, message, data) {
        this.output = { type, message, data };
        console.log(`[DeleteCompanyProfilePage] ${message ?? ''}`, data ?? '');
    }
}

// ==========================================================================
// PRESENTATION NOTE
// US16 Delete Company Profile - <<Boundary>> DeleteCompanyProfilePage
//
// What to say: This is the screen for US16. It passes the user's request to
//              DeleteCompanyProfileController.deleteCompanyProfile(), and then shows the result
//              with displaySuccess() or displayError(), following the sequence diagram.
//
// Q: Is it really removed from the database?
// A: The entity removes it from its list after the Yes confirmation, and db.js saves the change
//    to Neon in one transaction (BEGIN/COMMIT).
// ==========================================================================

// bring in DeleteCompanyProfileController - this page passes the user's request to it
import DeleteCompanyProfileController from '../control/DeleteCompanyProfileController.js';
// bring in Session - who is logged in and which role they have
import { Session } from './Session.js';

// <<Boundary>> DeleteCompanyProfilePage - US16 Delete Company Profile
// BOUNDARY class: the screen the actor uses. It checks the input, calls the controller and shows the result
export default class DeleteCompanyProfilePage {
    // is the Yes/No confirmation pop-up open? starts closed
    confirmationOpen = false;
    // what the screen is currently showing (type + message + data); starts empty
    output = null;

    // ---- UI events (actor arrows in the sequence diagram; not BCE methods) ----
    // Interior Designer clicks "Delete Company Profile"
    clickDeleteCompanyProfile() { this.displayConfirmation(); }
    // Confirms deletion
    clickYes() {
        // ignore the click if no confirmation pop-up is open
        if (!this.confirmationOpen) return;
        // mark the Yes/No pop-up as closed
        this.confirmationOpen = false;
        // ask the controller to delete the logged-in designer's company profile
        const result = new DeleteCompanyProfileController().deleteCompanyProfile(Session.userId);
        if (result === true) this.displaySuccess();      // == True
        else this.displayError();                        // == False
    }
    // Cancels deletion
    clickNo() { this.cancelDeletion(); }
    // UI event: the actor does "cancel deletion" on the screen
    cancelDeletion() {
        // mark the Yes/No pop-up as closed
        this.confirmationOpen = false;
        // go back to the company profile page (nothing deleted)
        this.displayCompanyProfilePage();
    }

    // ---- BCE methods ----
    // +displayCompanyDetails(companyProfile: CompanyProfile): void
    // BCE method: show the company profile details (a copy, so the screen cannot change the stored data)
    displayCompanyDetails(companyProfile) { this.#show('data', 'Company profile', { ...companyProfile }); }

    // +displayConfirmation(): void
    // BCE method: open the "Are you sure?" Yes/No pop-up
    displayConfirmation() {
        // mark the Yes/No pop-up as open
        this.confirmationOpen = true;
        // open the pop-up with this question
        this.#show('confirm', 'Delete your company profile? This cannot be undone.');
    }

    // +displaySuccess(): void
    // BCE method: show the success message "Company profile deleted"
    displaySuccess() { this.#show('success', 'Company profile deleted'); }

    // +displayError(): void
    // BCE method: show the error message "Unable to delete company profile"
    displayError() { this.#show('error', 'Unable to delete company profile'); }

    // +displayCompanyProfilePage(): void   - back to the profile, nothing deleted
    // BCE method: show the message message "Deletion cancelled"
    displayCompanyProfilePage() { this.#show('message', 'Deletion cancelled'); }

    // private helper: puts something on the 'screen' (every display... method ends up here)
    #show(type, message, data) {
        // remember what is on screen now, e.g. { type: 'error', message: 'Full name is required' }
        this.output = { type, message, data };
        // also print it to the terminal, tagged with the page name, so we can follow what happened
        console.log(`[DeleteCompanyProfilePage] ${message ?? ''}`, data ?? '');
    }
}

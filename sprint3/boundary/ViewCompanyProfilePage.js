// ==========================================================================
// PRESENTATION NOTE
// US14 View Company Profile - <<Boundary>> ViewCompanyProfilePage
//
// What to say: This is the screen for US14. It passes the user's request to
//              ViewCompanyProfileController.viewCompanyProfile(), and then shows the result with
//              displaySuccess() or displayError(), following the sequence diagram.
//
// Q: What if the record does not exist or was deleted?
// A: The entity returns null and the page shows an error message instead of the details.
// ==========================================================================

// bring in ViewCompanyProfileController - this page passes the user's request to it
import ViewCompanyProfileController from '../control/ViewCompanyProfileController.js';
// bring in Session - who is logged in and which role they have
import { Session } from './Session.js';

// <<Boundary>> ViewCompanyProfilePage - US14 View Company Profile
// BOUNDARY class: the screen the actor uses. It checks the input, calls the controller and shows the result
export default class ViewCompanyProfilePage {
    // what the screen is currently showing (type + message + data); starts empty
    output = null;

    // +clickViewProfile(): void - shows the logged-in designer's own company profile
    // UI event: the actor does "click view profile" on the screen
    clickViewProfile() {
        // ask the controller for the logged-in designer's company profile
        const profile = new ViewCompanyProfileController().viewCompanyProfile(Session.userId);
        if (profile != null) this.displayCompanyDetails(profile);         // [Company profile exists]
        else this.displayMessage('No company profile is available');      // [Company profile does not exist]
    }

    // +displayCompanyDetails(companyProfile: CompanyProfile): void
    // BCE method: show the company profile details (a copy, so the screen cannot change the stored data)
    displayCompanyDetails(companyProfile) { this.#show('data', 'Company profile', { ...companyProfile }); }

    // +displayMessage(message: String): void
    // BCE method: show the error message that was passed in (message)
    displayMessage(message) { this.#show('error', message); }

    // private helper: puts something on the 'screen' (every display... method ends up here)
    #show(type, message, data) {
        // remember what is on screen now, e.g. { type: 'error', message: 'Full name is required' }
        this.output = { type, message, data };
        // also print it to the terminal, tagged with the page name, so we can follow what happened
        console.log(`[ViewCompanyProfilePage] ${message ?? ''}`, data ?? '');
    }
}

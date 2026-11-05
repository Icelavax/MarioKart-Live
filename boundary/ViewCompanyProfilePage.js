import ViewCompanyProfileController from '../control/ViewCompanyProfileController.js';
import { Session } from './Session.js';

// <<Boundary>> ViewCompanyProfilePage - US14 View Company Profile
export default class ViewCompanyProfilePage {
    output = null;

    // +clickViewProfile(): void - shows the logged-in designer's own company profile
    clickViewProfile() {
        const profile = new ViewCompanyProfileController().viewCompanyProfile(Session.userId);
        if (profile != null) this.displayCompanyDetails(profile);         // [Company profile exists]
        else this.displayMessage('No company profile is available');      // [Company profile does not exist]
    }

    // +displayCompanyDetails(companyProfile: CompanyProfile): void
    displayCompanyDetails(companyProfile) { this.#show('data', 'Company profile', { ...companyProfile }); }

    // +displayMessage(message: String): void
    displayMessage(message) { this.#show('error', message); }

    #show(type, message, data) {
        this.output = { type, message, data };
        console.log(`[ViewCompanyProfilePage] ${message ?? ''}`, data ?? '');
    }
}

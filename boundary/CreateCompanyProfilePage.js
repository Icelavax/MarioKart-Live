import CreateCompanyProfileController from '../control/CreateCompanyProfileController.js';
import { Session } from './Session.js';

// <<Boundary>> CreateCompanyProfilePage - US13 Create Company Profile
export default class CreateCompanyProfilePage {
    output = null;

    // +displayCreationForm(): void
    displayCreationForm() { this.#show('form', 'Create company profile form'); }

    // +submitForm(companyName: String, registrationNumber: String, companyDescription: String,
    //             contactEmail: String, contactNumber: String): void
    // The company profile belongs to the logged-in Interior Designer (userId from the session).
    submitForm(companyName, registrationNumber, companyDescription, contactEmail, contactNumber) {
        const result = new CreateCompanyProfileController().createCompanyProfile(
            Session.userId, companyName, registrationNumber, companyDescription, contactEmail, contactNumber);
        if (result === true) this.displaySuccess();
        else this.displayError('Unable to create company profile - check the details, or a profile already exists');
    }

    // +displaySuccess(): void
    displaySuccess() { this.#show('success', 'Company profile created'); }

    // +displayError(message: String): void
    displayError(message) { this.#show('error', message); }

    #show(type, message, data) {
        this.output = { type, message, data };
        console.log(`[CreateCompanyProfilePage] ${message ?? ''}`, data ?? '');
    }
}

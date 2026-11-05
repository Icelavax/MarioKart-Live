import CreateCompanyProfileController from '../control/CreateCompanyProfileController.js';
import { Session } from './Session.js';
import { isFilled, isEmail, firstError } from './Validator.js';

// <<Boundary>> CreateCompanyProfilePage - US13 Create Company Profile
export default class CreateCompanyProfilePage {
    output = null;

    // +displayCreationForm(): void
    displayCreationForm() { this.#show('form', 'Create company profile form'); }

    // +submitForm(companyName: String, registrationNumber: String, companyDescription: String,
    //             contactEmail: String, contactNumber: String): void
    // The company profile belongs to the logged-in Interior Designer (userId from the session).
    submitForm(companyName, registrationNumber, companyDescription, contactEmail, contactNumber) {
        if (Session.userId == null) { this.displayError('Please log in as an Interior Designer'); return; }
        const error = this.validateDetails(companyName, registrationNumber, contactEmail, contactNumber);
        if (error) { this.displayError(error); return; }

        const result = new CreateCompanyProfileController().createCompanyProfile(
            Session.userId, companyName.trim(), registrationNumber.trim(), (companyDescription ?? '').trim(),
            contactEmail.trim(), contactNumber.trim());
        if (result === true) this.displaySuccess();
        else this.displayError('You already have a company profile');
    }

    // +validateDetails(companyName: String, registrationNumber: String, contactEmail: String,
    //                  contactNumber: String): String   (error message, or null when valid)
    // Moved here from CreateCompanyProfileController: field validation belongs to the boundary.
    validateDetails(companyName, registrationNumber, contactEmail, contactNumber) {
        return firstError([
            [isFilled(companyName), 'Company name is required'],
            [isFilled(registrationNumber), 'Company registration number is required'],
            [isEmail(contactEmail), 'Please enter a valid company email'],
            [isFilled(contactNumber), 'Company contact number is required'],
        ]);
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

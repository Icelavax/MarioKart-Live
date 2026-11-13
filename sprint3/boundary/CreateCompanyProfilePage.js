// ==========================================================================
// PRESENTATION NOTE
// US13 Create Company Profile - <<Boundary>> CreateCompanyProfilePage
//
// What to say: This is the screen for US13. It first checks the input with Validator.js (blank
//              fields, formats). Only if the input is valid does it call
//              CreateCompanyProfileController.createCompanyProfile(), and then it shows the
//              result with displaySuccess() or displayError(), following the sequence diagram.
//
// Q: Why is field validation in the boundary and not in the entity?
// A: Bad input is stopped at the screen, so the controller and entity only ever receive clean
//    data. The entity only checks rules that need stored data (e.g. duplicates).
//
// Q: Where is the duplicate check done, and why there?
// A: Field formats (blank, length, email) are checked in the boundary. A duplicate check needs
//    the stored data, so the entity does it and returns false, and the page shows displayError().
// ==========================================================================

// bring in CreateCompanyProfileController - this page passes the user's request to it
import CreateCompanyProfileController from '../control/CreateCompanyProfileController.js';
// bring in Session - who is logged in and which role they have
import { Session } from './Session.js';
// bring in the shared field-check helpers we need: isFilled, isEmail, firstError
import { isFilled, isEmail, firstError } from './Validator.js';

// <<Boundary>> CreateCompanyProfilePage - US13 Create Company Profile
// BOUNDARY class: the screen the actor uses. It checks the input, calls the controller and shows the result
export default class CreateCompanyProfilePage {
    // what the screen is currently showing (type + message + data); starts empty
    output = null;

    // +displayCreationForm(): void
    // BCE method: show the form message "Create company profile form"
    displayCreationForm() { this.#show('form', 'Create company profile form'); }

    // +submitForm(companyName: String, registrationNumber: String, companyDescription: String,
    //             contactEmail: String, contactNumber: String): void
    // The company profile belongs to the logged-in Interior Designer (userId from the session).
    submitForm(companyName, registrationNumber, companyDescription, contactEmail, contactNumber) {
        // nobody is logged in -> show an error and stop
        if (Session.userId == null) { this.displayError('Please log in as an Interior Designer'); return; }
        // BOUNDARY validation: check the form fields first (returns an error message, or null if all OK)
        const error = this.validateDetails(companyName, registrationNumber, contactEmail, contactNumber);
        // a field failed its check -> show that message and stop (the controller is NOT called)
        if (error) { this.displayError(error); return; }

        // all fields OK -> pass the details to the controller...
        const result = new CreateCompanyProfileController().createCompanyProfile(
            // ...with the logged-in designer's ID and the trimmed (no extra spaces) values...
            Session.userId, companyName.trim(), registrationNumber.trim(), (companyDescription ?? '').trim(),
            // ...continued: trimmed email and contact number
            contactEmail.trim(), contactNumber.trim());
        // controller said it worked -> show the success message
        if (result === true) this.displaySuccess();
        // otherwise it failed -> show the error message
        else this.displayError('You already have a company profile');
    }

    // +validateDetails(companyName: String, registrationNumber: String, contactEmail: String,
    //                  contactNumber: String): String   (error message, or null when valid)
    // Moved here from CreateCompanyProfileController: field validation belongs to the boundary.
    validateDetails(companyName, registrationNumber, contactEmail, contactNumber) {
        // return the first rule that fails (or null if every rule passes):
        return firstError([
            // rule: company name must not be blank
            [isFilled(companyName), 'Company name is required'],
            // rule: registration number must not be blank
            [isFilled(registrationNumber), 'Company registration number is required'],
            // rule: email must look like name@domain.com
            [isEmail(contactEmail), 'Please enter a valid company email'],
            // rule: contact number must not be blank
            [isFilled(contactNumber), 'Company contact number is required'],
        ]);
    }

    // +displaySuccess(): void
    // BCE method: show the success message "Company profile created"
    displaySuccess() { this.#show('success', 'Company profile created'); }

    // +displayError(message: String): void
    // BCE method: show the error message that was passed in (message)
    displayError(message) { this.#show('error', message); }

    // private helper: puts something on the 'screen' (every display... method ends up here)
    #show(type, message, data) {
        // remember what is on screen now, e.g. { type: 'error', message: 'Full name is required' }
        this.output = { type, message, data };
        // also print it to the terminal, tagged with the page name, so we can follow what happened
        console.log(`[CreateCompanyProfilePage] ${message ?? ''}`, data ?? '');
    }
}

import CreateUserAccountController from '../control/CreateUserAccountController.js';
import { isFilled, isEmail, isContactNumberOrBlank, isPositiveInteger, firstError,
         MIN_USERNAME, MIN_PASSWORD } from './Validator.js';

// <<Boundary>> CreateUserAccountPage - US1 Create User Account
export default class CreateUserAccountPage {
    output = null;   // what the page is showing (stand-in for the screen)

    // +displayCreationForm(): void
    displayCreationForm() { this.#show('form', 'Create user account form'); }

    // +submitForm(username: String, email: String, password: String,
    //             fullName: String, contactNumber: String, profileId: Integer): void
    // Field validation is done here (boundary); the entity only checks for duplicates.
    submitForm(username, email, password, fullName, contactNumber, profileId) {
        const error = firstError([
            [isFilled(username) && username.trim().length >= MIN_USERNAME, `Username must be at least ${MIN_USERNAME} characters`],
            [isEmail(email), 'Please enter a valid email address'],
            [typeof password === 'string' && password.length >= MIN_PASSWORD, `Password must be at least ${MIN_PASSWORD} characters`],
            [isFilled(fullName), 'Full name is required'],
            [isContactNumberOrBlank(contactNumber), 'Contact number must be 8-15 digits'],
            [isPositiveInteger(profileId), 'Please select a user profile'],
        ]);
        if (error) { this.displayError(error); return; }

        const result = new CreateUserAccountController().createUserAccount(
            username.trim(), email.trim(), password, fullName.trim(), (contactNumber ?? '').trim(), profileId);
        if (result === true) this.displaySuccess('Account created');
        else this.displayError('Username or email is already registered');
    }

    // +displaySuccess(message: String): void
    displaySuccess(message) { this.#show('success', message); }

    // +displayError(message: String): void
    displayError(message) { this.#show('error', message); }

    #show(type, message, data) {
        this.output = { type, message, data };
        console.log(`[CreateUserAccountPage] ${message ?? ''}`, data ?? '');
    }
}

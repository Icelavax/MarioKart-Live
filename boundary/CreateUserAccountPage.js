import CreateUserAccountController from '../control/CreateUserAccountController.js';

// <<Boundary>> CreateUserAccountPage - US1 Create User Account
export default class CreateUserAccountPage {
    output = null;   // what the page is showing (stand-in for the screen)

    // +displayCreationForm(): void
    displayCreationForm() { this.#show('form', 'Create user account form'); }

    // +submitForm(username: String, email: String, password: String,
    //             fullName: String, contactNumber: String, profileId: Integer): void
    submitForm(username, email, password, fullName, contactNumber, profileId) {
        const result = new CreateUserAccountController()
            .createUserAccount(username, email, password, fullName, contactNumber, profileId);
        if (result === true) this.displaySuccess('Account created');
        else this.displayError('Invalid or duplicate details');
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

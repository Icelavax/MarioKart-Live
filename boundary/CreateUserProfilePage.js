import CreateUserProfileController from '../control/CreateUserProfileController.js';

// <<Boundary>> CreateUserProfilePage - US6 Create User Profile
export default class CreateUserProfilePage {
    output = null;

    // +displayCreationForm(): void
    displayCreationForm() { this.#show('form', 'Create user profile form'); }

    // +submitForm(profileName: String, description: String): void
    submitForm(profileName, description) {
        const result = new CreateUserProfileController().createUserProfile(profileName, description);
        if (result === true) this.displaySuccess('Profile created');
        else this.displayError('Invalid or duplicate profile name');
    }

    // +displaySuccess(message: String): void
    displaySuccess(message) { this.#show('success', message); }

    // +displayError(message: String): void
    displayError(message) { this.#show('error', message); }

    #show(type, message, data) {
        this.output = { type, message, data };
        console.log(`[CreateUserProfilePage] ${message ?? ''}`, data ?? '');
    }
}

import DeleteUserProfileController from '../control/DeleteUserProfileController.js';

// <<Boundary>> DeleteUserProfilePage - US9 Delete User Profile
export default class DeleteUserProfilePage {
    profileId = null;        // the selected profile
    confirmationOpen = false;
    output = null;

    // ---- UI events (actor arrows in the sequence diagram; not BCE methods) ----
    // User Admin clicks "Delete User Profile" on the selected profile
    clickDeleteUserProfile(profileId) {
        this.profileId = profileId;
        this.displayConfirmation();
    }
    // User Admin clicks "Yes" in the confirmation pop-up
    clickYes() {
        if (!this.confirmationOpen) return;
        this.confirmationOpen = false;
        const result = new DeleteUserProfileController().deleteUserProfile(this.profileId);
        if (result === true) this.displaySuccess('User Profile Deleted');                   // [result == true]
        else this.displayError('Profile is still assigned to user accounts');               // [result == false]
    }
    // User Admin clicks "No" in the confirmation pop-up
    clickNo() { this.closeConfirmation(); }

    // ---- BCE methods ----
    // +displayConfirmation(): void
    displayConfirmation() {
        this.confirmationOpen = true;
        this.#show('confirm', 'Delete this user profile?');
    }

    // +closeConfirmation(): void
    closeConfirmation() {
        this.confirmationOpen = false;
        this.#show('message', 'Deletion cancelled');
    }

    // +displaySuccess(message: String): void
    displaySuccess(message) { this.#show('success', message); }

    // +displayError(message: String): void
    displayError(message) { this.#show('error', message); }

    #show(type, message, data) {
        this.output = { type, message, data };
        console.log(`[DeleteUserProfilePage] ${message ?? ''}`, data ?? '');
    }
}

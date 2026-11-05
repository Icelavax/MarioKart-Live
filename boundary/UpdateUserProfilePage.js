import UpdateUserProfileController from '../control/UpdateUserProfileController.js';
import { isFilled } from './Validator.js';

// <<Boundary>> UpdateUserProfilePage - US8 Update User Profile
export default class UpdateUserProfilePage {
    // Stand-in for the editable fields of the update form
    form = { profileId: null, profileName: '', description: '' };
    confirmationOpen = false;
    output = null;

    // ---- UI events (actor arrows in the sequence diagram; not BCE methods) ----
    // User Admin clicks "Update Profile" on the profile being viewed
    clickUpdateProfile(profile) { this.displayUpdateForm(profile); }
    // User Admin edits details, clicks "Save Changes"
    clickSaveChanges() { this.displayConfirmation(); }
    // User Admin clicks "Yes" in the confirmation pop-up
    clickYes() {
        if (!this.confirmationOpen) return;
        this.confirmationOpen = false;
        const { profileId, profileName, description } = this.form;
        if (!isFilled(profileName)) { this.displayError('Profile name is required'); return; }   // boundary
        const result = new UpdateUserProfileController()
            .updateUserProfile(profileId, profileName.trim(), (description ?? '').trim());
        if (result === true) this.displaySuccess('User Profile Updated Successfully');   // [result == true]
        else this.displayError('Invalid input');                                         // [result == false]
    }
    // User Admin clicks "No" in the confirmation pop-up
    clickNo() { this.closeConfirmation(); }

    // ---- BCE methods ----
    // +displayUpdateForm(profile: UserProfile): void
    displayUpdateForm(profile) {
        this.form = { profileId: profile.profileId, profileName: profile.profileName,
                      description: profile.description };
        this.#show('form', 'Update profile form', { ...this.form });
    }

    // +displayConfirmation(): void
    displayConfirmation() {
        this.confirmationOpen = true;
        this.#show('confirm', 'Save changes to this profile?');
    }

    // +closeConfirmation(): void
    closeConfirmation() {
        this.confirmationOpen = false;
        this.#show('form', 'Changes not saved', { ...this.form });
    }

    // +displaySuccess(message: String): void
    displaySuccess(message) { this.#show('success', message); }

    // +displayError(message: String): void
    displayError(message) { this.#show('error', message); }

    #show(type, message, data) {
        this.output = { type, message, data };
        console.log(`[UpdateUserProfilePage] ${message ?? ''}`, data ?? '');
    }
}

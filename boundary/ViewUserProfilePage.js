import ViewUserProfileController from '../control/ViewUserProfileController.js';

// <<Boundary>> ViewUserProfilePage - US7 View User Profile
export default class ViewUserProfilePage {
    output = null;

    // +selectProfile(profileId: Integer): void
    selectProfile(profileId) {
        const profile = new ViewUserProfileController().viewUserProfile(profileId);
        if (profile != null) this.displayProfileDetails(profile);   // [profile found]
        else this.displayError('Profile not found');                 // [profile not found]
    }

    // +displayProfileDetails(profile: UserProfile): void
    displayProfileDetails(profile) { this.#show('data', 'Profile details', { ...profile }); }

    // +displayError(message: String): void
    displayError(message) { this.#show('error', message); }

    #show(type, message, data) {
        this.output = { type, message, data };
        console.log(`[ViewUserProfilePage] ${message ?? ''}`, data ?? '');
    }
}

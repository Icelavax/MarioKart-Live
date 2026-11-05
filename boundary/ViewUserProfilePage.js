// bring in ViewUserProfileController - this page passes the user's request to it
import ViewUserProfileController from '../control/ViewUserProfileController.js';

// <<Boundary>> ViewUserProfilePage - US7 View User Profile
// BOUNDARY class: the screen the actor uses. It checks the input, calls the controller and shows the result
export default class ViewUserProfilePage {
    // what the screen is currently showing (type + message + data); starts empty
    output = null;

    // +selectProfile(profileId: Integer): void
    // UI event: the actor does "select profile" on the screen (gets: profileId)
    selectProfile(profileId) {
        // ask the controller for the profile with this ID
        const profile = new ViewUserProfileController().viewUserProfile(profileId);
        if (profile != null) this.displayProfileDetails(profile);   // [profile found]
        else this.displayError('Profile not found');                 // [profile not found]
    }

    // +displayProfileDetails(profile: UserProfile): void
    // BCE method: show the profile details (a copy)
    displayProfileDetails(profile) { this.#show('data', 'Profile details', { ...profile }); }

    // +displayError(message: String): void
    // BCE method: show the error message that was passed in (message)
    displayError(message) { this.#show('error', message); }

    // private helper: puts something on the 'screen' (every display... method ends up here)
    #show(type, message, data) {
        // remember what is on screen now, e.g. { type: 'error', message: 'Full name is required' }
        this.output = { type, message, data };
        // also print it to the terminal, tagged with the page name, so we can follow what happened
        console.log(`[ViewUserProfilePage] ${message ?? ''}`, data ?? '');
    }
}

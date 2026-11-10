// bring in UpdateUserProfileController - this page passes the user's request to it
import UpdateUserProfileController from '../control/UpdateUserProfileController.js';
// bring in the shared field-check helpers we need: isFilled
import { isFilled } from './Validator.js';

// <<Boundary>> UpdateUserProfilePage - US8 Update User Profile
// BOUNDARY class: the screen the actor uses. It checks the input, calls the controller and shows the result
export default class UpdateUserProfilePage {
    // Stand-in for the editable fields of the update form
    form = { profileId: null, profileName: '', description: '' };
    // is the Yes/No confirmation pop-up open? starts closed
    confirmationOpen = false;
    // what the screen is currently showing (type + message + data); starts empty
    output = null;

    // ---- UI events (actor arrows in the sequence diagram; not BCE methods) ----
    // User Admin clicks "Update Profile" on the profile being viewed
    clickUpdateProfile(profile) { this.displayUpdateForm(profile); }
    // User Admin edits details, clicks "Save Changes"
    clickSaveChanges() { this.displayConfirmation(); }
    // User Admin clicks "Yes" in the confirmation pop-up
    clickYes() {
        // ignore the click if no confirmation pop-up is open
        if (!this.confirmationOpen) return;
        // mark the Yes/No pop-up as closed
        this.confirmationOpen = false;
        // take the 3 values out of the form
        const { profileId, profileName, description } = this.form;
        if (!isFilled(profileName)) { this.displayError('Profile name is required'); return; }   // boundary
        // ask the controller to update the profile...
        const result = new UpdateUserProfileController()
            // ...with the trimmed name and description
            .updateUserProfile(profileId, profileName.trim(), (description ?? '').trim());
        if (result === true) this.displaySuccess('User Profile Updated Successfully');   // [result == true]
        else this.displayError('Invalid input');                                         // [result == false]
    }
    // User Admin clicks "No" in the confirmation pop-up
    clickNo() { this.closeConfirmation(); }

    // ---- BCE methods ----
    // +displayUpdateForm(profile: UserProfile): void
    // BCE method displayUpdateForm() (gets: profile)
    displayUpdateForm(profile) {
        // fill the form with the profile's current values...
        this.form = { profileId: profile.profileId, profileName: profile.profileName,
                      // ...and its description
                      description: profile.description };
        // show the update form
        this.#show('form', 'Update profile form', { ...this.form });
    }

    // +displayConfirmation(): void
    // BCE method: open the "Are you sure?" Yes/No pop-up
    displayConfirmation() {
        // mark the Yes/No pop-up as open
        this.confirmationOpen = true;
        // open the pop-up with this question
        this.#show('confirm', 'Save changes to this profile?');
    }

    // +closeConfirmation(): void
    // BCE method: close the pop-up without changing anything
    closeConfirmation() {
        // mark the Yes/No pop-up as closed
        this.confirmationOpen = false;
        // show the form again with what was typed, saying the changes were not saved
        this.#show('form', 'Changes not saved', { ...this.form });
    }

    // +displaySuccess(message: String): void
    // BCE method: show the success message that was passed in (message)
    displaySuccess(message) { this.#show('success', message); }

    // +displayError(message: String): void
    // BCE method: show the error message that was passed in (message)
    displayError(message) { this.#show('error', message); }

    // private helper: puts something on the 'screen' (every display... method ends up here)
    #show(type, message, data) {
        // remember what is on screen now, e.g. { type: 'error', message: 'Full name is required' }
        this.output = { type, message, data };
        // also print it to the terminal, tagged with the page name, so we can follow what happened
        console.log(`[UpdateUserProfilePage] ${message ?? ''}`, data ?? '');
    }
}

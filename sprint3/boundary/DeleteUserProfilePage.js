// ==========================================================================
// PRESENTATION NOTE
// US9 Delete User Profile - <<Boundary>> DeleteUserProfilePage
//
// What to say: This is the screen for US9. It passes the user's request to
//              DeleteUserProfileController.deleteUserProfile(), and then shows the result with
//              displaySuccess() or displayError(), following the sequence diagram.
//
// Q: Is it really removed from the database?
// A: The entity removes it from its list after the Yes confirmation, and db.js saves the change
//    to Neon in one transaction (BEGIN/COMMIT).
// ==========================================================================

// bring in DeleteUserProfileController - this page passes the user's request to it
import DeleteUserProfileController from '../control/DeleteUserProfileController.js';

// <<Boundary>> DeleteUserProfilePage - US9 Delete User Profile
// BOUNDARY class: the screen the actor uses. It checks the input, calls the controller and shows the result
export default class DeleteUserProfilePage {
    profileId = null;        // the selected profile
    // is the Yes/No confirmation pop-up open? starts closed
    confirmationOpen = false;
    // what the screen is currently showing (type + message + data); starts empty
    output = null;

    // ---- UI events (actor arrows in the sequence diagram; not BCE methods) ----
    // User Admin clicks "Delete User Profile" on the selected profile
    clickDeleteUserProfile(profileId) {
        // remember which profile was picked
        this.profileId = profileId;
        // ask "Are you sure?"
        this.displayConfirmation();
    }
    // User Admin clicks "Yes" in the confirmation pop-up
    clickYes() {
        // ignore the click if no confirmation pop-up is open
        if (!this.confirmationOpen) return;
        // mark the Yes/No pop-up as closed
        this.confirmationOpen = false;
        // ask the controller to delete the profile (fails if accounts still use it)
        const result = new DeleteUserProfileController().deleteUserProfile(this.profileId);
        if (result === true) this.displaySuccess('User Profile Deleted');                   // [result == true]
        else this.displayError('Profile is still assigned to user accounts');               // [result == false]
    }
    // User Admin clicks "No" in the confirmation pop-up
    clickNo() { this.closeConfirmation(); }

    // ---- BCE methods ----
    // +displayConfirmation(): void
    // BCE method: open the "Are you sure?" Yes/No pop-up
    displayConfirmation() {
        // mark the Yes/No pop-up as open
        this.confirmationOpen = true;
        // open the pop-up with this question
        this.#show('confirm', 'Delete this user profile?');
    }

    // +closeConfirmation(): void
    // BCE method: close the pop-up without changing anything
    closeConfirmation() {
        // mark the Yes/No pop-up as closed
        this.confirmationOpen = false;
        // show that nothing was deleted
        this.#show('message', 'Deletion cancelled');
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
        console.log(`[DeleteUserProfilePage] ${message ?? ''}`, data ?? '');
    }
}

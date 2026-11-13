// ==========================================================================
// PRESENTATION NOTE
// US9 Delete User Profile - <<Control>> DeleteUserProfileController
//
// What to say: The controller has one job: it takes the request from the boundary page and passes
//              it to UserAccount.findByProfileId(), UserProfile.deleteUserProfile(), then hands
//              the answer back. It has no screen and holds no data.
//
// Q: Why have a controller if it only passes the call on?
// A: It keeps the screen and the data apart: the boundary never touches the entity directly. If
//    the business logic changes, only the controller and entity change, not the UI. That is the
//    BCE rule.
// ==========================================================================

// bring in the UserAccount entity class (it holds and checks the user account data)
import UserAccount from '../entity/UserAccount.js';
// bring in the UserProfile entity class (it holds and checks the user profile data)
import UserProfile from '../entity/UserProfile.js';

// <<Control>> DeleteUserProfileController - US9 Delete User Profile
// CONTROL class: takes the request from the page and passes it to the entity (no screen, no data of its own)
export default class DeleteUserProfileController {
    // +deleteUserProfile(profileId: Integer): Boolean
    // A profile can only be deleted when no user account is assigned to it.
    deleteUserProfile(profileId) {
        // get every account that still uses this profile
        const accounts = new UserAccount().findByProfileId(profileId);
        // start by assuming the delete did not happen
        let result = false;
        if (accounts.length === 0) {                       // opt [accounts is empty]
            // ask the UserProfile entity to delete the profile (true if it worked)
            result = new UserProfile().deleteUserProfile(profileId);
        }
        // send true / false back to the page
        return result;
    }
}

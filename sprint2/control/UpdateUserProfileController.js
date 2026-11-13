// ==========================================================================
// PRESENTATION NOTE
// US8 Update User Profile - <<Control>> UpdateUserProfileController
//
// What to say: The controller has one job: it takes the request from the boundary page and passes
//              it to UserProfile.updateUserProfile(), then hands the answer back. It has no
//              screen and holds no data.
//
// Q: Why have a controller if it only passes the call on?
// A: It keeps the screen and the data apart: the boundary never touches the entity directly. If
//    the business logic changes, only the controller and entity change, not the UI. That is the
//    BCE rule.
// ==========================================================================

// bring in the UserProfile entity class (it holds and checks the user profile data)
import UserProfile from '../entity/UserProfile.js';

// <<Control>> UpdateUserProfileController - US8 Update User Profile
// CONTROL class: takes the request from the page and passes it to the entity (no screen, no data of its own)
export default class UpdateUserProfileController {
    // +updateUserProfile(profileId: Integer, profileName: String, description: String): Boolean
    // BCE method updateUserProfile() (gets: profileId, profileName, description): called by the page
    updateUserProfile(profileId, profileName, description) {
        // create a UserProfile entity and ask it to update user profile with profileId, profileName, description; hand its answer back to the page
        return new UserProfile().updateUserProfile(profileId, profileName, description);
    }
}

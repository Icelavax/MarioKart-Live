// ==========================================================================
// PRESENTATION NOTE
// US7 View User Profile - <<Control>> ViewUserProfileController
//
// What to say: The controller has one job: it takes the request from the boundary page and passes
//              it to UserProfile.viewUserProfile(), then hands the answer back. It has no screen
//              and holds no data.
//
// Q: Why have a controller if it only passes the call on?
// A: It keeps the screen and the data apart: the boundary never touches the entity directly. If
//    the business logic changes, only the controller and entity change, not the UI. That is the
//    BCE rule.
// ==========================================================================

// bring in the UserProfile entity class (it holds and checks the user profile data)
import UserProfile from '../entity/UserProfile.js';

// <<Control>> ViewUserProfileController - US7 View User Profile
// CONTROL class: takes the request from the page and passes it to the entity (no screen, no data of its own)
export default class ViewUserProfileController {
    // +viewUserProfile(profileId: Integer): UserProfile
    // BCE method viewUserProfile() (gets: profileId): called by the page
    viewUserProfile(profileId) {
        // create a UserProfile entity and ask it to view user profile with profileId; hand its answer back to the page
        return new UserProfile().viewUserProfile(profileId);
    }
}

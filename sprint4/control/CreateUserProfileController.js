// bring in the UserProfile entity class (it holds and checks the user profile data)
import UserProfile from '../entity/UserProfile.js';

// <<Control>> CreateUserProfileController - US6 Create User Profile
// CONTROL class: takes the request from the page and passes it to the entity (no screen, no data of its own)
export default class CreateUserProfileController {
    // +createUserProfile(profileName: String, description: String): Boolean
    // BCE method createUserProfile() (gets: profileName, description): called by the page
    createUserProfile(profileName, description) {
        // create a UserProfile entity and ask it to create user profile with profileName, description; hand its answer back to the page
        return new UserProfile().createUserProfile(profileName, description);
    }
}

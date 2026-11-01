import UserProfile from '../entity/UserProfile.js';

// <<Control>> CreateUserProfileController - US6 Create User Profile
export default class CreateUserProfileController {
    // +createUserProfile(profileName: String, description: String): Boolean
    createUserProfile(profileName, description) {
        return new UserProfile().createUserProfile(profileName, description);
    }
}

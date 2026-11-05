import UserProfile from '../entity/UserProfile.js';

// <<Control>> UpdateUserProfileController - US8 Update User Profile
export default class UpdateUserProfileController {
    // +updateUserProfile(profileId: Integer, profileName: String, description: String): Boolean
    updateUserProfile(profileId, profileName, description) {
        return new UserProfile().updateUserProfile(profileId, profileName, description);
    }
}

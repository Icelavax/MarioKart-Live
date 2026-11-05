import UserProfile from '../entity/UserProfile.js';

// <<Control>> ViewUserProfileController - US7 View User Profile
export default class ViewUserProfileController {
    // +viewUserProfile(profileId: Integer): UserProfile
    viewUserProfile(profileId) {
        return new UserProfile().viewUserProfile(profileId);
    }
}

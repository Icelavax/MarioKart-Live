import UserProfile from '../entity/UserProfile.js';

// <<Control>> SearchUserProfileController - US10 Search User Profile
export default class SearchUserProfileController {
    // +searchUserProfile(keyword: String): List<UserProfile>
    searchUserProfile(keyword) {
        return new UserProfile().searchUserProfile(keyword);
    }
}

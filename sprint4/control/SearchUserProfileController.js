// bring in the UserProfile entity class (it holds and checks the user profile data)
import UserProfile from '../entity/UserProfile.js';

// <<Control>> SearchUserProfileController - US10 Search User Profile
// CONTROL class: takes the request from the page and passes it to the entity (no screen, no data of its own)
export default class SearchUserProfileController {
    // +searchUserProfile(keyword: String): List<UserProfile>
    // BCE method searchUserProfile() (gets: keyword): called by the page
    searchUserProfile(keyword) {
        // create a UserProfile entity and ask it to search user profile with keyword; hand its answer back to the page
        return new UserProfile().searchUserProfile(keyword);
    }
}

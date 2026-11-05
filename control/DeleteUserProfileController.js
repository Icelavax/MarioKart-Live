import UserAccount from '../entity/UserAccount.js';
import UserProfile from '../entity/UserProfile.js';

// <<Control>> DeleteUserProfileController - US9 Delete User Profile
export default class DeleteUserProfileController {
    // +deleteUserProfile(profileId: Integer): Boolean
    // A profile can only be deleted when no user account is assigned to it.
    deleteUserProfile(profileId) {
        const accounts = new UserAccount().findByProfileId(profileId);
        let result = false;
        if (accounts.length === 0) {                       // opt [accounts is empty]
            result = new UserProfile().deleteUserProfile(profileId);
        }
        return result;
    }
}

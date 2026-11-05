import UserAccount from '../entity/UserAccount.js';

// <<Control>> UpdateUserAccountController - US3 Update User Account
export default class UpdateUserAccountController {
    // +updateUserAccount(userId: Integer, fullName: String, email: String, contactNumber: String): Boolean
    updateUserAccount(userId, fullName, email, contactNumber) {
        return new UserAccount().updateUserAccount(userId, fullName, email, contactNumber);
    }
}

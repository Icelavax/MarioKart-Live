import UserAccount from '../entity/UserAccount.js';

// <<Control>> CreateUserAccountController - US1 Create User Account
export default class CreateUserAccountController {
    // +createUserAccount(username: String, email: String, password: String, fullName: String, contactNumber: String, profileId: Integer): Boolean
    createUserAccount(username, email, password, fullName, contactNumber, profileId) {
        return new UserAccount().createUserAccount(username, email, password, fullName, contactNumber, profileId);
    }
}

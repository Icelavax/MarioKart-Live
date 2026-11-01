import UserAccount from '../entity/UserAccount.js';

// <<Control>> UserAdminLoginController - US11 User Admin Login
export default class UserAdminLoginController {
    // +login(username: String, password: String, userProfile: Integer): UserAccount
    login(username, password, userProfile) {
        return new UserAccount().login(username, password, userProfile);
    }
}

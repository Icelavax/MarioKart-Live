import UserAccount from '../entity/UserAccount.js';

// <<Control>> PlatformManagerLoginController - US47 Platform Manager Login
export default class PlatformManagerLoginController {
    // +login(username: String, password: String, userProfile: Integer): UserAccount
    login(username, password, userProfile) {
        return new UserAccount().login(username, password, userProfile);
    }
}

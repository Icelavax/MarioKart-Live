import UserAccount from '../entity/UserAccount.js';

// <<Control>> CustomerLoginController - US35 Customer Login
export default class CustomerLoginController {
    // +login(username: String, password: String, userProfile: Integer): UserAccount
    login(username, password, userProfile) {
        return new UserAccount().login(username, password, userProfile);
    }
}

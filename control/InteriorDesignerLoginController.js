import UserAccount from '../entity/UserAccount.js';

// <<Control>> InteriorDesignerLoginController - US18 Interior Designer Login
export default class InteriorDesignerLoginController {
    // +login(username: String, password: String, userProfile: Integer): UserAccount
    login(username, password, userProfile) {
        return new UserAccount().login(username, password, userProfile);
    }
}

import UserAccount from '../entity/UserAccount.js';

// <<Control>> ViewUserAccountController - US2 View User Account
export default class ViewUserAccountController {
    // +viewUserAccount(userId: Integer): UserAccount
    viewUserAccount(userId) {
        return new UserAccount().viewUserAccount(userId);
    }
}

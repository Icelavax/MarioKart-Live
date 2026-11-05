import UserAccount from '../entity/UserAccount.js';

// <<Control>> SuspendUserAccountController - US4 Suspend User Account
export default class SuspendUserAccountController {
    // +suspendUserAccount(userId: Integer): Boolean
    suspendUserAccount(userId) {
        return new UserAccount().suspendUserAccount(userId);
    }
}

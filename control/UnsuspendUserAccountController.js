import UserAccount from '../entity/UserAccount.js';

// <<Control>> UnsuspendUserAccountController - Unsuspend User Account (extra, pairs with US4)
export default class UnsuspendUserAccountController {
    // +unsuspendUserAccount(userId: Integer): Boolean
    unsuspendUserAccount(userId) {
        return new UserAccount().unsuspendUserAccount(userId);
    }
}

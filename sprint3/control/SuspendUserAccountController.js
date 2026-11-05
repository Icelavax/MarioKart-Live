// bring in the UserAccount entity class (it holds and checks the user account data)
import UserAccount from '../entity/UserAccount.js';

// <<Control>> SuspendUserAccountController - US4 Suspend User Account
// CONTROL class: takes the request from the page and passes it to the entity (no screen, no data of its own)
export default class SuspendUserAccountController {
    // +suspendUserAccount(userId: Integer): Boolean
    // BCE method suspendUserAccount() (gets: userId): called by the page
    suspendUserAccount(userId) {
        // create a UserAccount entity and ask it to suspend user account with userId; hand its answer back to the page
        return new UserAccount().suspendUserAccount(userId);
    }
}

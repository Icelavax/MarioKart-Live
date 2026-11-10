// bring in the UserAccount entity class (it holds and checks the user account data)
import UserAccount from '../entity/UserAccount.js';

// <<Control>> UnsuspendUserAccountController - Unsuspend User Account (extra, pairs with US4)
// CONTROL class: takes the request from the page and passes it to the entity (no screen, no data of its own)
export default class UnsuspendUserAccountController {
    // +unsuspendUserAccount(userId: Integer): Boolean
    // BCE method unsuspendUserAccount() (gets: userId): called by the page
    unsuspendUserAccount(userId) {
        // create a UserAccount entity and ask it to unsuspend user account with userId; hand its answer back to the page
        return new UserAccount().unsuspendUserAccount(userId);
    }
}

// ==========================================================================
// PRESENTATION NOTE
// Extra (pairs with US4) Unsuspend User Account - <<Control>> UnsuspendUserAccountController
//
// What to say: The controller has one job: it takes the request from the boundary page and passes
//              it to UserAccount.unsuspendUserAccount(), then hands the answer back. It has no
//              screen and holds no data.
//
// Q: Why have a controller if it only passes the call on?
// A: It keeps the screen and the data apart: the boundary never touches the entity directly. If
//    the business logic changes, only the controller and entity change, not the UI. That is the
//    BCE rule.
// ==========================================================================

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

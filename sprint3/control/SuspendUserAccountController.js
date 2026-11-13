// ==========================================================================
// PRESENTATION NOTE
// US4 Suspend User Account - <<Control>> SuspendUserAccountController
//
// What to say: The controller has one job: it takes the request from the boundary page and passes
//              it to UserAccount.suspendUserAccount(), then hands the answer back. It has no
//              screen and holds no data.
//
// Q: Why have a controller if it only passes the call on?
// A: It keeps the screen and the data apart: the boundary never touches the entity directly. If
//    the business logic changes, only the controller and entity change, not the UI. That is the
//    BCE rule.
// ==========================================================================

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

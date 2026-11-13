// ==========================================================================
// PRESENTATION NOTE
// US2 View User Account - <<Control>> ViewUserAccountController
//
// What to say: The controller has one job: it takes the request from the boundary page and passes
//              it to UserAccount.viewUserAccount(), then hands the answer back. It has no screen
//              and holds no data.
//
// Q: Why have a controller if it only passes the call on?
// A: It keeps the screen and the data apart: the boundary never touches the entity directly. If
//    the business logic changes, only the controller and entity change, not the UI. That is the
//    BCE rule.
// ==========================================================================

// bring in the UserAccount entity class (it holds and checks the user account data)
import UserAccount from '../entity/UserAccount.js';

// <<Control>> ViewUserAccountController - US2 View User Account
// CONTROL class: takes the request from the page and passes it to the entity (no screen, no data of its own)
export default class ViewUserAccountController {
    // +viewUserAccount(userId: Integer): UserAccount
    // BCE method viewUserAccount() (gets: userId): called by the page
    viewUserAccount(userId) {
        // create a UserAccount entity and ask it to view user account with userId; hand its answer back to the page
        return new UserAccount().viewUserAccount(userId);
    }
}

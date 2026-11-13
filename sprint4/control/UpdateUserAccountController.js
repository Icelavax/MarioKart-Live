// ==========================================================================
// PRESENTATION NOTE
// US3 Update User Account - <<Control>> UpdateUserAccountController
//
// What to say: The controller has one job: it takes the request from the boundary page and passes
//              it to UserAccount.updateUserAccount(), then hands the answer back. It has no
//              screen and holds no data.
//
// Q: Why have a controller if it only passes the call on?
// A: It keeps the screen and the data apart: the boundary never touches the entity directly. If
//    the business logic changes, only the controller and entity change, not the UI. That is the
//    BCE rule.
// ==========================================================================

// bring in the UserAccount entity class (it holds and checks the user account data)
import UserAccount from '../entity/UserAccount.js';

// <<Control>> UpdateUserAccountController - US3 Update User Account
// CONTROL class: takes the request from the page and passes it to the entity (no screen, no data of its own)
export default class UpdateUserAccountController {
    // +updateUserAccount(userId: Integer, fullName: String, email: String, contactNumber: String): Boolean
    // BCE method updateUserAccount() (gets: userId, fullName, email, contactNumber): called by the page
    updateUserAccount(userId, fullName, email, contactNumber) {
        // create a UserAccount entity and ask it to update user account with userId, fullName, email, contactNumber; hand its answer back to the page
        return new UserAccount().updateUserAccount(userId, fullName, email, contactNumber);
    }
}

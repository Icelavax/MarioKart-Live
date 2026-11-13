// ==========================================================================
// PRESENTATION NOTE
// US1 Create User Account - <<Control>> CreateUserAccountController
//
// What to say: The controller has one job: it takes the request from the boundary page and passes
//              it to UserAccount.createUserAccount(), then hands the answer back. It has no
//              screen and holds no data.
//
// Q: Why have a controller if it only passes the call on?
// A: It keeps the screen and the data apart: the boundary never touches the entity directly. If
//    the business logic changes, only the controller and entity change, not the UI. That is the
//    BCE rule.
// ==========================================================================

// bring in the UserAccount entity class (it holds and checks the user account data)
import UserAccount from '../entity/UserAccount.js';

// <<Control>> CreateUserAccountController - US1 Create User Account
// CONTROL class: takes the request from the page and passes it to the entity (no screen, no data of its own)
export default class CreateUserAccountController {
    // +createUserAccount(username: String, email: String, password: String, fullName: String, contactNumber: String, profileId: Integer): Boolean
    // BCE method createUserAccount() (gets: username, email, password, fullName, contactNumber, profileId): called by the page
    createUserAccount(username, email, password, fullName, contactNumber, profileId) {
        // create a UserAccount entity and ask it to create user account with username, email, password, fullName, contactNumber, profileId; hand its answer back to the page
        return new UserAccount().createUserAccount(username, email, password, fullName, contactNumber, profileId);
    }
}

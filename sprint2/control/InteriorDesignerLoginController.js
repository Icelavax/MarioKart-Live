// ==========================================================================
// PRESENTATION NOTE
// US18 Interior Designer Login - <<Control>> InteriorDesignerLoginController
//
// What to say: The controller has one job: it takes the request from the boundary page and passes
//              it to UserAccount.login(), then hands the answer back. It has no screen and holds
//              no data.
//
// Q: Why have a controller if it only passes the call on?
// A: It keeps the screen and the data apart: the boundary never touches the entity directly. If
//    the business logic changes, only the controller and entity change, not the UI. That is the
//    BCE rule.
// ==========================================================================

// bring in the UserAccount entity class (it holds and checks the user account data)
import UserAccount from '../entity/UserAccount.js';

// <<Control>> InteriorDesignerLoginController - US18 Interior Designer Login
// CONTROL class: takes the request from the page and passes it to the entity (no screen, no data of its own)
export default class InteriorDesignerLoginController {
    // +login(username: String, password: String, userProfile: Integer): UserAccount
    // BCE method login() (gets: username, password, userProfile): called by the page
    login(username, password, userProfile) {
        // create a UserAccount entity and ask it to login with username, password, userProfile; hand its answer back to the page
        return new UserAccount().login(username, password, userProfile);
    }
}

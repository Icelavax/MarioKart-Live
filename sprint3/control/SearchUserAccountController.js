// ==========================================================================
// PRESENTATION NOTE
// US5 Search User Account - <<Control>> SearchUserAccountController
//
// What to say: The controller has one job: it takes the request from the boundary page and passes
//              it to UserAccount.searchUserAccount(), then hands the answer back. It has no
//              screen and holds no data.
//
// Q: Why have a controller if it only passes the call on?
// A: It keeps the screen and the data apart: the boundary never touches the entity directly. If
//    the business logic changes, only the controller and entity change, not the UI. That is the
//    BCE rule.
// ==========================================================================

// bring in the UserAccount entity class (it holds and checks the user account data)
import UserAccount from '../entity/UserAccount.js';

// <<Control>> SearchUserAccountController - US5 Search User Account
// CONTROL class: takes the request from the page and passes it to the entity (no screen, no data of its own)
export default class SearchUserAccountController {
    // +searchUserAccount(keyword: String): List<UserAccount>
    // BCE method searchUserAccount() (gets: keyword): called by the page
    searchUserAccount(keyword) {
        // create a UserAccount entity and ask it to search user account with keyword; hand its answer back to the page
        return new UserAccount().searchUserAccount(keyword);
    }
}

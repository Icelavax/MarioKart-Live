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

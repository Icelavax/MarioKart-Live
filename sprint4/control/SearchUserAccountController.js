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

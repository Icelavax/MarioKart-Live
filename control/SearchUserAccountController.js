import UserAccount from '../entity/UserAccount.js';

// <<Control>> SearchUserAccountController - US5 Search User Account
export default class SearchUserAccountController {
    // +searchUserAccount(keyword: String): List<UserAccount>
    searchUserAccount(keyword) {
        return new UserAccount().searchUserAccount(keyword);
    }
}

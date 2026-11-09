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

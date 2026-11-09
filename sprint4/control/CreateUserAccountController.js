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

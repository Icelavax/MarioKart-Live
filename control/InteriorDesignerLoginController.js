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

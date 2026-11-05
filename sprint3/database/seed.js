// Starting data, written straight into the entities (used on the first run and by test.js).
// The four built-in profiles MUST get IDs 1-4: the Login pages use them
// (see boundary/Session.js -> Role).
import UserProfile from '../entity/UserProfile.js';
// bring in the UserAccount entity class (it holds and checks the user account data), plus AccountStatus
import UserAccount, { AccountStatus } from '../entity/UserAccount.js';
// bring in the CompanyProfile entity class (it holds and checks the company profile data)
import CompanyProfile from '../entity/CompanyProfile.js';
// bring in the IDP entity class (it holds and checks the idp data)
import IDP from '../entity/IDP.js';
// bring in the IDPCategory entity class (it holds and checks the idp category data)
import IDPCategory from '../entity/IDPCategory.js';
// bring in the IDPViewRecord entity class (it holds and checks the idp view record data)
import IDPViewRecord from '../entity/IDPViewRecord.js';

// bring in the Sprint 1 test accounts
import { loadSprint1TestData } from './testData.js';

// puts the starting data into the entities (used on first run and by test.js)
export function seed() {
    // empty the user profiles
    UserProfile.reset();
    // empty the user accounts
    UserAccount.accounts.length = 0;
    // empty the company profiles
    CompanyProfile.companies.length = 0;
    // empty the IDPs
    IDP.idps.length = 0;
    // empty the categories
    IDPCategory.categories.length = 0;
    // empty the view records
    IDPViewRecord.records.length = 0;
    // make a new, empty profile object
    const profile = new UserProfile();
    profile.createUserProfile('User Admin', 'Manages user accounts and profiles');        // 1
    profile.createUserProfile('Interior Designer', 'Creates and manages IDPs');           // 2
    profile.createUserProfile('Customer', 'Searches and views IDPs');                     // 3
    profile.createUserProfile('Platform Manager', 'Manages IDP categories and reports');   // 4

    // Sprint 1 test data: 25 accounts incl. admin / admin (database/testData.js)
    loadSprint1TestData();

    new IDPCategory().createCategory('Living Room', 'Living room renovation projects');   // categoryId 1
}

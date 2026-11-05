// Starting data, written straight into the entities (no database yet).
// The four built-in profiles MUST get IDs 1-4: the Login pages use them
// (see boundary/Session.js -> Role).
import UserProfile from '../entity/UserProfile.js';
import UserAccount, { AccountStatus } from '../entity/UserAccount.js';
import CompanyProfile from '../entity/CompanyProfile.js';
import IDP from '../entity/IDP.js';
import IDPCategory from '../entity/IDPCategory.js';
import IDPViewRecord from '../entity/IDPViewRecord.js';
import SavedIDP from '../entity/SavedIDP.js';

import { loadSprint1TestData } from './testData.js';

export function seed() {
    UserProfile.reset();
    UserAccount.accounts.length = 0;
    CompanyProfile.companies.length = 0;
    IDP.idps.length = 0;
    IDPCategory.categories.length = 0;
    IDPViewRecord.records.length = 0;
    SavedIDP.saved.length = 0;
    const profile = new UserProfile();
    profile.createUserProfile('User Admin', 'Manages user accounts and profiles');        // 1
    profile.createUserProfile('Interior Designer', 'Creates and manages IDPs');           // 2
    profile.createUserProfile('Customer', 'Searches and views IDPs');                     // 3
    profile.createUserProfile('Platform Manager', 'Manages IDP categories and reports');   // 4

    // Sprint 1 test data: 25 accounts incl. admin / admin (database/testData.js)
    loadSprint1TestData();

    new IDPCategory().createCategory('Living Room', 'Living room renovation projects');   // categoryId 1
}

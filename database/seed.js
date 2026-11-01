// Starting data, written straight into the entities (no database yet).
// The four built-in profiles MUST get IDs 1-4: the Login pages use them
// (see boundary/Session.js -> Role).
import UserProfile from '../entity/UserProfile.js';
import UserAccount, { AccountStatus } from '../entity/UserAccount.js';
import CompanyProfile from '../entity/CompanyProfile.js';
import IDP from '../entity/IDP.js';
import IDPCategory from '../entity/IDPCategory.js';

export function seed() {
    UserProfile.reset();
    UserAccount.accounts.length = 0;
    CompanyProfile.companies.length = 0;
    IDP.idps.length = 0;
    IDPCategory.categories.length = 0;
    const profile = new UserProfile();
    profile.createUserProfile('User Admin', 'Manages user accounts and profiles');        // 1
    profile.createUserProfile('Interior Designer', 'Creates and manages IDPs');           // 2
    profile.createUserProfile('Customer', 'Searches and views IDPs');                     // 3
    profile.createUserProfile('Platform Manager', 'Manages IDP categories and reports');   // 4

    const account = new UserAccount();
    account.createUserAccount('admin',     'admin@example.com',     'admin123',     'Default Admin',     '', 1); // userId 1
    account.createUserAccount('designer',  'designer@example.com',  'designer123',  'Default Designer',  '', 2); // userId 2
    account.createUserAccount('customer',  'customer@example.com',  'customer123',  'Default Customer',  '', 3); // userId 3
    account.createUserAccount('manager',   'manager@example.com',   'manager123',   'Default Manager',   '', 4); // userId 4
    account.createUserAccount('suspended', 'suspended@example.com', 'suspended123', 'Suspended User',    '', 3); // userId 5
    UserAccount.accounts[4].accountStatus = AccountStatus.SUSPENDED;
    // Demo login admin / admin. Set directly because "admin" is shorter than the
    // 6-character rule that US1 applies to new accounts.
    UserAccount.accounts[0].passwordHash = UserAccount.hash('admin');

    new IDPCategory().createCategory('Living Room', 'Living room renovation projects');   // categoryId 1
}

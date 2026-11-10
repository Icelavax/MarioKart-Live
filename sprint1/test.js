// Sprint 1: runs every user story through Boundary -> Control -> Entity
// (no UI, no database). Run with:  node test.js
// Each section tests the story's normal flow and alternate flow from the report.
import { seed } from './database/seed.js';
import { Session } from './boundary/Session.js';
import { IDPStatus } from './entity/IDP.js';
import UserAccount from './entity/UserAccount.js';
import { SPRINT1_ACCOUNTS } from './database/testData.js';
import { isFilled, isEmail, isContactNumberOrBlank, MIN_USERNAME, MIN_PASSWORD } from './boundary/Validator.js';
import IDP from './entity/IDP.js';
import UserAdminLoginPage from './boundary/UserAdminLoginPage.js';
import InteriorDesignerLoginPage from './boundary/InteriorDesignerLoginPage.js';
import CustomerLoginPage from './boundary/CustomerLoginPage.js';
import PlatformManagerLoginPage from './boundary/PlatformManagerLoginPage.js';
import CreateUserProfilePage from './boundary/CreateUserProfilePage.js';
import CreateUserAccountPage from './boundary/CreateUserAccountPage.js';
import UserAdminLogoutPage from './boundary/UserAdminLogoutPage.js';
import CreateCompanyProfilePage from './boundary/CreateCompanyProfilePage.js';
import CreateCurrentIDPPage from './boundary/CreateCurrentIDPPage.js';
import InteriorDesignerLogoutPage from './boundary/InteriorDesignerLogoutPage.js';
import CustomerLogoutPage from './boundary/CustomerLogoutPage.js';
import CreateIDPCategoryPage from './boundary/CreateIDPCategoryPage.js';
import PlatformManagerLogoutPage from './boundary/PlatformManagerLogoutPage.js';

let passed = 0, failed = 0, p, ALICE_ID;
function check(name, condition) {
    if (condition) { passed++; console.log(`  PASS  ${name}\n`); }
    else { failed++; console.log(`  FAIL  ${name}\n`); }
}
function login(PageClass, username, password) {
    const page = new PageClass();
    page.form = { username, password };
    page.clickLogin();
    return page.output;
}

seed();

console.log('=== Sprint 1 test data (TDD: written before the data in database/testData.js) ===');
check('25 Sprint 1 test accounts are loaded', UserAccount.accounts.length === 25 && SPRINT1_ACCOUNTS.length === 25);
check('userIds run 1-25', UserAccount.accounts.every((a, i) => a.userId === i + 1));
check('No duplicate usernames', new Set(UserAccount.accounts.map(a => a.username.toLowerCase())).size === 25);
check('No duplicate emails', new Set(UserAccount.accounts.map(a => a.email.toLowerCase())).size === 25);
check('Default admin is userId 1 in the User Admin profile',
    UserAccount.accounts[0].username === 'admin' && UserAccount.accounts[0].profileId === 1);
check('Every role (profiles 1-4) has at least one account',
    [1, 2, 3, 4].every(id => UserAccount.accounts.some(a => a.profileId === id)));
check('Every account except the demo admin passes the Create User Account form rules',
    SPRINT1_ACCOUNTS.filter(a => a.username !== 'admin').every(a =>
        a.username.length >= MIN_USERNAME && isEmail(a.email) && a.password.length >= MIN_PASSWORD
        && isFilled(a.fullName) && isContactNumberOrBlank(a.contactNumber)));
const LOGIN_PAGE = { 1: UserAdminLoginPage, 2: InteriorDesignerLoginPage, 3: CustomerLoginPage, 4: PlatformManagerLoginPage };
check('Every active test account can log in through the login page of its own role',
    SPRINT1_ACCOUNTS.filter(a => !a.suspended).every(a =>
        login(LOGIN_PAGE[a.profileId], a.username, a.password).type === 'success'));
check('The suspended test account cannot log in',
    SPRINT1_ACCOUNTS.filter(a => a.suspended).every(a =>
        login(LOGIN_PAGE[a.profileId], a.username, a.password).type === 'error'));
new UserAdminLogoutPage().clickLogout();

console.log('=== US11 User Admin Login ===');
check('Wrong password -> displayError', login(UserAdminLoginPage, 'admin', 'wrong').type === 'error');
check('Customer account cannot use the User Admin login', login(UserAdminLoginPage, 'customer', 'customer123').type === 'error');
check('Correct login -> displaySuccess, session set',
    login(UserAdminLoginPage, 'admin', 'admin').type === 'success' && Session.userId === 1);

console.log('=== US6 Create User Profile ===');
p = new CreateUserProfilePage();
p.submitForm('Cleaner', 'Provides cleaning services');
check('New profile -> displaySuccess("Profile created")', p.output.message === 'Profile created');
p.submitForm('cleaner', '');
check('Duplicate profile name -> displayError', p.output.type === 'error');
p.submitForm('   ', '');
check('Blank profile name (boundary) -> "Profile name is required"', p.output.message === 'Profile name is required');

console.log('=== US1 Create User Account ===');
p = new CreateUserAccountPage();
p.submitForm('alice', 'alice@example.com', 'secret1', 'Alice Tan', '91234567', 3);
check('New account -> displaySuccess("Account created")', p.output.message === 'Account created');
p.submitForm('alice2', 'alice@example.com', 'secret1', 'Alice Two', '', 3);
check('Duplicate email -> displayError', p.output.type === 'error');
p.submitForm('alice', 'other@example.com', 'secret1', 'Alice Three', '', 3);
check('Duplicate username -> displayError', p.output.type === 'error');
ALICE_ID = UserAccount.accounts.find(a => a.username === 'alice').userId;
p.submitForm('bob', 'not-an-email', '123', 'Bob', '', 3);
check('Invalid email (boundary) -> "Please enter a valid email address"', p.output.message === 'Please enter a valid email address');
p.submitForm('bob', 'bob@example.com', '123', 'Bob', '', 3);
check('Short password (boundary) -> "Password must be at least 6 characters"', p.output.message === 'Password must be at least 6 characters');
p.submitForm('bo', 'bob@example.com', 'secret1', 'Bob', '', 3);
check('Short username (boundary) -> "Username must be at least 3 characters"', p.output.message === 'Username must be at least 3 characters');
p.submitForm('bob', 'bob@example.com', 'secret1', '  ', '', 3);
check('Blank full name (boundary) -> "Full name is required"', p.output.message === 'Full name is required');
p.submitForm('bob', 'bob@example.com', 'secret1', 'Bob', '12ab', 3);
check('Bad contact number (boundary) -> "Contact number must be 8-15 digits"', p.output.message === 'Contact number must be 8-15 digits');
p.submitForm('bob', 'bob@example.com', 'secret1', 'Bob', '', null);
check('No profile picked (boundary) -> "Please select a user profile"', p.output.message === 'Please select a user profile');
check('Invalid forms never reached the entity (no "bob" account)', !UserAccount.accounts.some(a => a.username === 'bob'));

console.log('=== US12 User Admin Logout ===');
p = new UserAdminLogoutPage();
p.clickLogout();
check('clickLogout -> killSession clears the session', p.output.type === 'success' && Session.userId === null);
p.clickLogout();
check('Session already expired -> directed to login', p.output.type === 'message');

console.log('=== US18 Interior Designer Login ===');
check('Wrong password -> displayError', login(InteriorDesignerLoginPage, 'designer', 'nope').type === 'error');
check('Correct login -> displaySuccess',
    login(InteriorDesignerLoginPage, 'designer', 'designer123').type === 'success' && Session.userId === 2);

console.log('=== US13 Create Company Profile ===');
p = new CreateCompanyProfilePage();
p.submitForm('', 'REG1', 'desc', 'a@b.com', '6123');
check('Missing company name (boundary validateDetails) -> "Company name is required"', p.output.message === 'Company name is required');
p.submitForm('Kart Interiors', '202612345K', 'Modern HDB designs', 'not-an-email', '61234567');
check('Invalid contact email (boundary validateDetails) -> displayError', p.output.message === 'Please enter a valid company email');
p.submitForm('Kart Interiors', '202612345K', 'Modern HDB designs', 'hello@kart.sg', '61234567');
check('Valid details -> displaySuccess', p.output.type === 'success');
p.submitForm('Second Co', 'REG2', '', 'x@y.com', '6000');
check('Designer already has a company profile -> displayError', p.output.type === 'error');

console.log('=== US20 Create Current IDP ===');
p = new CreateCurrentIDPPage();
p.form = { categoryId: 1, title: 'Scandi Living Room', description: 'Light wood, white walls' };
p.displayCreateForm();
check('Valid details -> displaySuccess', p.output.type === 'success');
p = new CreateCurrentIDPPage();
p.form = { categoryId: 1, title: '', description: 'No title' };
p.displayCreateForm();
check('Missing title (validateInput) -> displayFailure', p.output.type === 'failure');
p = new CreateCurrentIDPPage();
p.form = { categoryId: 1, title: 'Industrial Loft', description: 'Concrete and steel' };
p.displayCreateForm();
check('Second IDP created', p.output.type === 'success');

console.log('=== US19 Interior Designer Logout ===');
p = new InteriorDesignerLogoutPage();
p.clickLogout();
check('clickLogout -> killSession clears the session', Session.userId === null);

console.log('=== US35 Customer Login ===');
check('Suspended account -> displayError', login(CustomerLoginPage, 'suspended', 'suspended123').type === 'error');
check('Correct login -> displaySuccess',
    login(CustomerLoginPage, 'customer', 'customer123').type === 'success' && Session.userId === 3);

console.log('=== US36 Customer Logout ===');
p = new CustomerLogoutPage();
p.clickLogout();
check('clickLogout -> killSession clears the session', Session.userId === null);

console.log('=== US47 Platform Manager Login ===');
check('Designer account cannot use the Platform Manager login',
    login(PlatformManagerLoginPage, 'designer', 'designer123').type === 'error');
check('Correct login -> displaySuccess',
    login(PlatformManagerLoginPage, 'manager', 'manager123').type === 'success' && Session.userId === 4);

console.log('=== US39 Create IDP Category ===');
p = new CreateIDPCategoryPage();
p.form = { categoryName: 'Kitchen', categoryDescription: 'Kitchen renovation projects' };
p.clickCreate();
check('New category -> "Category created successfully"', p.output.message === 'Category created successfully');
p.clickCreate();
check('Existing category -> "Unable to create category"', p.output.message === 'Unable to create category');
p.form = { categoryName: '  ', categoryDescription: '' };
p.clickCreate();
check('Blank name (boundary) -> "Category name is required"', p.output.message === 'Category name is required');

console.log('=== US48 Platform Manager Logout ===');
p = new PlatformManagerLogoutPage();
p.clickLogout();
check('clickLogout -> killSession clears the session', Session.userId === null);

console.log(`Result: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);

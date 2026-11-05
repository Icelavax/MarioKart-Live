// Sprint 4: runs every user story through Boundary -> Control -> Entity
// (no UI, no database). Run with:  node test.js
// Each section tests the story's normal flow and alternate flow from the report.
import { seed } from './database/seed.js';
import { Session } from './boundary/Session.js';
import { IDPStatus } from './entity/IDP.js';
import UserAccount from './entity/UserAccount.js';
import { SPRINT1_ACCOUNTS } from './database/testData.js';
import { isFilled, isEmail, isContactNumberOrBlank, MIN_USERNAME, MIN_PASSWORD } from './boundary/Validator.js';
import IDP from './entity/IDP.js';
import IDPViewRecord from './entity/IDPViewRecord.js';
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
import ViewUserAccountPage from './boundary/ViewUserAccountPage.js';
import UpdateUserAccountPage from './boundary/UpdateUserAccountPage.js';
import ViewUserAccountController from './control/ViewUserAccountController.js';
import ViewUserProfilePage from './boundary/ViewUserProfilePage.js';
import UpdateUserProfilePage from './boundary/UpdateUserProfilePage.js';
import ViewUserProfileController from './control/ViewUserProfileController.js';
import ViewCompanyProfilePage from './boundary/ViewCompanyProfilePage.js';
import UpdateCompanyProfilePage from './boundary/UpdateCompanyProfilePage.js';
import ViewCompanyProfileController from './control/ViewCompanyProfileController.js';
import ViewCurrentIDPPage from './boundary/ViewCurrentIDPPage.js';
import UpdateCurrentIDPPage from './boundary/UpdateCurrentIDPPage.js';
import ViewCurrentIDPController from './control/ViewCurrentIDPController.js';
import UpdateIDPStatusPage from './boundary/UpdateIDPStatusPage.js';
import ViewPastIDPPage from './boundary/ViewPastIDPPage.js';
import UpdatePastIDPPage from './boundary/UpdatePastIDPPage.js';
import ViewPastIDPController from './control/ViewPastIDPController.js';
import ViewIDPPage from './boundary/ViewIDPPage.js';
import ViewIDPCategoryPage from './boundary/ViewIDPCategoryPage.js';
import UpdateIDPCategoryPage from './boundary/UpdateIDPCategoryPage.js';
import ViewIDPCategoryController from './control/ViewIDPCategoryController.js';
import SearchUserAccountPage from './boundary/SearchUserAccountPage.js';
import SuspendUserAccountPage from './boundary/SuspendUserAccountPage.js';
import UnsuspendUserAccountPage from './boundary/UnsuspendUserAccountPage.js';
import SuspendUserAccountController from './control/SuspendUserAccountController.js';
import SearchUserProfilePage from './boundary/SearchUserProfilePage.js';
import DeleteUserProfilePage from './boundary/DeleteUserProfilePage.js';
import SearchIDPPage from './boundary/SearchIDPPage.js';
import ViewIDPViewsPage from './boundary/ViewIDPViewsPage.js';
import SearchCompanyProfilePage from './boundary/SearchCompanyProfilePage.js';
import SearchCurrentIDPPage from './boundary/SearchCurrentIDPPage.js';
import DeleteCurrentIDPPage from './boundary/DeleteCurrentIDPPage.js';
import SearchPastIDPPage from './boundary/SearchPastIDPPage.js';
import DeletePastIDPPage from './boundary/DeletePastIDPPage.js';
import ViewIDPShortlistsPage from './boundary/ViewIDPShortlistsPage.js';
import DeleteCompanyProfilePage from './boundary/DeleteCompanyProfilePage.js';
import SearchIDPCategoryPage from './boundary/SearchIDPCategoryPage.js';
import DeleteIDPCategoryPage from './boundary/DeleteIDPCategoryPage.js';
import SaveIDPPage from './boundary/SaveIDPPage.js';
import SearchSavedIDPPage from './boundary/SearchSavedIDPPage.js';
import ViewSavedIDPPage from './boundary/ViewSavedIDPPage.js';
import GenerateDailyReportPage from './boundary/GenerateDailyReportPage.js';
import GenerateWeeklyReportPage from './boundary/GenerateWeeklyReportPage.js';
import GenerateMonthlyReportPage from './boundary/GenerateMonthlyReportPage.js';

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
// No story in the reports records a view yet, so add two view records for IDP 1 directly
IDPViewRecord.records.push({ viewRecordId: 1, idpId: 1, customerId: 3, viewedAt: new Date().toISOString() });
IDPViewRecord.records.push({ viewRecordId: 2, idpId: 1, customerId: 3, viewedAt: new Date().toISOString() });

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

login(UserAdminLoginPage, 'admin', 'admin');
console.log('=== US2 View User Account ===');
p = new ViewUserAccountPage();
p.selectAccount(ALICE_ID);
check('Existing account -> displayAccountDetails', p.output.data?.username === 'alice');
check('Password hash is never displayed', !('passwordHash' in p.output.data));
p.selectAccount(99);
check('Missing account -> displayError("Account not found")', p.output.message === 'Account not found');

console.log('=== US3 Update User Account ===');
let alice = new ViewUserAccountController().viewUserAccount(ALICE_ID);
p = new UpdateUserAccountPage();
p.clickUpdateAccount(alice);
check('displayUpdateForm(account) fills the form', p.output.type === 'form' && p.form.fullName === 'Alice Tan');
p.form.fullName = 'Alice Lim';
p.clickSaveChanges();
check('Save Changes -> displayConfirmation', p.output.type === 'confirm');
p.clickNo();
check('Clicks "No" -> closeConfirmation, nothing saved',
    p.output.type === 'form' && new ViewUserAccountController().viewUserAccount(ALICE_ID).fullName === 'Alice Tan');
p.clickSaveChanges(); p.clickYes();
check('Clicks "Yes" -> displaySuccess("Changes saved successfully")',
    p.output.message === 'Changes saved successfully' && new ViewUserAccountController().viewUserAccount(ALICE_ID).fullName === 'Alice Lim');
p.form.email = 'admin@example.com';
p.clickSaveChanges(); p.clickYes();
check('Email used by another account -> displayError("Invalid input")', p.output.message === 'Invalid input');
p.form.email = 'not-an-email';
p.clickSaveChanges(); p.clickYes();
check('Invalid email (boundary) -> "Please enter a valid email address"', p.output.message === 'Please enter a valid email address');

console.log('=== US7 View User Profile ===');
p = new ViewUserProfilePage();
p.selectProfile(5);
check('Existing profile -> displayProfileDetails', p.output.data?.profileName === 'Cleaner');
p.selectProfile(99);
check('Missing profile -> displayError("Profile not found")', p.output.message === 'Profile not found');

console.log('=== US8 Update User Profile ===');
p = new UpdateUserProfilePage();
p.clickUpdateProfile(new ViewUserProfileController().viewUserProfile(5));
check('displayUpdateForm(profile) fills the form', p.form.profileName === 'Cleaner');
p.form.profileName = 'Home Cleaner';
p.clickSaveChanges(); p.clickNo();
check('Clicks "No" -> closeConfirmation, nothing saved',
    new ViewUserProfileController().viewUserProfile(5).profileName === 'Cleaner');
p.clickSaveChanges(); p.clickYes();
check('Clicks "Yes" -> "User Profile Updated Successfully"',
    p.output.message === 'User Profile Updated Successfully'
    && new ViewUserProfileController().viewUserProfile(5).profileName === 'Home Cleaner');
p.form.profileName = 'Customer';
p.clickSaveChanges(); p.clickYes();
check('Name used by another profile -> displayError("Invalid input")', p.output.message === 'Invalid input');
p.form.profileName = ' ';
p.clickSaveChanges(); p.clickYes();
check('Blank name (boundary) -> "Profile name is required"', p.output.message === 'Profile name is required');

console.log('=== US14 View Company Profile ===');
login(InteriorDesignerLoginPage, 'designer', 'designer123');
p = new ViewCompanyProfilePage();
p.clickViewProfile();
check('Profile exists -> displayCompanyDetails', p.output.data?.companyName === 'Kart Interiors');
new CreateUserAccountPage().submitForm('designer2', 'designer2@example.com', 'designer123', 'Second Designer', '', 2);
login(InteriorDesignerLoginPage, 'designer2', 'designer123');
p.clickViewProfile();
check('No profile -> displayMessage("No company profile is available")',
    p.output.message === 'No company profile is available');
login(InteriorDesignerLoginPage, 'designer', 'designer123');

console.log('=== US15 Update Company Profile ===');
p = new UpdateCompanyProfilePage();
p.clickUpdateProfile();
check('clickUpdateProfile -> displayUpdateForm with current details',
    p.output.type === 'form' && p.form.companyName === 'Kart Interiors');
p.submitForm('Kart Interiors Pte Ltd', '202612345K', 'Modern HDB and condo designs', 'hello@kart.sg', '61234567');
check('Save Changes -> displayConfirmation', p.output.type === 'confirm');
p.clickNo();
check('Clicks "No" -> closeConfirmation, nothing saved',
    new ViewCompanyProfileController().viewCompanyProfile(2).companyName === 'Kart Interiors');
p.submitForm('Kart Interiors Pte Ltd', '202612345K', 'Modern HDB and condo designs', 'hello@kart.sg', '61234567');
p.clickYes();
check('Clicks "Yes" -> "Changes saved successfully"', p.output.message === 'Changes saved successfully'
    && new ViewCompanyProfileController().viewCompanyProfile(2).companyName === 'Kart Interiors Pte Ltd');
p.submitForm('Kart', 'REG', '', 'not-an-email', '61234567');
p.clickYes();
check('Invalid email (boundary) -> displayError, nothing saved', p.output.message === 'Please enter a valid company email'
    && new ViewCompanyProfileController().viewCompanyProfile(2).contactEmail === 'hello@kart.sg');

console.log('=== US21 View Current IDP ===');
p = new ViewCurrentIDPPage();
p.selectIDP(1);
check('Existing IDP -> displayIDPDetails', p.output.data?.title === 'Scandi Living Room'
    && p.output.data?.projectStatus === IDPStatus.CURRENT);
p.selectIDP(99);
check('Missing IDP -> displayFailure', p.output.type === 'failure');

console.log('=== US22 Update Current IDP ===');
p = new UpdateCurrentIDPPage();
p.selectIDP(1);
check('selectIDP -> displayUpdateForm(idp)', p.output.type === 'form' && p.form.title === 'Scandi Living Room');
p.form.designStyle = 'Scandinavian';
p.form.description = 'Light oak, white walls, linen';
p.clickSaveChanges();
check('Valid changes -> displaySuccess, still CURRENT', p.output.type === 'success'
    && new ViewCurrentIDPController().viewIDP(1).designStyle === 'Scandinavian'
    && new ViewCurrentIDPController().viewIDP(1).projectStatus === IDPStatus.CURRENT);
p.form.title = '  ';
p.clickSaveChanges();
check('Blank title (validateInput) -> displayFailure, title unchanged', p.output.type === 'failure'
    && new ViewCurrentIDPController().viewIDP(1).title === 'Scandi Living Room');
p = new UpdateCurrentIDPPage();
p.selectIDP(99);
check('Missing IDP -> displayFailure', p.output.type === 'failure');

console.log('=== US25 Update IDP Status ===');
p = new UpdateIDPStatusPage();
p.selectIDP(2);
check('selectIDP -> displayUpdateStatusForm', p.output.type === 'form' && p.output.data.idpId === 2);
p.form = { status: IDPStatus.PAST };
p.clickUpdateStatus();
check('Current -> Past -> displaySuccess', p.output.type === 'success');
p = new UpdateIDPStatusPage();
p.selectIDP(99);
check('Missing IDP -> displayFailure', p.output.type === 'failure');
p = new UpdateIDPStatusPage();
p.selectIDP(2);
check('Already a past IDP (not a current IDP) -> displayFailure', p.output.type === 'failure');
p = new UpdateIDPStatusPage();
p.selectIDP(1);
p.form = { status: 'Archived' };
p.clickUpdateStatus();
check('Invalid status (boundary) -> failure, nothing changed',
    p.output.message === 'Please choose a valid status' && new ViewCurrentIDPController().viewIDP(1).projectStatus === IDPStatus.CURRENT);

console.log('=== US26 View Past IDP ===');
p = new ViewPastIDPPage();
p.selectIDP(2);
check('Past IDP -> displayIDPDetails', p.output.data?.projectStatus === IDPStatus.PAST);
p.selectIDP(99);
check('Missing IDP -> displayFailure', p.output.type === 'failure');

console.log('=== US27 Update Past IDP ===');
p = new UpdatePastIDPPage();
p.selectIDP(2);
check('selectIDP -> displayUpdateForm(idp)', p.output.type === 'form' && p.form.title === 'Industrial Loft');
p.form.designStyle = 'Industrial';
p.clickSaveChanges();
check('Valid changes -> displaySuccess, still PAST', p.output.type === 'success'
    && new ViewPastIDPController().viewIDP(2).designStyle === 'Industrial'
    && new ViewPastIDPController().viewIDP(2).projectStatus === IDPStatus.PAST);
p.form.categoryId = null;
p.clickSaveChanges();
check('No category (boundary) -> displayFailure', p.output.type === 'failure');
p = new UpdatePastIDPPage();
p.selectIDP(1);
check('A current IDP cannot be edited here -> displayFailure', p.output.type === 'failure');
new InteriorDesignerLogoutPage().clickLogout();

console.log('=== US31 View IDP ===');
login(CustomerLoginPage, 'customer', 'customer123');
p = new ViewIDPPage();
p.selectIDP(1);
check('Existing IDP -> displayIDPDetails', p.output.data?.title === 'Scandi Living Room');
p.selectIDP(99);
check('Missing IDP -> displayError("IDP not found")', p.output.message === 'IDP not found');
new CustomerLogoutPage().clickLogout();

console.log('=== US40 View IDP Category ===');
login(PlatformManagerLoginPage, 'manager', 'manager123');
p = new ViewIDPCategoryPage();
p.selectCategory(2);
check('Existing category -> displayCategoryDetails', p.output.data?.categoryName === 'Kitchen');
p.selectCategory(99);
check('Missing category -> displayMessage("Category not found")', p.output.message === 'Category not found');

console.log('=== US41 Update IDP Category ===');
p = new UpdateIDPCategoryPage();
p.clickUpdate(2);
check('clickUpdate -> displayCategoryDetails', p.output.type === 'form' && p.category.categoryName === 'Kitchen');
p.updateCategory(2, 'Kitchen & Dining', 'Kitchen and dining renovations');
check('Valid update -> displaySuccess', p.output.type === 'success'
    && new ViewIDPCategoryController().viewCategory(2).categoryName === 'Kitchen & Dining');
p.updateCategory(2, 'living room', '');
check('Duplicate name (A2) -> displayError', p.output.type === 'error'
    && new ViewIDPCategoryController().viewCategory(2).categoryName === 'Kitchen & Dining');
p.updateCategory(2, ' ', '');
check('Empty name (A1, boundary) -> "Category name is required"', p.output.message === 'Category name is required');
p.clickUpdate(99);
check('Category not found (A3) -> displayError', p.output.message === 'Category not found');
new PlatformManagerLogoutPage().clickLogout();

login(UserAdminLoginPage, 'admin', 'admin');
console.log('=== US5 Search User Account ===');
p = new SearchUserAccountPage();
p.clickSearch('alice');
check('Match by full name -> displayResults', p.output.type === 'data' && p.output.data.length === 1);
p.selectAccount(p.results[0]);
check('Select from list -> displayAccountDetails', p.output.data?.username === 'alice' && !('passwordHash' in p.output.data));
p.clickSearch('manager@example.com');
check('Match by email -> displayResults', p.output.data?.[0]?.userId === 4);
p.clickSearch('3');
check('Match by user ID -> displayResults', p.output.data?.[0]?.userId === 3);
p.clickSearch('zzz');
check('No match -> displayError("No matching user accounts found")', p.output.message === 'No matching user accounts found');

console.log('=== US4 Suspend User Account ===');
p = new SuspendUserAccountPage();
p.displaySuspendUserAccount(new ViewUserAccountController().viewUserAccount(ALICE_ID));
check('displaySuspendUserAccount shows the account', p.output.data?.username === 'alice');
p.clickSuspendUserAccount(); p.clickNo();
check('Clicks "No" -> closeConfirmation, still active',
    new ViewUserAccountController().viewUserAccount(ALICE_ID).accountStatus === 'Active');
p.clickSuspendUserAccount(); p.clickYes();
check('Clicks "Yes" -> displaySuccess("User Account Suspended")', p.output.message === 'User Account Suspended');
check('Suspended user can no longer log in', login(CustomerLoginPage, 'alice', 'secret1').type === 'error');
login(UserAdminLoginPage, 'admin', 'admin');

console.log('=== Extra: Unsuspend User Account ===');
p = new UnsuspendUserAccountPage();
p.displayUnsuspendUserAccount(new ViewUserAccountController().viewUserAccount(ALICE_ID));
p.clickUnsuspendUserAccount(); p.clickNo();
check('Clicks "No" -> still suspended',
    new ViewUserAccountController().viewUserAccount(ALICE_ID).accountStatus === 'Suspended');
p.clickUnsuspendUserAccount(); p.clickYes();
check('Clicks "Yes" -> displaySuccess("User Account Unsuspended")', p.output.message === 'User Account Unsuspended');
check('Unsuspended user can log in again', login(CustomerLoginPage, 'alice', 'secret1').type === 'success');
login(UserAdminLoginPage, 'admin', 'admin');
p.clickUnsuspendUserAccount(); p.clickYes();
check('Already active -> displayError', p.output.type === 'error');
// put alice back to suspended so later tests see the same state as before
new SuspendUserAccountController().suspendUserAccount(ALICE_ID);

console.log('=== US10 Search User Profile ===');
p = new SearchUserProfilePage();
p.clickSearch('');
check('Empty keyword -> displayError("Please enter a profile name")', p.output.message === 'Please enter a profile name');
p.clickSearch('cleaner');
check('Match -> displayResults', p.output.type === 'data' && p.output.data.length === 1);
p.selectProfile(p.results[0]);
check('Select from list -> displayProfileDetails', p.output.data?.profileName === 'Home Cleaner');
p.clickSearch('zzz');
check('No match -> displayError("No matching user profiles found")', p.output.message === 'No matching user profiles found');

console.log('=== US9 Delete User Profile ===');
new CreateUserProfilePage().submitForm('Temp Role', 'Unused profile');   // profile 6, no accounts
p = new DeleteUserProfilePage();
p.clickDeleteUserProfile(6); p.clickNo();
check('Clicks "No" -> closeConfirmation, not deleted', new ViewUserProfileController().viewUserProfile(6) !== null);
p.clickDeleteUserProfile(3); p.clickYes();
check('Profile in use (accounts assigned) -> displayError', p.output.message === 'Profile is still assigned to user accounts');
p.clickDeleteUserProfile(6); p.clickYes();
check('Unused profile -> displaySuccess("User Profile Deleted")',
    p.output.message === 'User Profile Deleted' && new ViewUserProfileController().viewUserProfile(6) === null);
new UserAdminLogoutPage().clickLogout();

console.log('=== US30 Search IDP ===');
login(CustomerLoginPage, 'customer', 'customer123');
p = new SearchIDPPage();
p.enterSearchCriteria('living');
check('Match -> displayResult', p.output.type === 'data' && p.output.data.length === 1);
p.enterSearchCriteria('bathroom');
check('No match -> displayNoResults', p.output.message === 'No results found');
new CustomerLogoutPage().clickLogout();

console.log('=== US37 View IDP Views ===');
login(InteriorDesignerLoginPage, 'designer', 'designer123');
p = new ViewIDPViewsPage();
p.selectIDP(1);
check('IDP with 2 views -> displayViewCount(2)', p.output.data === 2);
p.selectIDP(2);
check('IDP with no views -> displayViewCount(0)', p.output.data === 0);
p.selectIDP(-1);
check('Invalid IDP -> displayMessage("Unable to retrieve views")', p.output.message === 'Unable to retrieve views');
new InteriorDesignerLogoutPage().clickLogout();

console.log('=== US17 Search Company Profile ===');
login(InteriorDesignerLoginPage, 'designer', 'designer123');
p = new SearchCompanyProfilePage();
p.displaySearchOption();
check('displaySearchOption', p.output.type === 'form');
p.enterSearchKeyword('kart');
check('Match -> displaySearchResults', p.output.type === 'data' && p.results.length === 1);
p.selectCompanyProfile(p.results[0]);
check('Select -> displayCompanyDetails', p.output.data?.companyName === 'Kart Interiors Pte Ltd');
p.enterSearchKeyword('zzz');
check('No match -> displayNoResults', p.output.message === 'No matching company profile found');
p.enterSearchKeyword('  ');
check('Empty keyword (boundary) -> error', p.output.type === 'error');

console.log('=== US24 Search Current IDP ===');
p = new SearchCurrentIDPPage();
p.enterSearchCriteria('scandi', null);
check('Keyword match -> displaySearchResults', p.output.type === 'data' && p.results[0]?.idpId === 1);
p.enterSearchCriteria('', 1);
check('Category only -> displaySearchResults', p.output.type === 'data' && p.results.length === 1);
p.enterSearchCriteria('loft', null);
check('Past IDPs are not listed -> displayNoResults', p.output.message === 'No matching current IDPs found');
p.enterSearchCriteria('', null);
check('Nothing entered (boundary) -> error', p.output.type === 'error');

console.log('=== US23 Delete Current IDP ===');
p = new CreateCurrentIDPPage();
p.form = { categoryId: 1, title: 'Temp Project', description: 'Added by mistake' };
p.displayCreateForm();
const tempId = Math.max(...IDP.idps.map(i => i.idpId));
p = new DeleteCurrentIDPPage();
p.selectIDP(tempId);
check('selectIDP -> displayDeleteConfirmation', p.output.type === 'confirm' && p.confirmDeletion() === false);
p.clickNo();
check('Cancel -> nothing deleted', new ViewCurrentIDPController().viewIDP(tempId) !== null);
p.selectIDP(tempId); p.clickYes();
check('Confirm -> displaySuccess, IDP gone', p.output.type === 'success' && new ViewCurrentIDPController().viewIDP(tempId) === null);
p = new DeleteCurrentIDPPage();
p.selectIDP(2);
check('A past IDP cannot be deleted here -> displayFailure', p.output.type === 'failure');

console.log('=== US29 Search Past IDP ===');
p = new SearchPastIDPPage();
p.displaySearchForm();
check('displaySearchForm', p.output.type === 'form');
p.enterSearchCriteria('loft', null);
check('Keyword match -> displaySearchResults', p.output.type === 'data' && p.results[0]?.idpId === 2);
p.enterSearchCriteria('', 1);
check('Category only -> displaySearchResults (past only)', p.output.type === 'data' && p.results.every(i => i.projectStatus === IDPStatus.PAST));
p.enterSearchCriteria('scandi', null);
check('Current IDPs are not listed -> displayNoResults', p.output.type === 'message');
p.enterSearchCriteria('', null);
check('Nothing entered (boundary) -> error', p.output.type === 'error');

console.log('=== US28 Delete Past IDP ===');
p = new CreateCurrentIDPPage();
p.form = { categoryId: 1, title: 'Old Showflat', description: 'Finished long ago' };
p.displayCreateForm();
const oldId = Math.max(...IDP.idps.map(i => i.idpId));
p = new UpdateIDPStatusPage(); p.selectIDP(oldId); p.form = { status: IDPStatus.PAST }; p.clickUpdateStatus();
p = new DeletePastIDPPage();
p.selectIDP(oldId);
check('selectIDP -> displayDeleteConfirmation(idp)', p.output.type === 'confirm' && p.output.data.idpId === oldId && p.confirmDeletion() === false);
p.clickNo();
check('Cancel (A2) -> nothing deleted', new ViewPastIDPController().viewIDP(oldId) !== null);
p.selectIDP(oldId); p.clickYes();
check('Confirm -> displaySuccess, IDP gone', p.output.type === 'success' && new ViewPastIDPController().viewIDP(oldId) === null);
p = new DeletePastIDPPage();
p.selectIDP(1);
check('A current IDP cannot be deleted here (A1) -> displayFailure', p.output.type === 'failure');
p.selectIDP(999);
check('IDP not found (A1) -> displayFailure', p.output.type === 'failure');

console.log('=== US38 View IDP Shortlists ===');
p = new ViewIDPShortlistsPage();
p.clickViewShortlists(1);
check('Never shortlisted (A1) -> displayShortlistCount(0)', p.output.data === 0);
p.clickViewShortlists(99);
check('IDP not found (A2) -> displayError', p.output.message === 'IDP not found');

console.log('=== US16 Delete Company Profile ===');
p = new DeleteCompanyProfilePage();
p.clickDeleteCompanyProfile();
check('clickDeleteCompanyProfile -> displayConfirmation', p.output.type === 'confirm');
p.clickNo();
check('Cancel -> displayCompanyProfilePage, profile kept',
    p.output.message === 'Deletion cancelled' && new ViewCompanyProfileController().viewCompanyProfile(2) !== null);
p.clickDeleteCompanyProfile(); p.clickYes();
check('Confirm -> displaySuccess, profile gone',
    p.output.type === 'success' && new ViewCompanyProfileController().viewCompanyProfile(2) === null);
p.clickDeleteCompanyProfile(); p.clickYes();
check('No profile left -> displayError', p.output.type === 'error');
new InteriorDesignerLogoutPage().clickLogout();

console.log('=== US43 Search IDP Category ===');
login(PlatformManagerLoginPage, 'manager', 'manager123');
p = new SearchIDPCategoryPage();
p.enterKeyword('kitchen'); p.clickSearch();
check('Match -> displaySearchResults', p.output.type === 'data' && p.results[0]?.categoryId === 2);
p.enterKeyword('zzz'); p.clickSearch();
check('No match (A1) -> "No categories found."', p.output.message === 'No categories found.');
p.enterKeyword(''); p.clickSearch();
check('Empty search (A2, boundary) -> "Please enter a keyword"', p.output.message === 'Please enter a keyword');

console.log('=== US42 Delete IDP Category ===');
p = new DeleteIDPCategoryPage();
p.clickDelete(2);
check('clickDelete -> displayConfirmation', p.output.type === 'confirm');
p.cancelDelete();
check('Cancel (A1) -> category kept', new ViewIDPCategoryController().viewCategory(2) !== null);
p.clickDelete(1); p.confirmDelete(1);
check('Category used by IDPs (A2) -> displayError, kept', p.output.type === 'error'
    && new ViewIDPCategoryController().viewCategory(1) !== null);
p.clickDelete(2); p.confirmDelete(2);
check('Unused category -> displaySuccess, deleted', p.output.type === 'success'
    && new ViewIDPCategoryController().viewCategory(2) === null);
new PlatformManagerLogoutPage().clickLogout();

login(CustomerLoginPage, 'customer', 'customer123');
console.log('=== US32 Save IDP ===');
p = new SaveIDPPage();
p.selectSave(1);
check('Save -> displaySuccess("IDP saved")', p.output.message === 'IDP saved');
p.selectSave(1);
check('Save again -> displayError("IDP already saved")', p.output.message === 'IDP already saved');
console.log('=== US33 Search Saved IDP ===');
p = new SearchSavedIDPPage();
p.searchSavedIDP('scandi');
check('Match -> displayResult', p.output.type === 'data' && p.results[0]?.idpId === 1);
p.searchSavedIDP('loft');
check('Not saved / no match -> displayNoResults', p.output.message === 'No results found');
p.searchSavedIDP(' ');
check('Empty title (boundary) -> error', p.output.type === 'error');
console.log('=== US34 View Saved IDP ===');
p = new ViewSavedIDPPage();
p.viewSavedIDP(1);
check('Saved IDP -> displayIDP', p.output.data?.idpId === 1);
p.viewSavedIDP(2);
check('Not in the saved list -> displayError("IDP not found")', p.output.message === 'IDP not found');
new CustomerLogoutPage().clickLogout();

console.log('=== US38 View IDP Shortlists (after a customer saved it) ===');
login(InteriorDesignerLoginPage, 'designer', 'designer123');
p = new ViewIDPShortlistsPage();
p.clickViewShortlists(1);
check('Saved once -> displayShortlistCount(1)', p.output.data === 1);
new InteriorDesignerLogoutPage().clickLogout();

login(PlatformManagerLoginPage, 'manager', 'manager123');
const today = new Date();
const ymd = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
console.log('=== US44 Generate Daily Report ===');
p = new GenerateDailyReportPage();
p.selectDate(ymd(today)); p.clickGenerateReport();
check('Today -> displayReport with activity', p.output.type === 'data' && p.output.data.totalActivities > 0
    && p.output.data.breakdown.idpsSaved === 1);
p.selectDate('2000-01-01'); p.clickGenerateReport();
check('No activity that day (A1) -> displayError', p.output.message === 'No activity data found for the selected date.');
p.selectDate('not-a-date'); p.clickGenerateReport();
check('Invalid date (boundary) -> displayError', p.output.message === 'Please select a report date');
console.log('=== US45 Generate Weekly Report ===');
p = new GenerateWeeklyReportPage();
p.selectWeek(ymd(today)); p.clickGenerateReport();
check('This week -> displayReport (Monday to Sunday)', p.output.type === 'data'
    && p.output.data.periodStart.getDay() === 1 && p.output.data.periodEnd.getDay() === 0);
p.selectWeek('2000-01-05'); p.clickGenerateReport();
check('No activity that week (A1) -> displayError', p.output.message === 'No activity data found for the selected week.');
console.log('=== US46 Generate Monthly Report ===');
p = new GenerateMonthlyReportPage();
p.selectMonth(ymd(today).slice(0, 7)); p.clickGenerateReport();
check('This month ("YYYY-MM") -> displayReport', p.output.type === 'data' && p.output.data.periodStart.getDate() === 1);
p.selectMonth('2000-01'); p.clickGenerateReport();
check('No activity that month (A1) -> displayError', p.output.message === 'No activity data found for the selected month.');
new PlatformManagerLogoutPage().clickLogout();

console.log(`Result: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);

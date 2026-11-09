// =====================================================================================
// TDD tests for SPRINT 1 (13 user stories + the Sprint 1 test-data batch)
//
// These tests were written FIRST (Red phase), then the code was written until they
// all passed (Green phase). They test each story through its Boundary page, so every
// test goes Boundary -> Control -> Entity, exactly like the real system.
//
//   npm run tdd:sprint1:red   -> Red phase: Sprint 1 entity methods not implemented yet (tests fail)
//   npm run tdd:sprint1       -> Green phase: the real code (all tests pass)
// =====================================================================================
import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

import { seed } from '../database/seed.js';
import { SPRINT1_ACCOUNTS } from '../database/testData.js';
import { Session, Role } from '../boundary/Session.js';
import UserAccount from '../entity/UserAccount.js';
import UserProfile from '../entity/UserProfile.js';
import CompanyProfile from '../entity/CompanyProfile.js';
import IDP from '../entity/IDP.js';
import IDPCategory from '../entity/IDPCategory.js';

import CreateUserAccountPage from '../boundary/CreateUserAccountPage.js';
import CreateUserProfilePage from '../boundary/CreateUserProfilePage.js';
import UserAdminLoginPage from '../boundary/UserAdminLoginPage.js';
import UserAdminLogoutPage from '../boundary/UserAdminLogoutPage.js';
import CreateCompanyProfilePage from '../boundary/CreateCompanyProfilePage.js';
import InteriorDesignerLoginPage from '../boundary/InteriorDesignerLoginPage.js';
import InteriorDesignerLogoutPage from '../boundary/InteriorDesignerLogoutPage.js';
import CreateCurrentIDPPage from '../boundary/CreateCurrentIDPPage.js';
import CustomerLoginPage from '../boundary/CustomerLoginPage.js';
import CustomerLogoutPage from '../boundary/CustomerLogoutPage.js';
import CreateIDPCategoryPage from '../boundary/CreateIDPCategoryPage.js';
import PlatformManagerLoginPage from '../boundary/PlatformManagerLoginPage.js';
import PlatformManagerLogoutPage from '../boundary/PlatformManagerLogoutPage.js';

// The pages print what they show (console.log); hide that so only the test results appear
console.log = () => {};

// ---------- helpers ----------
// Log in through a login page (fills the form, clicks Login) and return what the page shows
function login(LoginPage, username, password) {
    const page = new LoginPage();
    page.form = { username, password };
    page.clickLogin();
    return page.output;
}
function logoutSession() { Session.userId = null; Session.profileId = null; Session.fullName = null; }

// Every test starts from the same data: 4 profiles + the 25 Sprint 1 test accounts
beforeEach(() => {
    logoutSession();
    // In the Red phase the create methods are not written yet, so the starting data cannot
    // be loaded - the "Sprint 1 test data" tests below then report that as a failure.
    try { seed(); } catch { /* reported by the tests */ }
});

// =====================================================================================
describe('Sprint 1 test data (batch 1 of 4, added in code)', () => {
    it('loads exactly 25 test accounts', () => {
        assert.equal(UserAccount.accounts.length, 25);
        assert.equal(SPRINT1_ACCOUNTS.length, 25);
    });
    it('has no duplicate usernames or emails', () => {
        assert.equal(new Set(UserAccount.accounts.map(a => a.username.toLowerCase())).size, 25);
        assert.equal(new Set(UserAccount.accounts.map(a => a.email.toLowerCase())).size, 25);
    });
    it('has at least one account for each of the 4 roles', () => {
        for (const role of [1, 2, 3, 4]) assert.ok(UserAccount.accounts.some(a => a.profileId === role), `role ${role}`);
    });
});

// =====================================================================================
describe('US1 Create User Account', () => {
    it('normal flow: valid details -> "Account created" and the account is saved', () => {
        const page = new CreateUserAccountPage();
        page.submitForm('alice', 'alice@example.com', 'secret1', 'Alice Tan', '91234567', Role.CUSTOMER);
        assert.equal(page.output.message, 'Account created');
        assert.ok(UserAccount.accounts.some(a => a.username === 'alice'));
    });
    it('alternate flow: duplicate email -> error', () => {
        const page = new CreateUserAccountPage();
        page.submitForm('alice2', 'admin@example.com', 'secret1', 'Alice Two', '', Role.CUSTOMER);
        assert.equal(page.output.type, 'error');
    });
    it('alternate flow: duplicate username -> error', () => {
        const page = new CreateUserAccountPage();
        page.submitForm('admin', 'new@example.com', 'secret1', 'New Admin', '', Role.CUSTOMER);
        assert.equal(page.output.type, 'error');
    });
    it('boundary validation: invalid email is rejected before the controller', () => {
        const page = new CreateUserAccountPage();
        page.submitForm('bob', 'not-an-email', 'secret1', 'Bob', '', Role.CUSTOMER);
        assert.equal(page.output.message, 'Please enter a valid email address');
        assert.ok(!UserAccount.accounts.some(a => a.username === 'bob'));
    });
    it('boundary validation: password shorter than 6 characters is rejected', () => {
        const page = new CreateUserAccountPage();
        page.submitForm('bob', 'bob@example.com', '123', 'Bob', '', Role.CUSTOMER);
        assert.equal(page.output.message, 'Password must be at least 6 characters');
    });
});

// =====================================================================================
describe('US6 Create User Profile', () => {
    it('normal flow: new profile name -> "Profile created"', () => {
        const page = new CreateUserProfilePage();
        page.submitForm('Cleaner', 'Provides cleaning services');
        assert.equal(page.output.message, 'Profile created');
        assert.ok(UserProfile.profiles.some(p => p.profileName === 'Cleaner'));
    });
    it('alternate flow: duplicate name (any case) -> error', () => {
        const page = new CreateUserProfilePage();
        page.submitForm('customer', '');
        assert.equal(page.output.type, 'error');
    });
    it('boundary validation: blank name -> "Profile name is required"', () => {
        const page = new CreateUserProfilePage();
        page.submitForm('   ', '');
        assert.equal(page.output.message, 'Profile name is required');
    });
});

// =====================================================================================
// The four login stories share the same flow, one login page per role
const LOGINS = [
    ['US11 User Admin Login', UserAdminLoginPage, 'admin', 'admin', Role.USER_ADMIN],
    ['US18 Interior Designer Login', InteriorDesignerLoginPage, 'designer', 'designer123', Role.INTERIOR_DESIGNER],
    ['US35 Customer Login', CustomerLoginPage, 'customer', 'customer123', Role.CUSTOMER],
    ['US47 Platform Manager Login', PlatformManagerLoginPage, 'manager', 'manager123', Role.PLATFORM_MANAGER],
];
for (const [story, LoginPage, username, password, role] of LOGINS) {
    describe(story, () => {
        it('normal flow: correct username and password -> login successful, session set', () => {
            assert.equal(login(LoginPage, username, password).type, 'success');
            assert.equal(Session.profileId, role);
        });
        it('alternate flow: wrong password -> error, nobody logged in', () => {
            assert.equal(login(LoginPage, username, 'wrong-password').type, 'error');
            assert.equal(Session.userId, null);
        });
        it('alternate flow: an account of another role cannot use this login page', () => {
            const other = role === Role.CUSTOMER ? ['admin', 'admin'] : ['customer', 'customer123'];
            assert.equal(login(LoginPage, ...other).type, 'error');
        });
    });
}
describe('US35 Customer Login (suspended account)', () => {
    it('alternate flow: a suspended account cannot log in', () => {
        assert.equal(login(CustomerLoginPage, 'suspended', 'suspended123').type, 'error');
    });
});

// =====================================================================================
// The four logout stories: the boundary ends the session (no controller / entity in the BCE)
const LOGOUTS = [
    ['US12 User Admin Logout', UserAdminLoginPage, UserAdminLogoutPage, 'admin', 'admin'],
    ['US19 Interior Designer Logout', InteriorDesignerLoginPage, InteriorDesignerLogoutPage, 'designer', 'designer123'],
    ['US36 Customer Logout', CustomerLoginPage, CustomerLogoutPage, 'customer', 'customer123'],
    ['US48 Platform Manager Logout', PlatformManagerLoginPage, PlatformManagerLogoutPage, 'manager', 'manager123'],
];
for (const [story, LoginPage, LogoutPage, username, password] of LOGOUTS) {
    describe(story, () => {
        it('normal flow: clicking Logout ends the session -> "Logout successful"', () => {
            login(LoginPage, username, password);
            const page = new LogoutPage();
            page.clickLogout();
            assert.equal(page.output.message, 'Logout successful');
            assert.equal(Session.userId, null);
        });
    });
}

// =====================================================================================
describe('US13 Create Company Profile', () => {
    it('normal flow: valid details -> "Company profile created" for the logged-in designer', () => {
        login(InteriorDesignerLoginPage, 'designer', 'designer123');
        const page = new CreateCompanyProfilePage();
        page.submitForm('Japanese Special', 'AB123', 'Japanese-inspired designs', 'hello@japanesespecial.sg', '61234567');
        assert.equal(page.output.message, 'Company profile created');
        assert.ok(CompanyProfile.companies.some(c => c.userId === Session.userId));
    });
    it('alternate flow: a designer can only have one company profile', () => {
        login(InteriorDesignerLoginPage, 'designer', 'designer123');
        const page = new CreateCompanyProfilePage();
        page.submitForm('Japanese Special', 'AB123', '', 'hello@japanesespecial.sg', '61234567');
        page.submitForm('Second Company', 'CD456', '', 'second@company.sg', '61234568');
        assert.equal(page.output.message, 'You already have a company profile');
    });
    it('boundary validation: invalid company email is rejected', () => {
        login(InteriorDesignerLoginPage, 'designer', 'designer123');
        const page = new CreateCompanyProfilePage();
        page.submitForm('Japanese Special', 'AB123', '', 'not-an-email', '61234567');
        assert.equal(page.output.type, 'error');
        assert.equal(CompanyProfile.companies.length, 0);
    });
});

// =====================================================================================
describe('US20 Create Current IDP', () => {
    it('normal flow: category, title and description -> "IDP created" with status Current', () => {
        login(InteriorDesignerLoginPage, 'designer', 'designer123');
        const page = new CreateCurrentIDPPage();
        page.form = { categoryId: 1, title: 'Japanese Modern', description: 'Tatami bedrooms for a 3-room flat' };
        page.displayCreateForm();
        assert.equal(page.output.message, 'IDP created');
        const idp = IDP.idps.find(i => i.title === 'Japanese Modern');
        assert.ok(idp);
        assert.equal(idp.projectStatus, 'Current');
    });
    it('boundary validation: missing title -> failure, nothing saved', () => {
        login(InteriorDesignerLoginPage, 'designer', 'designer123');
        const page = new CreateCurrentIDPPage();
        page.form = { categoryId: 1, title: '', description: 'No title' };
        page.displayCreateForm();
        assert.equal(page.output.type, 'failure');
        assert.equal(IDP.idps.length, 0);
    });
});

// =====================================================================================
describe('US39 Create IDP Category', () => {
    it('normal flow: new category name -> "Category created successfully"', () => {
        const page = new CreateIDPCategoryPage();
        page.form = { categoryName: 'Japanese Modern', categoryDescription: 'Japanese minimalism' };
        page.clickCreate();
        assert.equal(page.output.message, 'Category created successfully');
        assert.ok(IDPCategory.categories.some(c => c.categoryName === 'Japanese Modern'));
    });
    it('alternate flow: duplicate category name -> error', () => {
        const page = new CreateIDPCategoryPage();
        page.form = { categoryName: 'living room', categoryDescription: '' };
        page.clickCreate();
        assert.equal(page.output.type, 'error');
    });
    it('boundary validation: blank name -> "Category name is required"', () => {
        const page = new CreateIDPCategoryPage();
        page.form = { categoryName: '  ', categoryDescription: '' };
        page.clickCreate();
        assert.equal(page.output.message, 'Category name is required');
    });
});

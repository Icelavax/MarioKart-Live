// Sprint 1 - Functional Tests: one test per user story, run through each Boundary page.
// Run with:  npm run test:sprint1
import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { seed } from '../database/seed.js';
import { Session, Role } from '../boundary/Session.js';
import UserAdminLoginPage from '../boundary/UserAdminLoginPage.js';
import UserAdminLogoutPage from '../boundary/UserAdminLogoutPage.js';
import CreateUserProfilePage from '../boundary/CreateUserProfilePage.js';
import CreateUserAccountPage from '../boundary/CreateUserAccountPage.js';
import InteriorDesignerLoginPage from '../boundary/InteriorDesignerLoginPage.js';
import InteriorDesignerLogoutPage from '../boundary/InteriorDesignerLogoutPage.js';
import CreateCompanyProfilePage from '../boundary/CreateCompanyProfilePage.js';
import CreateCurrentIDPPage from '../boundary/CreateCurrentIDPPage.js';
import CustomerLoginPage from '../boundary/CustomerLoginPage.js';
import CustomerLogoutPage from '../boundary/CustomerLogoutPage.js';
import PlatformManagerLoginPage from '../boundary/PlatformManagerLoginPage.js';
import PlatformManagerLogoutPage from '../boundary/PlatformManagerLogoutPage.js';
import CreateIDPCategoryPage from '../boundary/CreateIDPCategoryPage.js';

console.log = () => {};                 // hide the pages' own log lines, show only the results
before(() => seed());                   // starting data: 4 profiles + the 25 Sprint 1 test accounts

const login = (LoginPage, username, password) => {
    const page = new LoginPage(); page.form = { username, password }; page.clickLogin(); return page.output;
};
const logout = LogoutPage => { const page = new LogoutPage(); page.clickLogout(); return page.output; };

describe('Sprint 1 - Functional Tests', () => {
    it('1. US11 User Admin logs in successfully', () => {
        assert.equal(login(UserAdminLoginPage, 'admin', 'admin').message, 'Login successful');
    });
    it('2. US6 Create User Profile as User Admin', () => {
        const page = new CreateUserProfilePage();
        page.submitForm('Cleaner', 'Provides cleaning services');
        assert.equal(page.output.message, 'Profile created');
    });
    it('3. US1 Create User Account as User Admin', () => {
        const page = new CreateUserAccountPage();
        page.submitForm('alice', 'alice@example.com', 'secret1', 'Alice Tan', '91234567', Role.CUSTOMER);
        assert.equal(page.output.message, 'Account created');
    });
    it('4. US12 User Admin logs out', () => {
        assert.equal(logout(UserAdminLogoutPage).message, 'Logout successful');
    });
    it('5. US18 Interior Designer logs in successfully', () => {
        assert.equal(login(InteriorDesignerLoginPage, 'designer', 'designer123').message, 'Login successful');
    });
    it('6. US13 Create Company Profile as Interior Designer', () => {
        const page = new CreateCompanyProfilePage();
        page.submitForm('Japanese Special', 'AB123', 'Japanese-inspired designs', 'hello@japanesespecial.sg', '61234567');
        assert.equal(page.output.message, 'Company profile created');
    });
    it('7. US20 Create Current IDP as Interior Designer', () => {
        const page = new CreateCurrentIDPPage();
        page.form = { categoryId: 1, title: 'Japanese Modern', description: 'Tatami bedrooms for a 3-room flat' };
        page.displayCreateForm();
        assert.equal(page.output.message, 'IDP created');
    });
    it('8. US19 Interior Designer logs out', () => {
        assert.equal(logout(InteriorDesignerLogoutPage).message, 'Logout successful');
    });
    it('9. US35 Customer logs in successfully', () => {
        assert.equal(login(CustomerLoginPage, 'alice', 'secret1').message, 'Login successful');   // the account made in test 3
    });
    it('10. US36 Customer logs out', () => {
        assert.equal(logout(CustomerLogoutPage).message, 'Logout successful');
    });
    it('11. US47 Platform Manager logs in successfully', () => {
        assert.equal(login(PlatformManagerLoginPage, 'manager', 'manager123').message, 'Login successful');
    });
    it('12. US39 Create IDP Category as Platform Manager', () => {
        const page = new CreateIDPCategoryPage();
        page.form = { categoryName: 'Japanese Modern', categoryDescription: 'Japanese minimalism' };
        page.clickCreate();
        assert.equal(page.output.message, 'Category created successfully');
    });
    it('13. US48 Platform Manager logs out', () => {
        assert.equal(logout(PlatformManagerLogoutPage).message, 'Logout successful');
        assert.equal(Session.userId, null);
    });
});

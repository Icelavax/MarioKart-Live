// TDD RED PHASE for Sprint 1.
// Simulates the code BEFORE it was implemented: the Sprint 1 entity methods (and the
// logout session code) exist only as empty stubs. Running the Sprint 1 tests against
// this shows them failing - the "Red" step of Red -> Green -> Refactor.
import UserAccount from '../entity/UserAccount.js';
import UserProfile from '../entity/UserProfile.js';
import CompanyProfile from '../entity/CompanyProfile.js';
import IDP from '../entity/IDP.js';
import IDPCategory from '../entity/IDPCategory.js';
import UserAdminLogoutPage from '../boundary/UserAdminLogoutPage.js';
import InteriorDesignerLogoutPage from '../boundary/InteriorDesignerLogoutPage.js';
import CustomerLogoutPage from '../boundary/CustomerLogoutPage.js';
import PlatformManagerLogoutPage from '../boundary/PlatformManagerLogoutPage.js';

const notImplemented = () => false;    // a create method that saves nothing yet
UserAccount.prototype.createUserAccount = notImplemented;           // US1
UserAccount.prototype.login = () => null;                           // US11 / US18 / US35 / US47
UserProfile.prototype.createUserProfile = notImplemented;           // US6
CompanyProfile.prototype.saveCompanyProfile = notImplemented;       // US13
IDP.prototype.createIDP = notImplemented;                           // US20
IDPCategory.prototype.createCategory = notImplemented;              // US39
for (const Page of [UserAdminLogoutPage, InteriorDesignerLogoutPage, CustomerLogoutPage, PlatformManagerLogoutPage])
    Page.prototype.killSession = function () { };                   // US12 / US19 / US36 / US48

console.log('TDD RED PHASE: Sprint 1 methods are empty stubs - the tests below are expected to FAIL\n');

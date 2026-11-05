// Web UI. Run:  npm install  then  npm start  ->  http://localhost:3000
//
// Each route only (1) puts the user's input into a <<Boundary>> page,
// (2) calls the BCE methods / UI events from the sequence diagram, and (3) shows page.output.
// All logic and all field validation stay in boundary -> control -> entity.
import express from 'express';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import { seed } from './database/seed.js';
import { loadDemoData } from './database/demoData.js';
import * as db from './database/db.js';
import { Session, Role, newSessionData, runWithSession } from './boundary/Session.js';
import UserProfile from './entity/UserProfile.js';
import UserAccount from './entity/UserAccount.js';
import IDPCategory from './entity/IDPCategory.js';
import IDP from './entity/IDP.js';
import * as view from './web/views.js';

import UserAdminLoginPage from './boundary/UserAdminLoginPage.js';
import InteriorDesignerLoginPage from './boundary/InteriorDesignerLoginPage.js';
import CustomerLoginPage from './boundary/CustomerLoginPage.js';
import PlatformManagerLoginPage from './boundary/PlatformManagerLoginPage.js';
import UserAdminLogoutPage from './boundary/UserAdminLogoutPage.js';
import InteriorDesignerLogoutPage from './boundary/InteriorDesignerLogoutPage.js';
import CustomerLogoutPage from './boundary/CustomerLogoutPage.js';
import PlatformManagerLogoutPage from './boundary/PlatformManagerLogoutPage.js';
import CreateUserAccountPage from './boundary/CreateUserAccountPage.js';
import CreateUserProfilePage from './boundary/CreateUserProfilePage.js';
import CreateCompanyProfilePage from './boundary/CreateCompanyProfilePage.js';
import CreateCurrentIDPPage from './boundary/CreateCurrentIDPPage.js';
import CreateIDPCategoryPage from './boundary/CreateIDPCategoryPage.js';
import ViewUserAccountPage from './boundary/ViewUserAccountPage.js';
import ViewUserAccountController from './control/ViewUserAccountController.js';
import UpdateUserAccountPage from './boundary/UpdateUserAccountPage.js';
import ViewUserProfilePage from './boundary/ViewUserProfilePage.js';
import ViewUserProfileController from './control/ViewUserProfileController.js';
import UpdateUserProfilePage from './boundary/UpdateUserProfilePage.js';
import ViewCompanyProfilePage from './boundary/ViewCompanyProfilePage.js';
import UpdateCompanyProfilePage from './boundary/UpdateCompanyProfilePage.js';
import ViewCurrentIDPPage from './boundary/ViewCurrentIDPPage.js';
import ViewPastIDPPage from './boundary/ViewPastIDPPage.js';
import UpdateCurrentIDPPage from './boundary/UpdateCurrentIDPPage.js';
import UpdatePastIDPPage from './boundary/UpdatePastIDPPage.js';
import UpdateIDPStatusPage from './boundary/UpdateIDPStatusPage.js';
import ViewIDPPage from './boundary/ViewIDPPage.js';
import ViewIDPCategoryPage from './boundary/ViewIDPCategoryPage.js';
import UpdateIDPCategoryPage from './boundary/UpdateIDPCategoryPage.js';
import SuspendUserAccountPage from './boundary/SuspendUserAccountPage.js';
import SearchUserAccountPage from './boundary/SearchUserAccountPage.js';
import DeleteUserProfilePage from './boundary/DeleteUserProfilePage.js';
import SearchUserProfilePage from './boundary/SearchUserProfilePage.js';
import DeleteCompanyProfilePage from './boundary/DeleteCompanyProfilePage.js';
import SearchCompanyProfilePage from './boundary/SearchCompanyProfilePage.js';
import DeleteCurrentIDPPage from './boundary/DeleteCurrentIDPPage.js';
import SearchCurrentIDPPage from './boundary/SearchCurrentIDPPage.js';
import SearchIDPPage from './boundary/SearchIDPPage.js';
import ViewIDPViewsPage from './boundary/ViewIDPViewsPage.js';
import ViewIDPShortlistsPage from './boundary/ViewIDPShortlistsPage.js';
import DeleteIDPCategoryPage from './boundary/DeleteIDPCategoryPage.js';
import SearchIDPCategoryPage from './boundary/SearchIDPCategoryPage.js';
import IDPViewRecord from './entity/IDPViewRecord.js';
import SaveIDPPage from './boundary/SaveIDPPage.js';
import SearchSavedIDPPage from './boundary/SearchSavedIDPPage.js';
import ViewSavedIDPPage from './boundary/ViewSavedIDPPage.js';
import SavedIDP from './entity/SavedIDP.js';
import GenerateDailyReportPage from './boundary/GenerateDailyReportPage.js';
import GenerateWeeklyReportPage from './boundary/GenerateWeeklyReportPage.js';
import GenerateMonthlyReportPage from './boundary/GenerateMonthlyReportPage.js';

// The User Profile chosen on the login screen decides which Login / Logout boundary is used
const LOGIN_PAGES = {
    [Role.USER_ADMIN]: UserAdminLoginPage,
    [Role.INTERIOR_DESIGNER]: InteriorDesignerLoginPage,
    [Role.CUSTOMER]: CustomerLoginPage,
    [Role.PLATFORM_MANAGER]: PlatformManagerLoginPage,
};
const LOGOUT_PAGES = {
    [Role.USER_ADMIN]: UserAdminLogoutPage,
    [Role.INTERIOR_DESIGNER]: InteriorDesignerLogoutPage,
    [Role.CUSTOMER]: CustomerLogoutPage,
    [Role.PLATFORM_MANAGER]: PlatformManagerLogoutPage,
};

// Start-up data: from the database when DATABASE_URL is set (seeded the very first time),
// otherwise in memory (resets on every restart)
if (db.enabled) {
    const hadData = await db.loadAll();
    if (!hadData) { seed(); loadDemoData(); await db.saveAll(); }
    console.log(`Database connected (${hadData ? 'loaded saved data' : 'first run: test data saved'})`);
} else {
    seed();
    loadDemoData();
    console.log('No DATABASE_URL set - data is kept in memory and resets on restart');
}

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.static(fileURLToPath(new URL('./web/public', import.meta.url))));
app.set('trust proxy', 1);   // behind Render / other hosting proxies

// One session per browser, identified by a random id in a cookie.
// Each request runs "inside" its own session, so Session.userId is that browser's user.
const sessions = new Map();
const SESSION_HOURS = 8;
app.use((req, res, next) => {
    const sid = /(?:^|;\s*)sid=([0-9a-f-]{36})/.exec(req.headers.cookie ?? '')?.[1];
    let entry = sid && sessions.get(sid);
    if (!entry || entry.expires < Date.now()) {
        if (sid) sessions.delete(sid);
        const newSid = randomUUID();
        entry = { data: newSessionData() };
        sessions.set(newSid, entry);
        res.append('Set-Cookie', `sid=${newSid}; Path=/; HttpOnly; SameSite=Lax${req.secure ? '; Secure' : ''}`);
    }
    entry.expires = Date.now() + SESSION_HOURS * 3600 * 1000;
    runWithSession(entry.data, next);
});
setInterval(() => {                          // forget sessions nobody has used for a while
    const now = Date.now();
    for (const [id, e] of sessions) if (e.expires < now) sessions.delete(id);
}, 15 * 60 * 1000).unref();

// After any change made through a form, write the data back to the database (if one is set up)
app.use((req, res, next) => {
    if (req.method === 'POST') res.on('finish', db.saveSoon);
    next();
});

// One-time message shown on the next screen (e.g. "Account created"), kept per browser
const setFlash = msg => { Session.flash = msg; };
const takeFlash = () => { const f = Session.flash ?? null; Session.flash = null; return f; };
const toInt = v => (v === undefined || v === null || v === '' ? null : (/^\d+$/.test(String(v)) ? Number(v) : NaN));
const loginProfiles = () => UserProfile.getAllProfiles().filter(p => LOGIN_PAGES[p.profileId]);
const render = (res, html) => res.type('html').send(html);
const done = (res, output, to) => { setFlash(output); res.redirect(to); };   // show page.output on the next screen

// Pre-condition guard: must be logged in, and (optionally) with the right role
function requireRole(...roles) {
    return (req, res, next) => {
        if (Session.userId == null) return res.redirect('/login');
        if (roles.length && !roles.includes(Session.profileId)) {
            setFlash({ type: 'error', message: 'You do not have access to that page' });
            return res.redirect('/dashboard');
        }
        next();
    };
}
const ADMIN = requireRole(Role.USER_ADMIN);
const DESIGNER = requireRole(Role.INTERIOR_DESIGNER);
const CUSTOMER = requireRole(Role.CUSTOMER);
const MANAGER = requireRole(Role.PLATFORM_MANAGER);

// ---------------- Login / Logout (US11, US18, US35, US47 / US12, US19, US36, US48) ----------------
app.get('/', (req, res) => res.redirect(Session.userId == null ? '/login' : '/dashboard'));

app.get('/login', (req, res) => {
    if (Session.userId != null) return res.redirect('/dashboard');
    render(res, view.login({ profiles: loginProfiles(), banner: takeFlash() }));
});

app.post('/login', (req, res) => {
    const LoginPage = LOGIN_PAGES[toInt(req.body.profileId)];
    if (!LoginPage) {
        return render(res, view.login({ profiles: loginProfiles(), values: req.body,
            banner: { type: 'error', message: 'Please select a user profile' } }));
    }
    const page = new LoginPage();
    page.form = { username: req.body.username ?? '', password: req.body.password ?? '' };
    page.clickLogin();                                         // +clickLogin()
    if (page.output.type === 'success') return res.redirect('/dashboard');
    render(res, view.login({ profiles: loginProfiles(), values: req.body, banner: page.output }));
});

app.post('/logout', (req, res) => {
    const LogoutPage = LOGOUT_PAGES[Session.profileId] ?? UserAdminLogoutPage;
    const page = new LogoutPage();
    page.clickLogout();                                        // +clickLogout() -> killSession()
    setFlash(page.output);
    res.redirect('/login');
});

// Dashboard: IDP tiles (Sprint 1 wireframe)
app.get('/dashboard', requireRole(), (req, res) => {
    let idps = IDP.getAllIDPs(), b = takeFlash(), search = null;
    // ---- US30 Search IDP (Customer): enterSearchCriteria(criteria) ----
    if (Session.profileId === Role.CUSTOMER && req.query.q !== undefined) {
        search = String(req.query.q);
        const page = new SearchIDPPage();
        page.enterSearchCriteria(search);
        idps = page.output.type === 'data' ? page.output.data : [];
        if (page.output.type === 'error') b = page.output;
    }
    render(res, view.dashboard({ session: Session, banner: b, idps, categories: IDPCategory.getAllCategories(), search }));
});

// ---------------- US1 Create User Account (User Admin) ----------------
app.get('/user-accounts/new', ADMIN, (req, res) => {
    new CreateUserAccountPage().displayCreationForm();         // +displayCreationForm()
    render(res, view.createUserAccount({ session: Session, profiles: UserProfile.getAllProfiles() }));
});
app.post('/user-accounts/new', ADMIN, (req, res) => {
    const b = req.body, page = new CreateUserAccountPage();
    page.submitForm(b.username, b.email, b.password, b.fullName, b.contactNumber, toInt(b.profileId));
    if (page.output.type === 'success') return done(res, page.output, '/dashboard');
    render(res, view.createUserAccount({ session: Session, profiles: UserProfile.getAllProfiles(),
        values: b, banner: page.output }));
});

// ---------------- US6 Create User Profile (User Admin) ----------------
app.get('/user-profiles/new', ADMIN, (req, res) => {
    new CreateUserProfilePage().displayCreationForm();
    render(res, view.createUserProfile({ session: Session }));
});
app.post('/user-profiles/new', ADMIN, (req, res) => {
    const page = new CreateUserProfilePage();
    page.submitForm(req.body.profileName, req.body.description);
    if (page.output.type === 'success') return done(res, page.output, '/dashboard');
    render(res, view.createUserProfile({ session: Session, values: req.body, banner: page.output }));
});

// ---------------- US13 Create Company Profile (Interior Designer) ----------------
app.get('/company-profile/new', DESIGNER, (req, res) => {
    new CreateCompanyProfilePage().displayCreationForm();
    render(res, view.createCompanyProfile({ session: Session }));
});
app.post('/company-profile/new', DESIGNER, (req, res) => {
    const b = req.body, page = new CreateCompanyProfilePage();
    page.submitForm(b.companyName, b.registrationNumber, b.companyDescription, b.contactEmail, b.contactNumber);
    if (page.output.type === 'success') return done(res, page.output, '/dashboard');
    render(res, view.createCompanyProfile({ session: Session, values: b, banner: page.output }));
});

// ---------------- US20 Create Current IDP (Interior Designer) ----------------
app.get('/idps/new', DESIGNER, (req, res) => {
    render(res, view.createCurrentIDP({ session: Session, categories: IDPCategory.getAllCategories() }));
});
app.post('/idps/new', DESIGNER, (req, res) => {
    const page = new CreateCurrentIDPPage();
    page.form = { categoryId: toInt(req.body.categoryId), title: req.body.title ?? '',
                  description: req.body.description ?? '' };
    page.displayCreateForm();       // US20 sequence: displayCreateForm -> captureIDPDetails -> validateInput -> createIDP
    if (page.output.type === 'success') return done(res, page.output, '/dashboard');
    render(res, view.createCurrentIDP({ session: Session, categories: IDPCategory.getAllCategories(),
        values: req.body, banner: page.output }));
});

// ---------------- US39 Create IDP Category (Platform Manager) ----------------
app.get('/idp-categories/new', MANAGER, (req, res) => {
    render(res, view.createIDPCategory({ session: Session }));
});
app.post('/idp-categories/new', MANAGER, (req, res) => {
    const page = new CreateIDPCategoryPage();
    page.form = { categoryName: req.body.categoryName ?? '', categoryDescription: req.body.categoryDescription ?? '' };
    page.clickCreate();                                        // +clickCreate()
    if (page.output.type === 'success') return done(res, page.output, '/dashboard');
    render(res, view.createIDPCategory({ session: Session, values: req.body, banner: page.output }));
});

// =====================================================================================
// User Admin - user accounts
// =====================================================================================
const allProfiles = () => UserProfile.getAllProfiles();

// Account list (UI support) / US5 Search User Account
app.get('/accounts', ADMIN, (req, res) => {
    let accounts = UserAccount.getAllAccounts(), b = takeFlash(), search = null;
    if (req.query.q !== undefined) {
        search = String(req.query.q);
        const page = new SearchUserAccountPage();
        page.clickSearch(search);                              // User Admin clicks "Search"
        accounts = page.output.type === 'data' ? page.results : [];
        if (page.output.type === 'error') b = page.output;
    }
    render(res, view.accountList({ session: Session, accounts, profiles: allProfiles(), search, banner: b }));
});

// US2 View User Account: selectAccount(userId)
function showAccount(res, userId, extra = {}) {
    const page = new ViewUserAccountPage();
    page.selectAccount(userId);
    if (page.output.type !== 'data') return done(res, page.output, '/accounts');   // displayError("Account not found")
    render(res, view.accountDetail({ session: Session, account: page.output.data, profiles: allProfiles(),
        banner: extra.banner ?? takeFlash(), confirm: extra.confirm }));
}
app.get('/accounts/:id', ADMIN, (req, res) => showAccount(res, toInt(req.params.id)));

// US3 Update User Account
app.get('/accounts/:id/edit', ADMIN, (req, res) => {
    const account = new ViewUserAccountController().viewUserAccount(toInt(req.params.id));
    if (!account) return done(res, { type: 'error', message: 'Account not found' }, '/accounts');
    const page = new UpdateUserAccountPage();
    page.clickUpdateAccount(account);                          // -> displayUpdateForm(account)
    render(res, view.updateUserAccount({ session: Session, userId: account.userId, values: page.form }));
});
app.post('/accounts/:id/edit', ADMIN, (req, res) => {
    const userId = toInt(req.params.id);
    const account = new ViewUserAccountController().viewUserAccount(userId);
    if (!account) return done(res, { type: 'error', message: 'Account not found' }, '/accounts');
    const page = new UpdateUserAccountPage();
    page.clickUpdateAccount(account);
    const { fullName, email, contactNumber } = req.body;
    page.form = { userId, fullName, email, contactNumber };      // User Admin edits details
    page.clickSaveChanges();                                   // -> displayConfirmation()
    const values = { fullName, email, contactNumber };
    if (req.body.step === 'yes') page.clickYes();
    else if (req.body.step === 'no') page.clickNo();           // -> closeConfirmation()
    else {                                                     // show the confirmation pop-up
        return render(res, view.updateUserAccount({ session: Session, userId, values,
            confirm: view.confirmModal(page.output.message, `/accounts/${userId}/edit`, values) }));
    }
    if (page.output.type === 'success') return done(res, page.output, `/accounts/${userId}`);
    render(res, view.updateUserAccount({ session: Session, userId, values,
        banner: page.output.type === 'form' ? { type: 'message', message: page.output.message } : page.output }));
});

// US4 Suspend User Account
app.post('/accounts/:id/suspend', ADMIN, (req, res) => {
    const userId = toInt(req.params.id);
    const account = new ViewUserAccountController().viewUserAccount(userId);
    if (!account) return done(res, { type: 'error', message: 'Account not found' }, '/accounts');
    const page = new SuspendUserAccountPage();
    page.displaySuspendUserAccount(account);
    page.clickSuspendUserAccount();                            // -> displayConfirmation()
    if (req.body.step === 'yes') { page.clickYes(); return done(res, page.output, `/accounts/${userId}`); }
    if (req.body.step === 'no') { page.clickNo(); return done(res, page.output, `/accounts/${userId}`); }
    showAccount(res, userId, { confirm: view.confirmModal(page.output.message, `/accounts/${userId}/suspend`, {}) });
});

// =====================================================================================
// User Admin - user profiles
// =====================================================================================
const accountCounts = () => UserAccount.getAllAccounts()
    .reduce((m, a) => ({ ...m, [a.profileId]: (m[a.profileId] ?? 0) + 1 }), {});

// Profile list (UI support) / US10 Search User Profile
app.get('/profiles', ADMIN, (req, res) => {
    let profiles = allProfiles(), b = takeFlash(), search = null;
    if (req.query.q !== undefined) {
        search = String(req.query.q);
        const page = new SearchUserProfilePage();
        page.clickSearch(search);
        profiles = page.output.type === 'data' ? page.results : [];
        if (page.output.type === 'error') b = page.output;
    }
    render(res, view.profileList({ session: Session, profiles, counts: accountCounts(), search, banner: b }));
});

// US7 View User Profile: selectProfile(profileId)
function showProfile(res, profileId, extra = {}) {
    const page = new ViewUserProfilePage();
    page.selectProfile(profileId);
    if (page.output.type !== 'data') return done(res, page.output, '/profiles');
    render(res, view.profileDetail({ session: Session, profile: page.output.data,
        accountCount: accountCounts()[profileId] ?? 0, banner: extra.banner ?? takeFlash(), confirm: extra.confirm }));
}
app.get('/profiles/:id', ADMIN, (req, res) => showProfile(res, toInt(req.params.id)));

// US8 Update User Profile
app.get('/profiles/:id/edit', ADMIN, (req, res) => {
    const profile = new ViewUserProfileController().viewUserProfile(toInt(req.params.id));
    if (!profile) return done(res, { type: 'error', message: 'Profile not found' }, '/profiles');
    const page = new UpdateUserProfilePage();
    page.clickUpdateProfile(profile);                          // -> displayUpdateForm(profile)
    render(res, view.updateUserProfile({ session: Session, profileId: profile.profileId, values: page.form }));
});
app.post('/profiles/:id/edit', ADMIN, (req, res) => {
    const profileId = toInt(req.params.id);
    const profile = new ViewUserProfileController().viewUserProfile(profileId);
    if (!profile) return done(res, { type: 'error', message: 'Profile not found' }, '/profiles');
    const page = new UpdateUserProfilePage();
    page.clickUpdateProfile(profile);
    const { profileName, description } = req.body;
    page.form = { profileId, profileName, description };
    page.clickSaveChanges();
    const values = { profileName, description };
    if (req.body.step === 'yes') page.clickYes();
    else if (req.body.step === 'no') page.clickNo();
    else {
        return render(res, view.updateUserProfile({ session: Session, profileId, values,
            confirm: view.confirmModal(page.output.message, `/profiles/${profileId}/edit`, values) }));
    }
    if (page.output.type === 'success') return done(res, page.output, `/profiles/${profileId}`);
    render(res, view.updateUserProfile({ session: Session, profileId, values,
        banner: page.output.type === 'form' ? { type: 'message', message: page.output.message } : page.output }));
});

// US9 Delete User Profile
app.post('/profiles/:id/delete', ADMIN, (req, res) => {
    const profileId = toInt(req.params.id);
    const page = new DeleteUserProfilePage();
    page.clickDeleteUserProfile(profileId);                    // -> displayConfirmation()
    if (req.body.step === 'yes') {
        page.clickYes();
        return done(res, page.output, page.output.type === 'success' ? '/profiles' : `/profiles/${profileId}`);
    }
    if (req.body.step === 'no') { page.clickNo(); return done(res, page.output, `/profiles/${profileId}`); }
    showProfile(res, profileId, { confirm: view.confirmModal(page.output.message, `/profiles/${profileId}/delete`, {}) });
});

// =====================================================================================
// Interior Designer - IDPs
// =====================================================================================
const myIDPs = () => IDP.getAllIDPs().filter(i => i.designerId === Session.userId);   // UI support (list screen)

app.get('/my-idps', DESIGNER, (req, res) => {
    let idps = myIDPs(), b = takeFlash(), search = null;
    // US24 Search Current IDP: enterSearchCriteria(keyword, categoryId)
    if (req.query.q !== undefined || req.query.categoryId !== undefined) {
        search = { keyword: String(req.query.q ?? ''), categoryId: req.query.categoryId ?? '' };
        const page = new SearchCurrentIDPPage();
        page.enterSearchCriteria(search.keyword, toInt(search.categoryId));
        idps = page.output.type === 'data' ? page.results : [];
        if (page.output.type === 'error' || page.output.type === 'failure') b = page.output;
    }
    render(res, view.myIDPs({ session: Session, idps, categories: IDPCategory.getAllCategories(), search, banner: b }));
});

// US21 View Current IDP / US26 View Past IDP: selectIDP(idpId)
app.get('/my-idps/:id', DESIGNER, (req, res) => {
    const idpId = toInt(req.params.id);
    const known = myIDPs().find(i => i.idpId === idpId);       // decides which story's page applies
    const page = known?.projectStatus === 'Past' ? new ViewPastIDPPage() : new ViewCurrentIDPPage();
    page.selectIDP(idpId);
    if (page.output.type !== 'data') return done(res, page.output, '/my-idps');
    let b = takeFlash(), stat = null;
    if (req.query.show === 'views') {                          // US37 View IDP Views: selectIDP(idpId)
        const v = new ViewIDPViewsPage();
        v.selectIDP(idpId);
        if (v.output.type === 'data') stat = `${v.output.data} customer view(s)`; else b = v.output;
    }
    if (req.query.show === 'shortlists') {                     // US38 View IDP Shortlists: clickViewShortlists(idpID)
        const s = new ViewIDPShortlistsPage();
        s.clickViewShortlists(idpId);
        if (s.output.type === 'data') stat = s.output.message; else b = s.output;
    }
    render(res, view.idpDetail({ session: Session, idp: page.output.data, categories: IDPCategory.getAllCategories(),
        banner: b, stat }));
});

// US22 Update Current IDP / US27 Update Past IDP: selectIDP -> displayUpdateForm -> captureUpdatedDetails -> updateIDP
function updatePageFor(idpId) {
    const known = myIDPs().find(i => i.idpId === idpId);
    return known?.projectStatus === 'Past' ? new UpdatePastIDPPage() : new UpdateCurrentIDPPage();
}
app.get('/my-idps/:id/edit', DESIGNER, (req, res) => {
    const idpId = toInt(req.params.id), page = updatePageFor(idpId);
    page.selectIDP(idpId);
    if (page.output.type !== 'form') return done(res, page.output, '/my-idps');
    render(res, view.updateIDP({ session: Session, idpId, categories: IDPCategory.getAllCategories(), values: page.form,
        past: page instanceof UpdatePastIDPPage }));
});
app.post('/my-idps/:id/edit', DESIGNER, (req, res) => {
    const idpId = toInt(req.params.id), page = updatePageFor(idpId);
    page.selectIDP(idpId);
    if (page.output.type !== 'form') return done(res, page.output, '/my-idps');
    const { title, description, designStyle } = req.body;
    page.form = { title, description, designStyle, categoryId: toInt(req.body.categoryId) };
    page.clickSaveChanges();
    if (page.output.type === 'success') return done(res, page.output, `/my-idps/${idpId}`);
    render(res, view.updateIDP({ session: Session, idpId, categories: IDPCategory.getAllCategories(), values: req.body,
        banner: page.output, past: page instanceof UpdatePastIDPPage }));
});

// US25 Update IDP Status: selectIDP -> displayUpdateStatusForm -> captureUpdatedDetails -> updateIDPStatus
app.get('/my-idps/:id/status', DESIGNER, (req, res) => {
    const page = new UpdateIDPStatusPage();
    page.selectIDP(toInt(req.params.id));
    if (page.output.type !== 'form') return done(res, page.output, '/my-idps');
    render(res, view.updateIDPStatus({ session: Session, idp: page.idp }));
});
app.post('/my-idps/:id/status', DESIGNER, (req, res) => {
    const idpId = toInt(req.params.id), page = new UpdateIDPStatusPage();
    page.selectIDP(idpId);
    if (page.output.type !== 'form') return done(res, page.output, '/my-idps');
    page.form = { status: req.body.status };
    page.clickUpdateStatus();
    if (page.output.type === 'success') return done(res, page.output, `/my-idps/${idpId}`);
    render(res, view.updateIDPStatus({ session: Session, idp: page.idp, banner: page.output }));
});

// US23 Delete Current IDP: selectIDP -> displayDeleteConfirmation -> confirmDeletion -> deleteIDP
app.post('/my-idps/:id/delete', DESIGNER, (req, res) => {
    const idpId = toInt(req.params.id), page = new DeleteCurrentIDPPage();
    page.selectIDP(idpId);
    if (page.output.type !== 'confirm') return done(res, page.output, `/my-idps/${idpId}`);
    if (req.body.step === 'yes') {
        page.clickYes();
        return done(res, page.output, page.output.type === 'success' ? '/my-idps' : `/my-idps/${idpId}`);
    }
    if (req.body.step === 'no') { page.clickNo(); return done(res, page.output, `/my-idps/${idpId}`); }
    const idp = myIDPs().find(i => i.idpId === idpId);
    render(res, view.idpDetail({ session: Session, idp, categories: IDPCategory.getAllCategories(),
        confirm: view.confirmModal(page.output.message, `/my-idps/${idpId}/delete`, {}) }));
});

// =====================================================================================
// Interior Designer - company profile
// =====================================================================================
// US14 View Company Profile: clickViewProfile()
function showCompany(res, extra = {}) {
    const page = new ViewCompanyProfilePage();
    page.clickViewProfile();
    render(res, view.companyProfile({ session: Session, profile: page.output.type === 'data' ? page.output.data : null,
        banner: extra.banner ?? takeFlash(), confirm: extra.confirm }));
}
app.get('/company', DESIGNER, (req, res) => showCompany(res));

// US15 Update Company Profile
app.get('/company/edit', DESIGNER, (req, res) => {
    const page = new UpdateCompanyProfilePage();
    page.clickUpdateProfile();                                 // -> displayCompanyDetails -> displayUpdateForm()
    if (page.output.type !== 'form') return done(res, page.output, '/company');
    render(res, view.updateCompanyProfile({ session: Session, values: page.form }));
});
app.post('/company/edit', DESIGNER, (req, res) => {
    const page = new UpdateCompanyProfilePage();
    page.clickUpdateProfile();
    if (page.output.type !== 'form') return done(res, page.output, '/company');
    const b = req.body;
    const values = { companyName: b.companyName, registrationNumber: b.registrationNumber,
        companyDescription: b.companyDescription, contactEmail: b.contactEmail, contactNumber: b.contactNumber };
    page.submitForm(b.companyName, b.registrationNumber, b.companyDescription, b.contactEmail, b.contactNumber);
    if (b.step === 'yes') page.clickYes();
    else if (b.step === 'no') page.clickNo();                  // -> closeConfirmation()
    else {
        return render(res, view.updateCompanyProfile({ session: Session, values,
            confirm: view.confirmModal(page.output.message, '/company/edit', values) }));
    }
    if (page.output.type === 'success') return done(res, page.output, '/company');
    render(res, view.updateCompanyProfile({ session: Session, values,
        banner: page.output.type === 'form' ? { type: 'message', message: page.output.message } : page.output }));
});

// US16 Delete Company Profile
app.post('/company/delete', DESIGNER, (req, res) => {
    const page = new DeleteCompanyProfilePage();
    page.clickDeleteCompanyProfile();                          // -> displayConfirmation()
    if (req.body.step === 'yes') { page.clickYes(); return done(res, page.output, '/company'); }
    if (req.body.step === 'no') { page.clickNo(); return done(res, page.output, '/company'); }   // cancelDeletion()
    showCompany(res, { confirm: view.confirmModal(page.output.message, '/company/delete', {}) });
});

// US17 Search Company Profile: displaySearchOption -> enterSearchKeyword -> displaySearchResults / displayNoResults
app.get('/companies', DESIGNER, (req, res) => {
    const page = new SearchCompanyProfilePage();
    page.displaySearchOption();
    let results = null, selected = null, b = null;
    if (req.query.q !== undefined) {
        page.enterSearchKeyword(String(req.query.q));
        if (page.output.type === 'error') b = page.output;
        else results = page.results;
        const pick = page.results.find(c => c.companyId === toInt(req.query.pick));
        if (pick) {                                            // designer selects a company profile
            page.selectCompanyProfile(pick);
            selected = page.output.data;
        }
    }
    render(res, view.companySearch({ session: Session, keyword: req.query.q ?? '', results, selected, banner: b }));
});

// =====================================================================================
// Customer - view IDP (US31), save (US32), saved list (US33, US34)
// =====================================================================================
app.get('/idps/:id', CUSTOMER, (req, res) => {
    const idpId = toInt(req.params.id), page = new ViewIDPPage();
    page.selectIDP(idpId);                                     // US31 View IDP: selectIDP(idpId)
    if (page.output.type !== 'data') return done(res, page.output, '/dashboard');
    if (!takeFlashPeek()) { IDPViewRecord.recordView(idpId, Session.userId); db.saveSoon(); }   // counts towards US37 "View IDP Views"
    render(res, view.idpView({ session: Session, idp: page.output.data, categories: IDPCategory.getAllCategories(),
        banner: takeFlash(), canSave: HAS_SAVE }));
});
// Peek at the flash without clearing it (so the redirect after "Save" does not count as a new view)
function takeFlashPeek() { return Session.flash ?? null; }
let HAS_SAVE = false;

HAS_SAVE = true;
// US32 Save IDP: selectSave(idpId)
app.post('/idps/:id/save', CUSTOMER, (req, res) => {
    const idpId = toInt(req.params.id), page = new SaveIDPPage();
    page.selectSave(idpId);
    done(res, page.output, `/idps/${idpId}`);
});

// Saved list (UI support) / US33 Search Saved IDP: searchSavedIDP(title)
app.get('/saved', CUSTOMER, (req, res) => {
    let idps = SavedIDP.getSavedIDPs(Session.userId), b = takeFlash(), search = null;
    if (req.query.q !== undefined) {
        search = String(req.query.q);
        const page = new SearchSavedIDPPage();
        page.searchSavedIDP(search);
        idps = page.output.type === 'data' ? page.results : [];
        if (page.output.type === 'error') b = page.output;
    }
    render(res, view.savedList({ session: Session, idps, categories: IDPCategory.getAllCategories(), search, banner: b }));
});

// US34 View Saved IDP: viewSavedIDP(idpId)
app.get('/saved/:id', CUSTOMER, (req, res) => {
    const page = new ViewSavedIDPPage();
    page.viewSavedIDP(toInt(req.params.id));
    if (page.output.type !== 'data') return done(res, page.output, '/saved');
    render(res, view.idpView({ session: Session, idp: page.output.data, categories: IDPCategory.getAllCategories(),
        banner: takeFlash(), back: '/saved', canSave: false }));
});

// =====================================================================================
// Platform Manager - IDP categories (US40-43)
// =====================================================================================
const idpCounts = () => IDP.getAllIDPs().reduce((m, i) => ({ ...m, [i.categoryId]: (m[i.categoryId] ?? 0) + 1 }), {});

// Category list (UI support) / US43 Search IDP Category: enterKeyword -> clickSearch
app.get('/categories', MANAGER, (req, res) => {
    let categories = IDPCategory.getAllCategories(), b = takeFlash(), search = null;
    if (req.query.q !== undefined) {
        search = String(req.query.q);
        const page = new SearchIDPCategoryPage();
        page.enterKeyword(search);
        page.clickSearch();
        categories = page.output.type === 'data' ? page.results : [];
        if (page.output.type === 'error') b = page.output;
    }
    render(res, view.categoryList({ session: Session, categories, counts: idpCounts(), search, banner: b }));
});

// US40 View IDP Category: selectCategory(categoryId)
function showCategory(res, categoryId, extra = {}) {
    const page = new ViewIDPCategoryPage();
    page.selectCategory(categoryId);
    if (page.output.type !== 'data') return done(res, page.output, '/categories');
    render(res, view.categoryDetail({ session: Session, category: page.output.data,
        idpCount: idpCounts()[categoryId] ?? 0, banner: extra.banner ?? takeFlash(), confirm: extra.confirm }));
}
app.get('/categories/:id', MANAGER, (req, res) => showCategory(res, toInt(req.params.id)));

// US41 Update IDP Category: clickUpdate(categoryID) -> updateCategory(...)
app.get('/categories/:id/edit', MANAGER, (req, res) => {
    const categoryId = toInt(req.params.id), page = new UpdateIDPCategoryPage();
    page.clickUpdate(categoryId);
    if (page.output.type !== 'form') return done(res, page.output, '/categories');
    render(res, view.updateIDPCategory({ session: Session, categoryId, values: page.category }));
});
app.post('/categories/:id/edit', MANAGER, (req, res) => {
    const categoryId = toInt(req.params.id), page = new UpdateIDPCategoryPage();
    page.clickUpdate(categoryId);
    if (page.output.type !== 'form') return done(res, page.output, '/categories');
    page.updateCategory(categoryId, req.body.categoryName, req.body.categoryDescription);
    if (page.output.type === 'success') return done(res, page.output, `/categories/${categoryId}`);
    render(res, view.updateIDPCategory({ session: Session, categoryId, values: req.body, banner: page.output }));
});

// US42 Delete IDP Category: clickDelete -> displayConfirmation -> confirmDelete / cancelDelete
app.post('/categories/:id/delete', MANAGER, (req, res) => {
    const categoryId = toInt(req.params.id), page = new DeleteIDPCategoryPage();
    page.clickDelete(categoryId);
    if (req.body.step === 'yes') {
        page.confirmDelete(categoryId);
        return done(res, page.output, page.output.type === 'success' ? '/categories' : `/categories/${categoryId}`);
    }
    if (req.body.step === 'no') { page.cancelDelete(); return done(res, page.output, `/categories/${categoryId}`); }
    showCategory(res, categoryId, { confirm: view.confirmModal(page.output.message, `/categories/${categoryId}/delete`, {}) });
});

// =====================================================================================
// Platform Manager - reports (US44 daily, US45 weekly, US46 monthly)
// =====================================================================================
const REPORTS = {
    daily: { Page: GenerateDailyReportPage, field: 'reportDate', select: 'selectDate', title: 'Daily Report' },
    weekly: { Page: GenerateWeeklyReportPage, field: 'reportWeek', select: 'selectWeek', title: 'Weekly Report' },
    monthly: { Page: GenerateMonthlyReportPage, field: 'reportMonth', select: 'selectMonth', title: 'Monthly Report' },
};
app.get('/reports', MANAGER, (req, res) => {
    const type = REPORTS[req.query.type] ? req.query.type : 'daily';
    const r = REPORTS[type];
    const values = { [r.field]: req.query[r.field] ?? '' };
    let report = null, b = takeFlash();
    if (req.query.generate) {
        const page = new r.Page();
        page[r.select](req.query[r.field] ?? '');               // selectDate / selectWeek / selectMonth
        page.clickGenerateReport();                            // -> generate...Report -> displayReport / displayError
        if (page.output.type === 'data') report = { ...page.output.data, title: r.title };
        else b = page.output;
    }
    render(res, view.reports({ session: Session, type, values, report, banner: b }));
});

// Unknown pages
app.use((req, res) => res.redirect(Session.userId == null ? '/login' : '/dashboard'));

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => console.log(`ID Platform running at http://localhost:${PORT}`));

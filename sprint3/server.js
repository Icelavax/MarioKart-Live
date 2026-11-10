// Web UI. Run:  npm install  then  npm start  ->  http://localhost:3000
//
// Each route only (1) puts the user's input into a <<Boundary>> page,
// (2) calls the BCE methods / UI events from the sequence diagram, and (3) shows page.output.
// All logic and all field validation stay in boundary -> control -> entity.
import express from 'express';
// helper to turn this file's location into a normal folder path
import { fileURLToPath } from 'node:url';
// helper that makes random unique IDs (used for session cookies)
import { randomUUID } from 'node:crypto';
// bring in seed() - puts the starting data into the entities
import { seed } from './database/seed.js';
// bring in the demo data (example IDPs, companies, views)
import { loadDemoData } from './database/demoData.js';
// bring in the database code (load / save)
import * as db from './database/db.js';
// bring in the Session (who is logged in) and the role numbers
import { Session, Role, newSessionData, runWithSession } from './boundary/Session.js';
// bring in the UserProfile entity class
import UserProfile from './entity/UserProfile.js';
// bring in the UserAccount entity class
import UserAccount from './entity/UserAccount.js';
// bring in the IDPCategory entity class
import IDPCategory from './entity/IDPCategory.js';
// bring in the IDP entity class
import IDP from './entity/IDP.js';
// bring in the HTML screens
import * as view from './web/views.js';

// bring in the UserAdminLoginPage boundary class (used by the route for that story)
import UserAdminLoginPage from './boundary/UserAdminLoginPage.js';
// bring in the InteriorDesignerLoginPage boundary class (used by the route for that story)
import InteriorDesignerLoginPage from './boundary/InteriorDesignerLoginPage.js';
// bring in the CustomerLoginPage boundary class (used by the route for that story)
import CustomerLoginPage from './boundary/CustomerLoginPage.js';
// bring in the PlatformManagerLoginPage boundary class (used by the route for that story)
import PlatformManagerLoginPage from './boundary/PlatformManagerLoginPage.js';
// bring in the UserAdminLogoutPage boundary class (used by the route for that story)
import UserAdminLogoutPage from './boundary/UserAdminLogoutPage.js';
// bring in the InteriorDesignerLogoutPage boundary class (used by the route for that story)
import InteriorDesignerLogoutPage from './boundary/InteriorDesignerLogoutPage.js';
// bring in the CustomerLogoutPage boundary class (used by the route for that story)
import CustomerLogoutPage from './boundary/CustomerLogoutPage.js';
// bring in the PlatformManagerLogoutPage boundary class (used by the route for that story)
import PlatformManagerLogoutPage from './boundary/PlatformManagerLogoutPage.js';
// bring in the CreateUserAccountPage boundary class (used by the route for that story)
import CreateUserAccountPage from './boundary/CreateUserAccountPage.js';
// bring in the CreateUserProfilePage boundary class (used by the route for that story)
import CreateUserProfilePage from './boundary/CreateUserProfilePage.js';
// bring in the CreateCompanyProfilePage boundary class (used by the route for that story)
import CreateCompanyProfilePage from './boundary/CreateCompanyProfilePage.js';
// bring in the CreateCurrentIDPPage boundary class (used by the route for that story)
import CreateCurrentIDPPage from './boundary/CreateCurrentIDPPage.js';
// bring in the CreateIDPCategoryPage boundary class (used by the route for that story)
import CreateIDPCategoryPage from './boundary/CreateIDPCategoryPage.js';
// bring in the ViewUserAccountPage boundary class (used by the route for that story)
import ViewUserAccountPage from './boundary/ViewUserAccountPage.js';
// bring in ViewUserAccountController (used to load data for a screen)
import ViewUserAccountController from './control/ViewUserAccountController.js';
// bring in the UpdateUserAccountPage boundary class (used by the route for that story)
import UpdateUserAccountPage from './boundary/UpdateUserAccountPage.js';
// bring in the ViewUserProfilePage boundary class (used by the route for that story)
import ViewUserProfilePage from './boundary/ViewUserProfilePage.js';
// bring in ViewUserProfileController (used to load data for a screen)
import ViewUserProfileController from './control/ViewUserProfileController.js';
// bring in the UpdateUserProfilePage boundary class (used by the route for that story)
import UpdateUserProfilePage from './boundary/UpdateUserProfilePage.js';
// bring in the ViewCompanyProfilePage boundary class (used by the route for that story)
import ViewCompanyProfilePage from './boundary/ViewCompanyProfilePage.js';
// bring in the UpdateCompanyProfilePage boundary class (used by the route for that story)
import UpdateCompanyProfilePage from './boundary/UpdateCompanyProfilePage.js';
// bring in the ViewCurrentIDPPage boundary class (used by the route for that story)
import ViewCurrentIDPPage from './boundary/ViewCurrentIDPPage.js';
// bring in the ViewPastIDPPage boundary class (used by the route for that story)
import ViewPastIDPPage from './boundary/ViewPastIDPPage.js';
// bring in the UpdateCurrentIDPPage boundary class (used by the route for that story)
import UpdateCurrentIDPPage from './boundary/UpdateCurrentIDPPage.js';
// bring in the UpdatePastIDPPage boundary class (used by the route for that story)
import UpdatePastIDPPage from './boundary/UpdatePastIDPPage.js';
// bring in the UpdateIDPStatusPage boundary class (used by the route for that story)
import UpdateIDPStatusPage from './boundary/UpdateIDPStatusPage.js';
// bring in the ViewIDPPage boundary class (used by the route for that story)
import ViewIDPPage from './boundary/ViewIDPPage.js';
// bring in the ViewIDPCategoryPage boundary class (used by the route for that story)
import ViewIDPCategoryPage from './boundary/ViewIDPCategoryPage.js';
// bring in the UpdateIDPCategoryPage boundary class (used by the route for that story)
import UpdateIDPCategoryPage from './boundary/UpdateIDPCategoryPage.js';
// bring in the SuspendUserAccountPage boundary class (used by the route for that story)
import SuspendUserAccountPage from './boundary/SuspendUserAccountPage.js';
// bring in the UnsuspendUserAccountPage boundary class (used by the route for that story)
import UnsuspendUserAccountPage from './boundary/UnsuspendUserAccountPage.js';
// bring in the SearchUserAccountPage boundary class (used by the route for that story)
import SearchUserAccountPage from './boundary/SearchUserAccountPage.js';
// bring in the DeleteUserProfilePage boundary class (used by the route for that story)
import DeleteUserProfilePage from './boundary/DeleteUserProfilePage.js';
// bring in the SearchUserProfilePage boundary class (used by the route for that story)
import SearchUserProfilePage from './boundary/SearchUserProfilePage.js';
// bring in the DeleteCompanyProfilePage boundary class (used by the route for that story)
import DeleteCompanyProfilePage from './boundary/DeleteCompanyProfilePage.js';
// bring in the SearchCompanyProfilePage boundary class (used by the route for that story)
import SearchCompanyProfilePage from './boundary/SearchCompanyProfilePage.js';
// bring in the DeleteCurrentIDPPage boundary class (used by the route for that story)
import DeleteCurrentIDPPage from './boundary/DeleteCurrentIDPPage.js';
// bring in the SearchCurrentIDPPage boundary class (used by the route for that story)
import SearchCurrentIDPPage from './boundary/SearchCurrentIDPPage.js';
// bring in the DeletePastIDPPage boundary class (used by the route for that story)
import DeletePastIDPPage from './boundary/DeletePastIDPPage.js';
// bring in the SearchPastIDPPage boundary class (used by the route for that story)
import SearchPastIDPPage from './boundary/SearchPastIDPPage.js';
// bring in the SearchIDPPage boundary class (used by the route for that story)
import SearchIDPPage from './boundary/SearchIDPPage.js';
// bring in the ViewIDPViewsPage boundary class (used by the route for that story)
import ViewIDPViewsPage from './boundary/ViewIDPViewsPage.js';
// bring in the ViewIDPShortlistsPage boundary class (used by the route for that story)
import ViewIDPShortlistsPage from './boundary/ViewIDPShortlistsPage.js';
// bring in the DeleteIDPCategoryPage boundary class (used by the route for that story)
import DeleteIDPCategoryPage from './boundary/DeleteIDPCategoryPage.js';
// bring in the SearchIDPCategoryPage boundary class (used by the route for that story)
import SearchIDPCategoryPage from './boundary/SearchIDPCategoryPage.js';
// bring in the IDPViewRecord entity class
import IDPViewRecord from './entity/IDPViewRecord.js';

// The User Profile chosen on the login screen decides which Login / Logout boundary is used
const LOGIN_PAGES = {
    // User Admin -> UserAdminLoginPage
    [Role.USER_ADMIN]: UserAdminLoginPage,
    // Interior Designer -> InteriorDesignerLoginPage
    [Role.INTERIOR_DESIGNER]: InteriorDesignerLoginPage,
    // Customer -> CustomerLoginPage
    [Role.CUSTOMER]: CustomerLoginPage,
    // Platform Manager -> PlatformManagerLoginPage
    [Role.PLATFORM_MANAGER]: PlatformManagerLoginPage,
};
// which Logout page to use for each role:
const LOGOUT_PAGES = {
    // User Admin -> UserAdminLogoutPage
    [Role.USER_ADMIN]: UserAdminLogoutPage,
    // Interior Designer -> InteriorDesignerLogoutPage
    [Role.INTERIOR_DESIGNER]: InteriorDesignerLogoutPage,
    // Customer -> CustomerLogoutPage
    [Role.CUSTOMER]: CustomerLogoutPage,
    // Platform Manager -> PlatformManagerLogoutPage
    [Role.PLATFORM_MANAGER]: PlatformManagerLogoutPage,
};

// Start-up data: from the database when DATABASE_URL is set (seeded the very first time),
// otherwise in memory (resets on every restart)
if (db.enabled) {
    // load all saved data from the database into the entities
    const hadData = await db.loadAll();
    // empty database (first run) -> add the starting + demo data and save it
    if (!hadData) { seed(); loadDemoData(); await db.saveAll(); }
    // print what happened in the Render log
    console.log(`Database connected (${hadData ? 'loaded saved data' : 'first run: test data saved'})`);
} else {
    // no database -> add the starting data in memory...
    seed();
    // ...and the demo data
    loadDemoData();
    // print a warning in the log
    console.log('No DATABASE_URL set - data is kept in memory and resets on restart');
}

// create the web app
const app = express();
// read the values of submitted HTML forms into req.body
app.use(express.urlencoded({ extended: false }));
// serve the files in web/public (style.css) as they are
app.use(express.static(fileURLToPath(new URL('./web/public', import.meta.url))));
app.set('trust proxy', 1);   // behind Render / other hosting proxies

// One session per browser, identified by a random id in a cookie.
// Each request runs "inside" its own session, so Session.userId is that browser's user.
const sessions = new Map();
// a login lasts 8 hours of no activity
const SESSION_HOURS = 8;
// runs before EVERY request: find or create this browser's session
app.use((req, res, next) => {
    // read the session ID ("sid") from the browser's cookie, if there is one
    const sid = /(?:^|;\s*)sid=([0-9a-f-]{36})/.exec(req.headers.cookie ?? '')?.[1];
    // look up that session
    let entry = sid && sessions.get(sid);
    // no session, or it has expired ->
    if (!entry || entry.expires < Date.now()) {
        // forget the old one
        if (sid) sessions.delete(sid);
        // make a new random session ID
        const newSid = randomUUID();
        // new empty login data (nobody logged in)
        entry = { data: newSessionData() };
        // remember it
        sessions.set(newSid, entry);
        // send the cookie to the browser (HttpOnly = JavaScript cannot read it; Secure on HTTPS)
        res.append('Set-Cookie', `sid=${newSid}; Path=/; HttpOnly; SameSite=Lax${req.secure ? '; Secure' : ''}`);
    }
    // push the expiry time 8 hours ahead (because the user is active)
    entry.expires = Date.now() + SESSION_HOURS * 3600 * 1000;
    // run the rest of this request with this browser's Session
    runWithSession(entry.data, next);
});
setInterval(() => {                          // forget sessions nobody has used for a while
    // every 15 minutes: the time now...
    const now = Date.now();
    // ...remove sessions that have expired
    for (const [id, e] of sessions) if (e.expires < now) sessions.delete(id);
// check every 15 minutes; unref() means this timer does not keep the server running
}, 15 * 60 * 1000).unref();

// After any change made through a form, write the data back to the database (if one is set up)
app.use((req, res, next) => {
    // after a form is submitted (POST) and answered, save all data to the database
    if (req.method === 'POST') res.on('finish', db.saveSoon);
    // go on to the matching route
    next();
});

// One-time message shown on the next screen (e.g. "Account created"), kept per browser
const setFlash = msg => { Session.flash = msg; };
// get that message once and then clear it
const takeFlash = () => { const f = Session.flash ?? null; Session.flash = null; return f; };
// turn text from the URL / form into a whole number: '' -> null, '12' -> 12, 'abc' -> NaN
const toInt = v => (v === undefined || v === null || v === '' ? null : (/^\d+$/.test(String(v)) ? Number(v) : NaN));
// the profiles shown on the login screen (only the 4 roles that have a Login page)
const loginProfiles = () => UserProfile.getAllProfiles().filter(p => LOGIN_PAGES[p.profileId]);
// send an HTML page back to the browser
const render = (res, html) => res.type('html').send(html);
const done = (res, output, to) => { setFlash(output); res.redirect(to); };   // show page.output on the next screen

// Pre-condition guard: must be logged in, and (optionally) with the right role
function requireRole(...roles) {
    // the guard itself, run before the route:
    return (req, res, next) => {
        // not logged in -> go to the login page
        if (Session.userId == null) return res.redirect('/login');
        // logged in but the wrong role ->
        if (roles.length && !roles.includes(Session.profileId)) {
            // show this error...
            setFlash({ type: 'error', message: 'You do not have access to that page' });
            // ...on the home page
            return res.redirect('/dashboard');
        }
        // go on to the matching route
        next();
    };
}
// guard: User Admin only
const ADMIN = requireRole(Role.USER_ADMIN);
// guard: Interior Designer only
const DESIGNER = requireRole(Role.INTERIOR_DESIGNER);
// guard: Customer only
const CUSTOMER = requireRole(Role.CUSTOMER);
// guard: Platform Manager only
const MANAGER = requireRole(Role.PLATFORM_MANAGER);

// ---------------- Login / Logout (US11, US18, US35, US47 / US12, US19, US36, US48) ----------------
// home address: go to login if not logged in, otherwise to the dashboard
app.get('/', (req, res) => res.redirect(Session.userId == null ? '/login' : '/dashboard'));

// show the login screen
app.get('/login', (req, res) => {
    // already logged in -> go to the dashboard
    if (Session.userId != null) return res.redirect('/dashboard');
    // show the login form with the 4 roles in the drop-down
    render(res, view.login({ profiles: loginProfiles(), banner: takeFlash() }));
});

// the login form was submitted
app.post('/login', (req, res) => {
    // pick the Login page for the role chosen in the drop-down
    const LoginPage = LOGIN_PAGES[toInt(req.body.profileId)];
    // no role picked ->
    if (!LoginPage) {
        // show the login form again with what was typed...
        return render(res, view.login({ profiles: loginProfiles(), values: req.body,
            // ...and this error message
            banner: { type: 'error', message: 'Please select a user profile' } }));
    }
    // create that Login page
    const page = new LoginPage();
    // give it the typed username and password
    page.form = { username: req.body.username ?? '', password: req.body.password ?? '' };
    page.clickLogin();                                         // +clickLogin()
    // login worked -> go to the dashboard
    if (page.output.type === 'success') return res.redirect('/dashboard');
    // login failed -> show the form again with the error message
    render(res, view.login({ profiles: loginProfiles(), values: req.body, banner: page.output }));
});

// the Logout menu item was clicked
app.post('/logout', (req, res) => {
    // pick the Logout page for the logged-in role
    const LogoutPage = LOGOUT_PAGES[Session.profileId] ?? UserAdminLogoutPage;
    // create that Logout page
    const page = new LogoutPage();
    page.clickLogout();                                        // +clickLogout() -> killSession()
    // show its message ("Logout successful") on the next page
    setFlash(page.output);
    // go back to the login screen
    res.redirect('/login');
});

// Dashboard: IDP tiles (Sprint 1 wireframe)
app.get('/dashboard', requireRole(), (req, res) => {
    // all IDPs, any message to show, and no search yet
    let idps = IDP.getAllIDPs(), b = takeFlash(), search = null;
    // ---- US30 Search IDP (Customer): enterSearchCriteria(criteria) ----
    // a customer searched for something ->
    if (Session.profileId === Role.CUSTOMER && req.query.q !== undefined) {
        // the search text
        search = String(req.query.q);
        // create the Search IDP page (US30)
        const page = new SearchIDPPage();
        // run the search
        page.enterSearchCriteria(search);
        // show the results (or nothing if the search failed)
        idps = page.output.type === 'data' ? page.output.data : [];
        // if the page showed an error, show it as a message
        if (page.output.type === 'error') b = page.output;
    }
    // show the dashboard with the IDP tiles
    render(res, view.dashboard({ session: Session, banner: b, idps, categories: IDPCategory.getAllCategories(), search }));
});

// ---------------- US1 Create User Account (User Admin) ----------------
// show the Create User Account form (User Admin only)
app.get('/user-accounts/new', ADMIN, (req, res) => {
    new CreateUserAccountPage().displayCreationForm();         // +displayCreationForm()
    // with the list of profiles for the drop-down
    render(res, view.createUserAccount({ session: Session, profiles: UserProfile.getAllProfiles() }));
});
// the Create User Account form was submitted
app.post('/user-accounts/new', ADMIN, (req, res) => {
    // b = the form values; create the page
    const b = req.body, page = new CreateUserAccountPage();
    // pass the form values to the page (it validates them, then calls the controller)
    page.submitForm(b.username, b.email, b.password, b.fullName, b.contactNumber, toInt(b.profileId));
    // created -> show the message on the dashboard
    if (page.output.type === 'success') return done(res, page.output, '/dashboard');
    // failed -> show the form again...
    render(res, view.createUserAccount({ session: Session, profiles: UserProfile.getAllProfiles(),
        // ...with what was typed and the error message
        values: b, banner: page.output }));
});

// ---------------- US6 Create User Profile (User Admin) ----------------
// show the Create User Profile form
app.get('/user-profiles/new', ADMIN, (req, res) => {
    // the page displays its creation form (BCE method)
    new CreateUserProfilePage().displayCreationForm();
    // show the form
    render(res, view.createUserProfile({ session: Session }));
});
// the Create User Profile form was submitted
app.post('/user-profiles/new', ADMIN, (req, res) => {
    // create the page
    const page = new CreateUserProfilePage();
    // pass the typed name and description to the page
    page.submitForm(req.body.profileName, req.body.description);
    // created -> show the message on the dashboard
    if (page.output.type === 'success') return done(res, page.output, '/dashboard');
    // show the form again with the result message
    render(res, view.createUserProfile({ session: Session, values: req.body, banner: page.output }));
});

// ---------------- US13 Create Company Profile (Interior Designer) ----------------
// show the Create Company Profile form (Interior Designer only)
app.get('/company-profile/new', DESIGNER, (req, res) => {
    // the page displays its creation form (BCE method)
    new CreateCompanyProfilePage().displayCreationForm();
    // show the form
    render(res, view.createCompanyProfile({ session: Session }));
});
// the Create Company Profile form was submitted
app.post('/company-profile/new', DESIGNER, (req, res) => {
    // b = the form values; create the page
    const b = req.body, page = new CreateCompanyProfilePage();
    // pass the form values to the page
    page.submitForm(b.companyName, b.registrationNumber, b.companyDescription, b.contactEmail, b.contactNumber);
    // created -> show the message on the dashboard
    if (page.output.type === 'success') return done(res, page.output, '/dashboard');
    // show the form again with the result message
    render(res, view.createCompanyProfile({ session: Session, values: b, banner: page.output }));
});

// ---------------- US20 Create Current IDP (Interior Designer) ----------------
// show the Create IDP form (Interior Designer only)
app.get('/idps/new', DESIGNER, (req, res) => {
    // with the list of categories for the drop-down
    render(res, view.createCurrentIDP({ session: Session, categories: IDPCategory.getAllCategories() }));
});
// the Create IDP form was submitted
app.post('/idps/new', DESIGNER, (req, res) => {
    // create the page
    const page = new CreateCurrentIDPPage();
    // put the typed values into the page's form...
    page.form = { categoryId: toInt(req.body.categoryId), title: req.body.title ?? '',
                  // ...continued: description
                  description: req.body.description ?? '' };
    page.displayCreateForm();       // US20 sequence: displayCreateForm -> captureIDPDetails -> validateInput -> createIDP
    // created -> show the message on the dashboard
    if (page.output.type === 'success') return done(res, page.output, '/dashboard');
    // show the form again...
    render(res, view.createCurrentIDP({ session: Session, categories: IDPCategory.getAllCategories(),
        // ...with what was typed and the result message
        values: req.body, banner: page.output }));
});

// ---------------- US39 Create IDP Category (Platform Manager) ----------------
// show the Create IDP Category form (Platform Manager only)
app.get('/idp-categories/new', MANAGER, (req, res) => {
    // show the form
    render(res, view.createIDPCategory({ session: Session }));
});
// the Create IDP Category form was submitted
app.post('/idp-categories/new', MANAGER, (req, res) => {
    // create the page
    const page = new CreateIDPCategoryPage();
    // put the typed name and description into the page's form
    page.form = { categoryName: req.body.categoryName ?? '', categoryDescription: req.body.categoryDescription ?? '' };
    page.clickCreate();                                        // +clickCreate()
    // created -> show the message on the dashboard
    if (page.output.type === 'success') return done(res, page.output, '/dashboard');
    // show the form again with the result message
    render(res, view.createIDPCategory({ session: Session, values: req.body, banner: page.output }));
});

// =====================================================================================
// User Admin - user accounts
// =====================================================================================
// helper: all user profiles
const allProfiles = () => UserProfile.getAllProfiles();

// Account list (UI support) / US5 Search User Account
app.get('/accounts', ADMIN, (req, res) => {
    // all accounts, any message to show, and no search yet
    let accounts = UserAccount.getAllAccounts(), b = takeFlash(), search = null;
    // a search was done ->
    if (req.query.q !== undefined) {
        // the search text
        search = String(req.query.q);
        // create the Search User Account page (US5)
        const page = new SearchUserAccountPage();
        page.clickSearch(search);                              // User Admin clicks "Search"
        // show the results (or nothing if the search failed)
        accounts = page.output.type === 'data' ? page.results : [];
        // if the page showed an error, show it as a message
        if (page.output.type === 'error') b = page.output;
    }
    // show the account list
    render(res, view.accountList({ session: Session, accounts, profiles: allProfiles(), search, banner: b }));
});

// US2 View User Account: selectAccount(userId)
function showAccount(res, userId, extra = {}) {
    // create the View User Account page (US2)
    const page = new ViewUserAccountPage();
    // the actor picks this account
    page.selectAccount(userId);
    if (page.output.type !== 'data') return done(res, page.output, '/accounts');   // displayError("Account not found")
    // show the details...
    render(res, view.accountDetail({ session: Session, account: page.output.data, profiles: allProfiles(),
        // ...plus any message or Yes/No pop-up
        banner: extra.banner ?? takeFlash(), confirm: extra.confirm }));
}
// open one account (the ID comes from the address, e.g. /accounts/7)
app.get('/accounts/:id', ADMIN, (req, res) => showAccount(res, toInt(req.params.id)));

// US3 Update User Account
app.get('/accounts/:id/edit', ADMIN, (req, res) => {
    // load the account
    const account = new ViewUserAccountController().viewUserAccount(toInt(req.params.id));
    // not found -> back to the list with an error
    if (!account) return done(res, { type: 'error', message: 'Account not found' }, '/accounts');
    // create the Update User Account page (US3)
    const page = new UpdateUserAccountPage();
    page.clickUpdateAccount(account);                          // -> displayUpdateForm(account)
    // show the form filled in with the current values
    render(res, view.updateUserAccount({ session: Session, userId: account.userId, values: page.form }));
});
// the Update Account form was submitted
app.post('/accounts/:id/edit', ADMIN, (req, res) => {
    // the account ID from the address
    const userId = toInt(req.params.id);
    // ask the controller for the account with this ID
    const account = new ViewUserAccountController().viewUserAccount(userId);
    // not found -> back to the list with an error
    if (!account) return done(res, { type: 'error', message: 'Account not found' }, '/accounts');
    // create the Update User Account page (US3)
    const page = new UpdateUserAccountPage();
    // UI event: start updating this account
    page.clickUpdateAccount(account);
    // the values typed in the form
    const { fullName, email, contactNumber } = req.body;
    page.form = { userId, fullName, email, contactNumber };      // User Admin edits details
    page.clickSaveChanges();                                   // -> displayConfirmation()
    // keep them together
    const values = { fullName, email, contactNumber };
    // actor clicked "Yes" in the pop-up -> save the changes
    if (req.body.step === 'yes') page.clickYes();
    else if (req.body.step === 'no') page.clickNo();           // -> closeConfirmation()
    else {                                                     // show the confirmation pop-up
        // show the form with the "Save changes?" pop-up...
        return render(res, view.updateUserAccount({ session: Session, userId, values,
            // ...the pop-up's Yes / No buttons post back to this same address
            confirm: view.confirmModal(page.output.message, `/accounts/${userId}/edit`, values) }));
    }
    // saved -> go back to the account page with the message
    if (page.output.type === 'success') return done(res, page.output, `/accounts/${userId}`);
    // not saved -> show the form again...
    render(res, view.updateUserAccount({ session: Session, userId, values,
        // ...with the message
        banner: page.output.type === 'form' ? { type: 'message', message: page.output.message } : page.output }));
});

// US4 Suspend User Account
app.post('/accounts/:id/suspend', ADMIN, (req, res) => {
    // the account ID from the address
    const userId = toInt(req.params.id);
    // ask the controller for the account with this ID
    const account = new ViewUserAccountController().viewUserAccount(userId);
    // not found -> back to the list with an error
    if (!account) return done(res, { type: 'error', message: 'Account not found' }, '/accounts');
    // create the Suspend User Account page (US4)
    const page = new SuspendUserAccountPage();
    // show this account on the page
    page.displaySuspendUserAccount(account);
    page.clickSuspendUserAccount();                            // -> displayConfirmation()
    // "Yes" -> suspend it and go back to the account page with the message
    if (req.body.step === 'yes') { page.clickYes(); return done(res, page.output, `/accounts/${userId}`); }
    // "No" -> cancel and go back to the account page
    if (req.body.step === 'no') { page.clickNo(); return done(res, page.output, `/accounts/${userId}`); }
    // first click -> show the account with the "Suspend?" pop-up
    showAccount(res, userId, { confirm: view.confirmModal(page.output.message, `/accounts/${userId}/suspend`, {}) });
});

// Extra: Unsuspend User Account (pairs with US4)
app.post('/accounts/:id/unsuspend', ADMIN, (req, res) => {
    // the account ID from the address
    const userId = toInt(req.params.id);
    // ask the controller for the account with this ID
    const account = new ViewUserAccountController().viewUserAccount(userId);
    // not found -> back to the list with an error
    if (!account) return done(res, { type: 'error', message: 'Account not found' }, '/accounts');
    // create the Unsuspend User Account page
    const page = new UnsuspendUserAccountPage();
    // show this account on the page
    page.displayUnsuspendUserAccount(account);
    page.clickUnsuspendUserAccount();                          // -> displayConfirmation()
    // "Yes" -> suspend it and go back to the account page with the message
    if (req.body.step === 'yes') { page.clickYes(); return done(res, page.output, `/accounts/${userId}`); }
    // "No" -> cancel and go back to the account page
    if (req.body.step === 'no') { page.clickNo(); return done(res, page.output, `/accounts/${userId}`); }
    // first click -> show the account with the "Unsuspend?" pop-up
    showAccount(res, userId, { confirm: view.confirmModal(page.output.message, `/accounts/${userId}/unsuspend`, {}) });
});

// =====================================================================================
// User Admin - user profiles
// =====================================================================================
// helper: how many accounts each profile has...
const accountCounts = () => UserAccount.getAllAccounts()
    // ...counted into { profileId: count }
    .reduce((m, a) => ({ ...m, [a.profileId]: (m[a.profileId] ?? 0) + 1 }), {});

// Profile list (UI support) / US10 Search User Profile
app.get('/profiles', ADMIN, (req, res) => {
    // all profiles, any message to show, and no search yet
    let profiles = allProfiles(), b = takeFlash(), search = null;
    // a search was done ->
    if (req.query.q !== undefined) {
        // the search text
        search = String(req.query.q);
        // create the Search User Profile page (US10)
        const page = new SearchUserProfilePage();
        // run the search
        page.clickSearch(search);
        // show the results (or nothing if the search failed)
        profiles = page.output.type === 'data' ? page.results : [];
        // if the page showed an error, show it as a message
        if (page.output.type === 'error') b = page.output;
    }
    // show the profile list with the account counts
    render(res, view.profileList({ session: Session, profiles, counts: accountCounts(), search, banner: b }));
});

// US7 View User Profile: selectProfile(profileId)
function showProfile(res, profileId, extra = {}) {
    // create the View User Profile page (US7)
    const page = new ViewUserProfilePage();
    // the actor picks this profile
    page.selectProfile(profileId);
    // not found -> back to the list with the message
    if (page.output.type !== 'data') return done(res, page.output, '/profiles');
    // show the details...
    render(res, view.profileDetail({ session: Session, profile: page.output.data,
        // ...how many accounts use it, and any message or pop-up
        accountCount: accountCounts()[profileId] ?? 0, banner: extra.banner ?? takeFlash(), confirm: extra.confirm }));
}
// open one profile (ID from the address)
app.get('/profiles/:id', ADMIN, (req, res) => showProfile(res, toInt(req.params.id)));

// US8 Update User Profile
app.get('/profiles/:id/edit', ADMIN, (req, res) => {
    // load the profile
    const profile = new ViewUserProfileController().viewUserProfile(toInt(req.params.id));
    // not found -> back to the list with an error
    if (!profile) return done(res, { type: 'error', message: 'Profile not found' }, '/profiles');
    // create the Update User Profile page (US8)
    const page = new UpdateUserProfilePage();
    page.clickUpdateProfile(profile);                          // -> displayUpdateForm(profile)
    // show the form filled in with the current values
    render(res, view.updateUserProfile({ session: Session, profileId: profile.profileId, values: page.form }));
});
// the Update Profile form was submitted
app.post('/profiles/:id/edit', ADMIN, (req, res) => {
    // the profile ID from the address
    const profileId = toInt(req.params.id);
    // ask the controller for the profile with this ID
    const profile = new ViewUserProfileController().viewUserProfile(profileId);
    // not found -> back to the list with an error
    if (!profile) return done(res, { type: 'error', message: 'Profile not found' }, '/profiles');
    // create the Update User Profile page (US8)
    const page = new UpdateUserProfilePage();
    // UI event: start updating this profile
    page.clickUpdateProfile(profile);
    // the values typed in the form
    const { profileName, description } = req.body;
    // put them into the page's form
    page.form = { profileId, profileName, description };
    // UI event: "Save Changes" -> opens the pop-up
    page.clickSaveChanges();
    // keep the typed values together
    const values = { profileName, description };
    // actor clicked "Yes" in the pop-up -> save the changes
    if (req.body.step === 'yes') page.clickYes();
    // "No" -> close the pop-up
    else if (req.body.step === 'no') page.clickNo();
    // first submit ->
    else {
        // show the form with the "Save changes?" pop-up...
        return render(res, view.updateUserProfile({ session: Session, profileId, values,
            // ...whose Yes / No buttons post back here
            confirm: view.confirmModal(page.output.message, `/profiles/${profileId}/edit`, values) }));
    }
    // saved -> go back to the profile page with the message
    if (page.output.type === 'success') return done(res, page.output, `/profiles/${profileId}`);
    // not saved -> show the form again with the message
    render(res, view.updateUserProfile({ session: Session, profileId, values,
        // ...with the message
        banner: page.output.type === 'form' ? { type: 'message', message: page.output.message } : page.output }));
});

// US9 Delete User Profile
app.post('/profiles/:id/delete', ADMIN, (req, res) => {
    // the profile ID from the address
    const profileId = toInt(req.params.id);
    // create the Delete User Profile page (US9)
    const page = new DeleteUserProfilePage();
    page.clickDeleteUserProfile(profileId);                    // -> displayConfirmation()
    // "Yes" ->
    if (req.body.step === 'yes') {
        // delete it
        page.clickYes();
        // deleted -> back to the list; failed -> back to the profile, with the message
        return done(res, page.output, page.output.type === 'success' ? '/profiles' : `/profiles/${profileId}`);
    }
    // "No" -> cancel and go back to the profile
    if (req.body.step === 'no') { page.clickNo(); return done(res, page.output, `/profiles/${profileId}`); }
    // first click -> show the profile with the "Delete?" pop-up
    showProfile(res, profileId, { confirm: view.confirmModal(page.output.message, `/profiles/${profileId}/delete`, {}) });
});

// =====================================================================================
// Interior Designer - IDPs
// =====================================================================================
const myIDPs = () => IDP.getAllIDPs().filter(i => i.designerId === Session.userId);   // UI support (list screen)

// the My IDPs list (Interior Designer only)
app.get('/my-idps', DESIGNER, (req, res) => {
    // this designer's IDPs, any message to show, and no search yet
    let idps = myIDPs(), b = takeFlash(), search = null;
    // US24 Search Current IDP / US29 Search Past IDP: enterSearchCriteria(keyword, categoryId)
    if (req.query.q !== undefined || req.query.categoryId !== undefined) {
        // search Past IDPs or Current IDPs (Current if not said)
        const scope = req.query.scope === 'past' ? 'past' : 'current';
        // remember what was searched
        search = { scope, keyword: String(req.query.q ?? ''), categoryId: req.query.categoryId ?? '' };
        // Search Current IDP page (US24)...
        let page = new SearchCurrentIDPPage();
        // ...or Search Past IDP page (US29)
        if (scope === 'past') { page = new SearchPastIDPPage(); page.displaySearchForm(); }
        // run the search with the keyword and category
        page.enterSearchCriteria(search.keyword, toInt(search.categoryId));
        // show the results (or nothing)
        idps = page.output.type === 'data' ? page.results : [];
        // show any error message
        if (page.output.type === 'error' || page.output.type === 'failure') b = page.output;
    }
    // show the list
    render(res, view.myIDPs({ session: Session, idps, categories: IDPCategory.getAllCategories(), search, banner: b }));
});

// US21 View Current IDP / US26 View Past IDP: selectIDP(idpId)
app.get('/my-idps/:id', DESIGNER, (req, res) => {
    // the IDP ID from the address
    const idpId = toInt(req.params.id);
    const known = myIDPs().find(i => i.idpId === idpId);       // decides which story's page applies
    // use the View Past IDP page (US26) for past IDPs, otherwise View Current IDP (US21)
    const page = known?.projectStatus === 'Past' ? new ViewPastIDPPage() : new ViewCurrentIDPPage();
    // the actor picks this IDP
    page.selectIDP(idpId);
    // not allowed / not found -> back to the list with the message
    if (page.output.type !== 'data') return done(res, page.output, '/my-idps');
    // any message, and no statistic yet
    let b = takeFlash(), stat = null;
    if (req.query.show === 'views') {                          // US37 View IDP Views: selectIDP(idpId)
        // View IDP Views page (US37)
        const v = new ViewIDPViewsPage();
        // ask for this IDP's view count
        v.selectIDP(idpId);
        // show "N customer view(s)", or the error
        if (v.output.type === 'data') stat = `${v.output.data} customer view(s)`; else b = v.output;
    }
    if (req.query.show === 'shortlists') {                     // US38 View IDP Shortlists: clickViewShortlists(idpID)
        // View IDP Shortlists page (US38)
        const s = new ViewIDPShortlistsPage();
        // ask for this IDP's shortlist count
        s.clickViewShortlists(idpId);
        // show "Shortlisted N time(s)", or the error
        if (s.output.type === 'data') stat = s.output.message; else b = s.output;
    }
    // show the IDP details...
    render(res, view.idpDetail({ session: Session, idp: page.output.data, categories: IDPCategory.getAllCategories(),
        // ...with the message and statistic
        banner: b, stat }));
});

// US22 Update Current IDP / US27 Update Past IDP: selectIDP -> displayUpdateForm -> captureUpdatedDetails -> updateIDP
function updatePageFor(idpId) {
    // find the IDP among this designer's IDPs
    const known = myIDPs().find(i => i.idpId === idpId);
    // Past IDP -> Update Past IDP (US27); otherwise Update Current IDP (US22)
    return known?.projectStatus === 'Past' ? new UpdatePastIDPPage() : new UpdateCurrentIDPPage();
}
// show the Update IDP form
app.get('/my-idps/:id/edit', DESIGNER, (req, res) => {
    // the IDP ID, and the right Update page
    const idpId = toInt(req.params.id), page = updatePageFor(idpId);
    // the actor picks this IDP
    page.selectIDP(idpId);
    // not allowed / not found -> back to the list
    if (page.output.type !== 'form') return done(res, page.output, '/my-idps');
    // show the form filled in with the current values...
    render(res, view.updateIDP({ session: Session, idpId, categories: IDPCategory.getAllCategories(), values: page.form,
        // ...and say if it is a past IDP
        past: page instanceof UpdatePastIDPPage }));
});
// the Update IDP form was submitted
app.post('/my-idps/:id/edit', DESIGNER, (req, res) => {
    // the IDP ID, and the right Update page
    const idpId = toInt(req.params.id), page = updatePageFor(idpId);
    // the actor picks this IDP
    page.selectIDP(idpId);
    // not allowed / not found -> back to the list
    if (page.output.type !== 'form') return done(res, page.output, '/my-idps');
    // the values typed in the form
    const { title, description, designStyle } = req.body;
    // put them into the page's form
    page.form = { title, description, designStyle, categoryId: toInt(req.body.categoryId) };
    // UI event: "Save Changes" -> opens the pop-up
    page.clickSaveChanges();
    // updated -> back to the IDP page with the message
    if (page.output.type === 'success') return done(res, page.output, `/my-idps/${idpId}`);
    // not updated -> show the form again...
    render(res, view.updateIDP({ session: Session, idpId, categories: IDPCategory.getAllCategories(), values: req.body,
        // ...with the message
        banner: page.output, past: page instanceof UpdatePastIDPPage }));
});

// US25 Update IDP Status: selectIDP -> displayUpdateStatusForm -> captureUpdatedDetails -> updateIDPStatus
app.get('/my-idps/:id/status', DESIGNER, (req, res) => {
    // create the page
    const page = new UpdateIDPStatusPage();
    // the actor picks this IDP
    page.selectIDP(toInt(req.params.id));
    // not allowed / not found -> back to the list
    if (page.output.type !== 'form') return done(res, page.output, '/my-idps');
    // show the form
    render(res, view.updateIDPStatus({ session: Session, idp: page.idp }));
});
// the Update Status form was submitted
app.post('/my-idps/:id/status', DESIGNER, (req, res) => {
    // the IDP ID, and the page
    const idpId = toInt(req.params.id), page = new UpdateIDPStatusPage();
    // the actor picks this IDP
    page.selectIDP(idpId);
    // not allowed / not found -> back to the list
    if (page.output.type !== 'form') return done(res, page.output, '/my-idps');
    // the status that was picked
    page.form = { status: req.body.status };
    // UI event: the actor clicks "Update Status"
    page.clickUpdateStatus();
    // updated -> back to the IDP page with the message
    if (page.output.type === 'success') return done(res, page.output, `/my-idps/${idpId}`);
    // show the form again with the result message
    render(res, view.updateIDPStatus({ session: Session, idp: page.idp, banner: page.output }));
});

// US23 Delete Current IDP / US28 Delete Past IDP: selectIDP -> displayDeleteConfirmation -> confirmDeletion -> deleteIDP
app.post('/my-idps/:id/delete', DESIGNER, (req, res) => {
    // the IDP ID from the address
    const idpId = toInt(req.params.id);
    // Delete Current IDP page (US23)...
    let page = new DeleteCurrentIDPPage();
    // ...or Delete Past IDP page (US28) if this IDP is a past project
    if (myIDPs().find(i => i.idpId === idpId)?.projectStatus === 'Past') page = new DeletePastIDPPage();
    // the actor picks this IDP
    page.selectIDP(idpId);
    // not allowed / not found -> back to the IDP with the message
    if (page.output.type !== 'confirm') return done(res, page.output, `/my-idps/${idpId}`);
    // "Yes" ->
    if (req.body.step === 'yes') {
        // delete it
        page.clickYes();
        // deleted -> back to the list; failed -> back to the IDP, with the message
        return done(res, page.output, page.output.type === 'success' ? '/my-idps' : `/my-idps/${idpId}`);
    }
    // "No" -> cancel and go back to the IDP
    if (req.body.step === 'no') { page.clickNo(); return done(res, page.output, `/my-idps/${idpId}`); }
    // find the IDP
    const idp = myIDPs().find(i => i.idpId === idpId);
    // first click -> show the IDP with the "Delete?" pop-up
    render(res, view.idpDetail({ session: Session, idp, categories: IDPCategory.getAllCategories(),
        // (the pop-up's Yes / No buttons post back here)
        confirm: view.confirmModal(page.output.message, `/my-idps/${idpId}/delete`, {}) }));
});

// =====================================================================================
// Interior Designer - company profile
// =====================================================================================
// US14 View Company Profile: clickViewProfile()
function showCompany(res, extra = {}) {
    // create the View Company Profile page (US14)
    const page = new ViewCompanyProfilePage();
    // UI event: the actor opens "Company Profile"
    page.clickViewProfile();
    // show the profile (or "none yet")
    render(res, view.companyProfile({ session: Session, profile: page.output.type === 'data' ? page.output.data : null,
        // ...plus any message or Yes/No pop-up
        banner: extra.banner ?? takeFlash(), confirm: extra.confirm }));
}
// open the Company Profile page
app.get('/company', DESIGNER, (req, res) => showCompany(res));

// US15 Update Company Profile
app.get('/company/edit', DESIGNER, (req, res) => {
    // create the Update Company Profile page (US15)
    const page = new UpdateCompanyProfilePage();
    page.clickUpdateProfile();                                 // -> displayCompanyDetails -> displayUpdateForm()
    // no profile to update -> back with the message
    if (page.output.type !== 'form') return done(res, page.output, '/company');
    // show the form filled in with the current values
    render(res, view.updateCompanyProfile({ session: Session, values: page.form }));
});
// the Update Company Profile form was submitted
app.post('/company/edit', DESIGNER, (req, res) => {
    // create the Update Company Profile page (US15)
    const page = new UpdateCompanyProfilePage();
    // UI event: start updating
    page.clickUpdateProfile();
    // no profile to update -> back with the message
    if (page.output.type !== 'form') return done(res, page.output, '/company');
    // the values typed in the form
    const b = req.body;
    // keep them together...
    const values = { companyName: b.companyName, registrationNumber: b.registrationNumber,
        // ...continued
        companyDescription: b.companyDescription, contactEmail: b.contactEmail, contactNumber: b.contactNumber };
    // pass the form values to the page
    page.submitForm(b.companyName, b.registrationNumber, b.companyDescription, b.contactEmail, b.contactNumber);
    // "Yes" in the pop-up -> save the changes
    if (b.step === 'yes') page.clickYes();
    else if (b.step === 'no') page.clickNo();                  // -> closeConfirmation()
    // first submit ->
    else {
        // first submit -> show the form with the "Save changes?" pop-up
        return render(res, view.updateCompanyProfile({ session: Session, values,
            // (its Yes / No buttons post back here)
            confirm: view.confirmModal(page.output.message, '/company/edit', values) }));
    }
    // saved -> back to the company page with the message
    if (page.output.type === 'success') return done(res, page.output, '/company');
    // not saved -> show the form again with the message
    render(res, view.updateCompanyProfile({ session: Session, values,
        // ...with the message
        banner: page.output.type === 'form' ? { type: 'message', message: page.output.message } : page.output }));
});

// US16 Delete Company Profile
app.post('/company/delete', DESIGNER, (req, res) => {
    // create the Delete Company Profile page (US16)
    const page = new DeleteCompanyProfilePage();
    page.clickDeleteCompanyProfile();                          // -> displayConfirmation()
    // "Yes" -> delete it and go back with the message
    if (req.body.step === 'yes') { page.clickYes(); return done(res, page.output, '/company'); }
    if (req.body.step === 'no') { page.clickNo(); return done(res, page.output, '/company'); }   // cancelDeletion()
    // first click -> show the profile with the "Delete?" pop-up
    showCompany(res, { confirm: view.confirmModal(page.output.message, '/company/delete', {}) });
});

// US17 Search Company Profile: displaySearchOption -> enterSearchKeyword -> displaySearchResults / displayNoResults
app.get('/companies', DESIGNER, (req, res) => {
    // create the Search Company Profile page (US17)
    const page = new SearchCompanyProfilePage();
    // show the search box
    page.displaySearchOption();
    // no results yet, nothing picked, no message
    let results = null, selected = null, b = null;
    // a search was done ->
    if (req.query.q !== undefined) {
        // run the search with the typed keyword
        page.enterSearchKeyword(String(req.query.q));
        // if the page showed an error, show it as a message
        if (page.output.type === 'error') b = page.output;
        // found some -> show them
        else results = page.results;
        // find the company that was clicked in the results
        const pick = page.results.find(c => c.companyId === toInt(req.query.pick));
        if (pick) {                                            // designer selects a company profile
            // the actor picks it
            page.selectCompanyProfile(pick);
            // its details are shown
            selected = page.output.data;
        }
    }
    // show the search page with the results / selected company
    render(res, view.companySearch({ session: Session, keyword: req.query.q ?? '', results, selected, banner: b }));
});

// =====================================================================================
// Customer - view IDP (US31), save (US32), saved list (US33, US34)
// =====================================================================================
// a customer opens one IDP
app.get('/idps/:id', CUSTOMER, (req, res) => {
    // the IDP ID, and the View IDP page (US31)
    const idpId = toInt(req.params.id), page = new ViewIDPPage();
    page.selectIDP(idpId);                                     // US31 View IDP: selectIDP(idpId)
    // not found -> back to the dashboard with the message
    if (page.output.type !== 'data') return done(res, page.output, '/dashboard');
    if (!takeFlashPeek()) { IDPViewRecord.recordView(idpId, Session.userId); db.saveSoon(); }   // counts towards US37 "View IDP Views"
    // show the IDP...
    render(res, view.idpView({ session: Session, idp: page.output.data, categories: IDPCategory.getAllCategories(),
        // ...and the Save button if the Save IDP story is in this sprint
        banner: takeFlash(), canSave: HAS_SAVE }));
});
// Peek at the flash without clearing it (so the redirect after "Save" does not count as a new view)
function takeFlashPeek() { return Session.flash ?? null; }
// is the Save IDP story (US32) in this sprint? not yet...
let HAS_SAVE = false;


// =====================================================================================
// Platform Manager - IDP categories (US40-43)
// =====================================================================================
// helper: how many IDPs each category has, as { categoryId: count }
const idpCounts = () => IDP.getAllIDPs().reduce((m, i) => ({ ...m, [i.categoryId]: (m[i.categoryId] ?? 0) + 1 }), {});

// Category list (UI support) / US43 Search IDP Category: enterKeyword -> clickSearch
app.get('/categories', MANAGER, (req, res) => {
    // all categories, any message, no search yet
    let categories = IDPCategory.getAllCategories(), b = takeFlash(), search = null;
    // a search was done ->
    if (req.query.q !== undefined) {
        // the search text
        search = String(req.query.q);
        // create the Search IDP Category page (US43)
        const page = new SearchIDPCategoryPage();
        // the actor types the keyword
        page.enterKeyword(search);
        // and clicks Search
        page.clickSearch();
        // show the results (or nothing)
        categories = page.output.type === 'data' ? page.results : [];
        // if the page showed an error, show it as a message
        if (page.output.type === 'error') b = page.output;
    }
    // show the list with the IDP counts
    render(res, view.categoryList({ session: Session, categories, counts: idpCounts(), search, banner: b }));
});

// US40 View IDP Category: selectCategory(categoryId)
function showCategory(res, categoryId, extra = {}) {
    // create the View IDP Category page (US40)
    const page = new ViewIDPCategoryPage();
    // the actor picks this category
    page.selectCategory(categoryId);
    // not found -> back to the list with the message
    if (page.output.type !== 'data') return done(res, page.output, '/categories');
    // show the details...
    render(res, view.categoryDetail({ session: Session, category: page.output.data,
        // ...how many IDPs use it, and any message or pop-up
        idpCount: idpCounts()[categoryId] ?? 0, banner: extra.banner ?? takeFlash(), confirm: extra.confirm }));
}
// open one category (ID from the address)
app.get('/categories/:id', MANAGER, (req, res) => showCategory(res, toInt(req.params.id)));

// US41 Update IDP Category: clickUpdate(categoryID) -> updateCategory(...)
app.get('/categories/:id/edit', MANAGER, (req, res) => {
    // the category ID, and the Update IDP Category page (US41)
    const categoryId = toInt(req.params.id), page = new UpdateIDPCategoryPage();
    // the actor clicks Update for this category
    page.clickUpdate(categoryId);
    // not found -> back to the list with the message
    if (page.output.type !== 'form') return done(res, page.output, '/categories');
    // show the form filled in with the current values
    render(res, view.updateIDPCategory({ session: Session, categoryId, values: page.category }));
});
// the Update Category form was submitted
app.post('/categories/:id/edit', MANAGER, (req, res) => {
    // the category ID, and the Update IDP Category page (US41)
    const categoryId = toInt(req.params.id), page = new UpdateIDPCategoryPage();
    // the actor clicks Update for this category
    page.clickUpdate(categoryId);
    // not found -> back to the list with the message
    if (page.output.type !== 'form') return done(res, page.output, '/categories');
    // pass the typed values to the page
    page.updateCategory(categoryId, req.body.categoryName, req.body.categoryDescription);
    // updated -> back to the category page with the message
    if (page.output.type === 'success') return done(res, page.output, `/categories/${categoryId}`);
    // not updated -> show the form again with the message
    render(res, view.updateIDPCategory({ session: Session, categoryId, values: req.body, banner: page.output }));
});

// US42 Delete IDP Category: clickDelete -> displayConfirmation -> confirmDelete / cancelDelete
app.post('/categories/:id/delete', MANAGER, (req, res) => {
    // the category ID, and the Delete IDP Category page (US42)
    const categoryId = toInt(req.params.id), page = new DeleteIDPCategoryPage();
    // the actor clicks Delete
    page.clickDelete(categoryId);
    // "Yes" ->
    if (req.body.step === 'yes') {
        // "Yes" -> confirm the delete
        page.confirmDelete(categoryId);
        // deleted -> back to the list; failed -> back to the category, with the message
        return done(res, page.output, page.output.type === 'success' ? '/categories' : `/categories/${categoryId}`);
    }
    // "No" -> cancel and go back to the category
    if (req.body.step === 'no') { page.cancelDelete(); return done(res, page.output, `/categories/${categoryId}`); }
    // first click -> show the category with the "Delete?" pop-up
    showCategory(res, categoryId, { confirm: view.confirmModal(page.output.message, `/categories/${categoryId}/delete`, {}) });
});


// Unknown pages
app.use((req, res) => res.redirect(Session.userId == null ? '/login' : '/dashboard'));

// the port to listen on: Render sets PORT; 3000 when running on your own computer
const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => console.log(`ID Platform running at http://localhost:${PORT}`));

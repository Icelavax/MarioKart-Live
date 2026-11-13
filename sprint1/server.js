// ==========================================================================
// PRESENTATION NOTE
// server.js - Express web server
//
// What to say: The server only connects web routes to Boundary methods: it puts the form input
//              into the page, calls the BCE methods in the order of the sequence diagram, and
//              shows page.output. There is no business logic here.
//
// Q: Where is the HTML?
// A: web/views.js builds each page as HTML on the server (server-side rendering). Right-click >
//    View Page Source on the live site shows it.
// ==========================================================================

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


// Unknown pages
app.use((req, res) => res.redirect(Session.userId == null ? '/login' : '/dashboard'));

// the port to listen on: Render sets PORT; 3000 when running on your own computer
const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => console.log(`ID Platform running at http://localhost:${PORT}`));

// Sprint 1 web UI. Run:  npm install  then  npm start  ->  http://localhost:3000
//
// Each route only (1) puts the user's input into a <<Boundary>> page,
// (2) calls the BCE method from the sequence diagram, and (3) shows page.output.
// All logic stays in boundary -> control -> entity.
import express from 'express';
import { fileURLToPath } from 'node:url';
import { seed } from './database/seed.js';
import { loadDemoData } from './database/demoData.js';
import { Session, Role, newSessionData, runWithSession } from './boundary/Session.js';
import { randomUUID } from 'node:crypto';
import UserProfile from './entity/UserProfile.js';
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

seed();
loadDemoData();

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

// One-time message shown on the next screen (e.g. "Account created"), kept per browser
const setFlash = msg => { Session.flash = msg; };
const takeFlash = () => { const f = Session.flash ?? null; Session.flash = null; return f; };
const toInt = v => (v === undefined || v === '' ? null : Number.parseInt(v, 10));
const loginProfiles = () => UserProfile.getAllProfiles().filter(p => LOGIN_PAGES[p.profileId]);

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
const render = (res, html) => res.type('html').send(html);
const dashboard = (res, banner) => render(res, view.dashboard({
    session: Session, banner, idps: IDP.getAllIDPs(), categories: IDPCategory.getAllCategories(),
}));
function success(res, page) { setFlash(page.output); res.redirect('/dashboard'); }

// ---------------- Login / Logout (US11, US18, US35, US47 / US12, US19, US36, US48) ----------------
app.get('/', (req, res) => res.redirect(Session.userId == null ? '/login' : '/dashboard'));

app.get('/login', (req, res) => {
    if (Session.userId != null) return res.redirect('/dashboard');
    render(res, view.login({ profiles: loginProfiles(), banner: takeFlash() }));
});

app.post('/login', (req, res) => {
    const profileId = toInt(req.body.profileId);
    const LoginPage = LOGIN_PAGES[profileId];
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

app.get('/dashboard', requireRole(), (req, res) => dashboard(res, takeFlash()));

// ---------------- US1 Create User Account (User Admin) ----------------
app.get('/user-accounts/new', requireRole(Role.USER_ADMIN), (req, res) => {
    new CreateUserAccountPage().displayCreationForm();         // +displayCreationForm()
    render(res, view.createUserAccount({ session: Session, profiles: UserProfile.getAllProfiles() }));
});
app.post('/user-accounts/new', requireRole(Role.USER_ADMIN), (req, res) => {
    const b = req.body, page = new CreateUserAccountPage();
    page.submitForm(b.username, b.email, b.password, b.fullName, b.contactNumber, toInt(b.profileId));
    if (page.output.type === 'success') return success(res, page);
    render(res, view.createUserAccount({ session: Session, profiles: UserProfile.getAllProfiles(),
        values: b, banner: page.output }));
});

// ---------------- US6 Create User Profile (User Admin) ----------------
app.get('/user-profiles/new', requireRole(Role.USER_ADMIN), (req, res) => {
    new CreateUserProfilePage().displayCreationForm();
    render(res, view.createUserProfile({ session: Session }));
});
app.post('/user-profiles/new', requireRole(Role.USER_ADMIN), (req, res) => {
    const page = new CreateUserProfilePage();
    page.submitForm(req.body.profileName, req.body.description);
    if (page.output.type === 'success') return success(res, page);
    render(res, view.createUserProfile({ session: Session, values: req.body, banner: page.output }));
});

// ---------------- US13 Create Company Profile (Interior Designer) ----------------
app.get('/company-profile/new', requireRole(Role.INTERIOR_DESIGNER), (req, res) => {
    new CreateCompanyProfilePage().displayCreationForm();
    render(res, view.createCompanyProfile({ session: Session }));
});
app.post('/company-profile/new', requireRole(Role.INTERIOR_DESIGNER), (req, res) => {
    const b = req.body, page = new CreateCompanyProfilePage();
    page.submitForm(b.companyName, b.registrationNumber, b.companyDescription, b.contactEmail, b.contactNumber);
    if (page.output.type === 'success') return success(res, page);
    render(res, view.createCompanyProfile({ session: Session, values: b, banner: page.output }));
});

// ---------------- US20 Create Current IDP (Interior Designer) ----------------
app.get('/idps/new', requireRole(Role.INTERIOR_DESIGNER), (req, res) => {
    render(res, view.createCurrentIDP({ session: Session, categories: IDPCategory.getAllCategories() }));
});
app.post('/idps/new', requireRole(Role.INTERIOR_DESIGNER), (req, res) => {
    const page = new CreateCurrentIDPPage();
    page.form = { categoryId: toInt(req.body.categoryId), title: req.body.title ?? '',
                  description: req.body.description ?? '' };
    page.displayCreateForm();       // US20 sequence: displayCreateForm -> captureIDPDetails -> validateInput -> createIDP
    if (page.output.type === 'success') return success(res, page);
    render(res, view.createCurrentIDP({ session: Session, categories: IDPCategory.getAllCategories(),
        values: req.body, banner: page.output }));
});

// ---------------- US39 Create IDP Category (Platform Manager) ----------------
app.get('/idp-categories/new', requireRole(Role.PLATFORM_MANAGER), (req, res) => {
    render(res, view.createIDPCategory({ session: Session }));
});
app.post('/idp-categories/new', requireRole(Role.PLATFORM_MANAGER), (req, res) => {
    const page = new CreateIDPCategoryPage();
    page.form = { categoryName: req.body.categoryName ?? '', categoryDescription: req.body.categoryDescription ?? '' };
    page.clickCreate();                                        // +clickCreate()
    if (page.output.type === 'success') return success(res, page);
    render(res, view.createIDPCategory({ session: Session, values: req.body, banner: page.output }));
});

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => console.log(`ID Platform (Sprint 1) running at http://localhost:${PORT}`));

// ==========================================================================
// PRESENTATION NOTE
// web/views.js - HTML for every screen
//
// What to say: Each function returns the HTML for one screen. Views only display data; they never
//              change it. The role-based navigation tabs come from the logged-in user's profile.
//
// Q: Why not React?
// A: The assignment focus is the BCE design. Server-rendered pages keep the UI simple and keep
//    all logic in boundary, control and entity.
// ==========================================================================

// HTML for each screen. Sprint 1 screens follow the Sprint 1 wireframes; later screens reuse
// the same look. Views only display data - no business logic here.
import { Role } from '../boundary/Session.js';
import { has } from './stories.js';

const esc = v => String(v ?? '').replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmtDate = v => {
    if (!v) return '';
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? esc(v)
        : d.toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' });
};

function layout(title, body) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} · ID Platform</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="/style.css">
</head>
<body>
${body}
</body>
</html>`;
}

// What a page.output looks like as a message bar (forms / data / confirm are shown elsewhere)
export function banner(b) {
    if (!b || !b.message || ['form', 'data', 'confirm'].includes(b.type)) return '';
    const ok = b.type === 'success';
    const info = b.type === 'message' || b.type === 'info';
    const cls = ok ? 'banner-ok' : info ? 'banner-info' : 'banner-err';
    return `<p class="banner ${cls}" role="${ok || info ? 'status' : 'alert'}">${ok ? '✓ ' : ''}${esc(b.message)}</p>`;
}

// ---------- header: account menu, role navigation, "+" create menu ----------
const CREATE_MENU = {
    [Role.USER_ADMIN]: [['Create User Account', '/user-accounts/new'], ['Create User Profile', '/user-profiles/new']],
    [Role.INTERIOR_DESIGNER]: [['Create Company Profile', '/company-profile/new'], ['Create Current IDP', '/idps/new']],
    [Role.PLATFORM_MANAGER]: [['Create IDP Category', '/idp-categories/new']],
    [Role.CUSTOMER]: [],
};
// Navigation links appear only once the story behind them is in this sprint
const NAV = {
    [Role.USER_ADMIN]: [['User Accounts', '/accounts', 'US2'], ['User Profiles', '/profiles', 'US7']],
    [Role.INTERIOR_DESIGNER]: [['My IDPs', '/my-idps', 'US21'], ['Company Profile', '/company', 'US14'],
                               ['Search Companies', '/companies', 'US17']],
    [Role.CUSTOMER]: [['Browse IDPs', '/dashboard', 'US31'], ['Saved IDPs', '/saved', 'US33']],
    [Role.PLATFORM_MANAGER]: [['IDP Categories', '/categories', 'US40'], ['Reports', '/reports', 'US44']],
};

const ROLE_NAME = { [Role.USER_ADMIN]: 'User Admin', [Role.INTERIOR_DESIGNER]: 'Interior Designer',
                    [Role.CUSTOMER]: 'Customer', [Role.PLATFORM_MANAGER]: 'Platform Manager' };
const initials = name => String(name ?? '').trim().split(/\s+/).filter(Boolean).slice(0, 2)
    .map(w => w[0].toUpperCase()).join('') || '?';

function header(session, current) {
    const items = CREATE_MENU[session.profileId] ?? [];
    let create = '';
    if (items.length === 1) {
        create = `<a class="plus" href="${items[0][1]}" aria-label="${items[0][0]}" title="${items[0][0]}">+</a>`;
    } else if (items.length > 1) {
        create = `<details class="menu menu-right">
  <summary class="plus" aria-label="Create">+<span class="caret">▾</span></summary>
  <div class="menu-list">${items.map(([label, href]) => `<a href="${href}">${label}</a>`).join('')}</div>
</details>`;
    }
    const links = (NAV[session.profileId] ?? []).filter(([, , us]) => has(us));
    const nav = links.length
        ? `<nav class="nav"><a href="/dashboard"${current === '/dashboard' ? ' aria-current="page"' : ''}>Home</a>${links
            .filter(([, href]) => href !== '/dashboard')
            .map(([label, href]) => `<a href="${href}"${current === href ? ' aria-current="page"' : ''}>${label}</a>`).join('')}</nav>`
        : '';
    return `<header class="topbar">
  <details class="menu">
    <summary class="avatar" aria-label="Account menu"><span aria-hidden="true">${esc(initials(session.fullName))}</span></summary>
    <div class="menu-list"><p class="menu-who">${esc(session.fullName)}<span>${esc(ROLE_NAME[session.profileId] ?? '')}</span></p><form method="post" action="/logout"><button type="submit">Logout?</button></form></div>
  </details>
  <span class="welcome">Welcome, <strong>${esc(session.fullName)}</strong></span>
  ${nav}
  ${create}
</header>`;
}

// A normal page: header + optional message bar + content
function page(session, title, current, content, b) {
    return layout(title, `${header(session, current)}
<main class="wrap">
  ${banner(b)}
  ${content}
</main>`);
}

// ---------- small building blocks ----------
const button = (label, action, { method = 'post', fields = {}, style = '' } = {}) =>
    method === 'get'
        ? `<a class="btn ${style}" href="${action}">${esc(label)}</a>`
        : `<form method="post" action="${action}" class="inline">${Object.entries(fields)
            .map(([k, v]) => `<input type="hidden" name="${k}" value="${esc(v)}">`).join('')}<button type="submit" class="btn ${style}">${esc(label)}</button></form>`;

function details(rows) {
    return `<dl class="details">${rows.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${v === '' || v == null ? '<span class="muted">—</span>' : v}</dd>`).join('')}</dl>`;
}

function table(columns, rows, emptyText) {
    if (!rows.length) return `<p class="empty">${esc(emptyText)}</p>`;
    return `<div class="table-wrap"><table>
<thead><tr>${columns.map(c => `<th>${esc(c)}</th>`).join('')}</tr></thead>
<tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody>
</table></div>`;
}

const searchBar = (action, name, value, placeholder, extra = '', active = false) => `<form class="search" method="get" action="${action}" role="search">
  <input name="${name}" value="${esc(value)}" placeholder="${esc(placeholder)}" aria-label="${esc(placeholder)}">
  ${extra}
  <button type="submit" class="btn">Search</button>
  ${value || active ? `<a href="${action}">Clear</a>` : ''}
</form>`;

const status = s => `<span class="pill pill-${String(s).toLowerCase()}">${esc(s)}</span>`;

// Confirmation pop-up (displayConfirmation) over the current screen. Yes / No post back with step=yes|no
function confirmModal(message, action, fields) {
    const hidden = Object.entries(fields).map(([k, v]) => `<input type="hidden" name="${k}" value="${esc(v)}">`).join('');
    return `<div class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="confirm-msg">
  <div class="modal">
    <p id="confirm-msg">${esc(message)}</p>
    <div class="modal-actions">
      <form method="post" action="${action}">${hidden}<input type="hidden" name="step" value="no"><button type="submit" class="btn">No</button></form>
      <form method="post" action="${action}">${hidden}<input type="hidden" name="step" value="yes"><button type="submit" class="btn btn-primary">Yes</button></form>
    </div>
  </div>
</div>`;
}

// ---------- form helpers ----------
const input = (label, name, values, ph, type = 'text', extra = '') =>
    `<label>${label} <input name="${name}" type="${type}" value="${type === 'password' ? '' : esc(values[name])}" placeholder="${ph}" ${extra}></label>`;
const area = (label, name, values, ph) =>
    `<label>${label} <textarea name="${name}" rows="4" placeholder="${ph}">${esc(values[name])}</textarea></label>`;
const select = (label, name, values, ph, options, required = true) => {
    const sel = String(values[name] ?? '');
    return `<label>${label} <select name="${name}"${required ? ' required' : ''}>
      <option value=""${required ? ' disabled' : ''} ${sel ? '' : 'selected'}>${ph}</option>
      ${options.map(([v, t]) => `<option value="${v}" ${String(v) === sel ? 'selected' : ''}>${esc(t)}</option>`).join('')}
    </select></label>`;
};

function formCard(session, title, action, fields, b, { submit = 'Create', cancel = '/dashboard', hidden = {}, after = '' } = {}) {
    const h = Object.entries(hidden).map(([k, v]) => `<input type="hidden" name="${k}" value="${esc(v)}">`).join('');
    return layout(title, `${header(session)}
<main class="center">
  <form class="card form" method="post" action="${action}">
    <h1>${esc(title)}</h1>
    ${banner(b)}
    ${h}
    ${fields}
    <div class="actions"><a href="${cancel}">Cancel</a><button type="submit">${submit}</button></div>
  </form>
</main>
${after}`);
}

// ================= Sprint 1 screens =================
export function login({ profiles, values = {}, banner: b }) {
    const sel = String(values.profileId ?? '');
    return layout('Login', `
<main class="center">
  <form class="card login" method="post" action="/login">
    ${banner(b)}
    <h1>Welcome to ID Platform</h1>
    <label>User Profile
      <select name="profileId" required>
        <option value="" disabled ${sel ? '' : 'selected'}>click to select user profile</option>
        ${profiles.map(p => `<option value="${p.profileId}" ${String(p.profileId) === sel ? 'selected' : ''}>${esc(p.profileName)}</option>`).join('')}
      </select>
    </label>
    <label>Username <input name="username" value="${esc(values.username)}" placeholder="enter your username here" autocomplete="username" required></label>
    <label>Password <input name="password" type="password" placeholder="enter your password here" autocomplete="current-password" required></label>
    <button type="submit">Login</button>
  </form>
</main>`);
}

// Dashboard = IDP tiles (wireframe). Customers can search (US30) and open an IDP (US31).
export function dashboard({ session, banner: b, idps, categories, search }) {
    const catName = id => categories.find(c => c.categoryId === id)?.categoryName ?? '';
    const isCustomer = session.profileId === Role.CUSTOMER;
    const clickable = isCustomer && has('US31');
    const tiles = idps.length
        ? idps.map(i => {
            const inner = `<div class="thumb" style="--h:${(i.idpId * 47) % 360}" aria-hidden="true"></div>
      <h2>${esc(i.title)}</h2>
      <p>${esc(catName(i.categoryId))}</p>`;
            return `<article class="tile">${clickable ? `<a href="/idps/${i.idpId}">${inner}</a>` : inner}</article>`;
        }).join('')
        : `<p class="empty">${search ? 'No results found' : 'No interior design projects yet.'}</p>`;
    const bar = isCustomer && has('US30')
        ? `<div class="wrap wrap-tight">${searchBar('/dashboard', 'q', search ?? '', 'Search IDPs by title, style or description', '', search != null)}</div>` : '';
    return layout('Dashboard', `${header(session, '/dashboard')}
${b && banner(b) ? `<div class="wrap wrap-tight">${banner(b)}</div>` : ''}
${bar}
<main class="grid">${tiles}</main>`);
}

// US1
export const createUserAccount = ({ session, profiles, values = {}, banner: b }) =>
    formCard(session, 'Create User Account', '/user-accounts/new',
        input('Username', 'username', values, 'enter the username here') +
        input('Email', 'email', values, 'enter the email here', 'email') +
        input('Password', 'password', values, 'at least 6 characters', 'password', 'autocomplete="new-password"') +
        input('Full name', 'fullName', values, 'enter the full name here') +
        input('Contact number', 'contactNumber', values, 'enter the contact number here', 'tel') +
        select('User Profile', 'profileId', values, 'click to select user profile',
            profiles.map(p => [p.profileId, p.profileName])), b);

// US6
export const createUserProfile = ({ session, values = {}, banner: b }) =>
    formCard(session, 'Create User Profile', '/user-profiles/new',
        input('User Profile Name', 'profileName', values, 'enter user profile name here') +
        area('Description', 'description', values, 'enter description for this user profile'), b);

// US13
const companyFields = values =>
    input('Company name', 'companyName', values, 'enter your company name here') +
    input('Company registration number', 'registrationNumber', values, 'enter your company registration no. here') +
    area('Company description', 'companyDescription', values, 'enter your company description here') +
    input('Company contact email', 'contactEmail', values, 'enter your company email here', 'email') +
    input('Company contact number', 'contactNumber', values, 'enter your company number here', 'tel');
export const createCompanyProfile = ({ session, values = {}, banner: b }) =>
    formCard(session, 'Create Company Profile', '/company-profile/new', companyFields(values), b);

// US20
export const createCurrentIDP = ({ session, categories, values = {}, banner: b }) =>
    formCard(session, 'Create Current Interior Design Project', '/idps/new',
        select('Category', 'categoryId', values, 'select your project category',
            categories.map(c => [c.categoryId, c.categoryName])) +
        input('Project title', 'title', values, 'enter your project title here') +
        area('Project description', 'description', values, 'enter your project description here'), b);

// US39
export const createIDPCategory = ({ session, values = {}, banner: b }) =>
    formCard(session, 'Create IDP Category', '/idp-categories/new',
        input('Category name', 'categoryName', values, 'enter your category name here') +
        area('Category description', 'categoryDescription', values, 'enter your category description here'), b);

// ================= User Admin: accounts (US2, US3, US4, US5) =================
export function accountList({ session, accounts, profiles, search, banner: b }) {
    const profileName = id => profiles.find(p => p.profileId === id)?.profileName ?? `#${id}`;
    const rows = accounts.map(a => [
        String(a.userId),
        `<a href="/accounts/${a.userId}">${esc(a.fullName)}</a>`,
        esc(a.email), esc(profileName(a.profileId)), status(a.accountStatus)]);
    return page(session, 'User Accounts', '/accounts', `
<div class="page-head"><h1>User Accounts</h1>${button('+ New account', '/user-accounts/new', { method: 'get' })}</div>
${has('US5') ? searchBar('/accounts', 'q', search ?? '', 'Search by full name, user ID or email') : ''}
${table(['ID', 'Full name', 'Email', 'Profile', 'Status'], rows, search != null ? 'No matching user accounts found' : 'No user accounts yet')}`, b);
}

export function accountDetail({ session, account, profiles, banner: b, confirm }) {
    const profileName = profiles.find(p => p.profileId === account.profileId)?.profileName ?? '';
    const actions = [
        has('US3') ? button('Update Account', `/accounts/${account.userId}/edit`, { method: 'get' }) : '',
        has('US4') && account.accountStatus !== 'Suspended'
            ? button('Suspend User Account', `/accounts/${account.userId}/suspend`, { fields: { step: 'ask' }, style: 'btn-danger' }) : '',
        has('US4') && account.accountStatus === 'Suspended'
            ? button('Unsuspend User Account', `/accounts/${account.userId}/unsuspend`, { fields: { step: 'ask' }, style: 'btn-success' }) : '',
    ].join('');
    return page(session, 'User Account', '/accounts', `
<p class="crumbs"><a href="/accounts">← User Accounts</a></p>
<section class="card wide">
  <h1>${esc(account.fullName)}</h1>
  ${details([['User ID', esc(account.userId)], ['Username', esc(account.username)], ['Email', esc(account.email)],
             ['Contact number', esc(account.contactNumber)], ['User profile', esc(profileName)],
             ['Account status', status(account.accountStatus)], ['Created', fmtDate(account.createdAt)]])}
  <div class="actions left">${actions}</div>
</section>
${confirm ?? ''}`, b);
}

export const updateUserAccount = ({ session, userId, values = {}, banner: b, confirm }) =>
    formCard(session, 'Update User Account', `/accounts/${userId}/edit`,
        input('Full name', 'fullName', values, 'enter the full name here') +
        input('Email', 'email', values, 'enter the email here', 'email') +
        input('Contact number', 'contactNumber', values, 'enter the contact number here', 'tel'),
        b, { submit: 'Save Changes', cancel: `/accounts/${userId}`, hidden: { step: 'save' }, after: confirm ?? '' });

// ================= User Admin: profiles (US7, US8, US9, US10) =================
export function profileList({ session, profiles, counts, search, banner: b }) {
    const rows = profiles.map(p => [
        `<a href="/profiles/${p.profileId}">${esc(p.profileName)}</a>`, esc(p.description), status(p.profileStatus),
        String(counts[p.profileId] ?? 0)]);
    return page(session, 'User Profiles', '/profiles', `
<div class="page-head"><h1>User Profiles</h1>${button('+ New profile', '/user-profiles/new', { method: 'get' })}</div>
${has('US10') ? searchBar('/profiles', 'q', search ?? '', 'Search by profile name') : ''}
${table(['Profile name', 'Description', 'Status', 'Accounts'], rows, search != null ? 'No matching user profiles found' : 'No user profiles yet')}`, b);
}

export function profileDetail({ session, profile, accountCount, banner: b, confirm }) {
    const actions = [
        has('US8') ? button('Update Profile', `/profiles/${profile.profileId}/edit`, { method: 'get' }) : '',
        has('US9') ? button('Delete User Profile', `/profiles/${profile.profileId}/delete`, { fields: { step: 'ask' }, style: 'btn-danger' }) : '',
    ].join('');
    return page(session, 'User Profile', '/profiles', `
<p class="crumbs"><a href="/profiles">← User Profiles</a></p>
<section class="card wide">
  <h1>${esc(profile.profileName)}</h1>
  ${details([['Profile name', esc(profile.profileName)], ['Description', esc(profile.description)],
             ['Status', status(profile.profileStatus)], ['Created', fmtDate(profile.createdAt)],
             ['Accounts using it', String(accountCount)]])}
  <div class="actions left">${actions}</div>
</section>
${confirm ?? ''}`, b);
}

export const updateUserProfile = ({ session, profileId, values = {}, banner: b, confirm }) =>
    formCard(session, 'Update User Profile', `/profiles/${profileId}/edit`,
        input('User Profile Name', 'profileName', values, 'enter user profile name here') +
        area('Description', 'description', values, 'enter description for this user profile'),
        b, { submit: 'Save Changes', cancel: `/profiles/${profileId}`, hidden: { step: 'save' }, after: confirm ?? '' });

// ================= Interior Designer: IDPs (US21-27, US37, US38) =================
export function myIDPs({ session, idps, categories, search, banner: b }) {
    const catName = id => categories.find(c => c.categoryId === id)?.categoryName ?? '';
    const row = i => [`<a href="/my-idps/${i.idpId}">${esc(i.title)}</a>`, esc(catName(i.categoryId)),
        esc(i.designStyle), status(i.projectStatus), fmtDate(i.updatedAt)];
    const current = idps.filter(i => i.projectStatus === 'Current');
    const past = idps.filter(i => i.projectStatus === 'Past');
    const catSelect = scope => `<select name="categoryId" aria-label="Category"><option value="">All categories</option>${categories
        .map(c => `<option value="${c.categoryId}"${search?.scope === scope && String(search?.categoryId ?? '') === String(c.categoryId) ? ' selected' : ''}>${esc(c.categoryName)}</option>`).join('')}</select>`;
    const searching = search != null;
    const kw = scope => (search?.scope === scope ? search.keyword : '');
    const pastSearch = has('US29')
        ? searchBar('/my-idps', 'q', kw('past'), 'Search past IDPs (title, description, style)',
            `<input type="hidden" name="scope" value="past">${catSelect('past')}`, search?.scope === 'past') : '';
    return page(session, 'My IDPs', '/my-idps', `
<div class="page-head"><h1>My IDPs</h1>${button('+ New IDP', '/idps/new', { method: 'get' })}</div>
${has('US24') ? `<h2>Search current IDPs</h2>${searchBar('/my-idps', 'q', kw('current'), 'Keyword (title, description, style)', catSelect('current'), search?.scope === 'current')}` : ''}
${searching
        ? `<h2>Search results (${search.scope} IDPs)</h2>${table(['Title', 'Category', 'Design style', 'Status', 'Updated'], idps.map(row), `No matching ${search.scope} IDPs found`)}
           ${search.scope === 'current' && has('US29') ? `<h2>Search past IDPs</h2>${pastSearch}` : ''}`
        : `<h2>Current IDPs</h2>${table(['Title', 'Category', 'Design style', 'Status', 'Updated'], current.map(row), 'No current IDPs')}
           ${has('US26') ? `<h2>Past IDPs</h2>${pastSearch}${table(['Title', 'Category', 'Design style', 'Status', 'Updated'], past.map(row), 'No past IDPs')}` : ''}`}`, b);
}

export function idpDetail({ session, idp, categories, banner: b, confirm, stat }) {
    const catName = categories.find(c => c.categoryId === idp.categoryId)?.categoryName ?? '';
    const isCurrent = idp.projectStatus === 'Current';
    const actions = [
        (isCurrent ? has('US22') : has('US27')) ? button('Update IDP', `/my-idps/${idp.idpId}/edit`, { method: 'get' }) : '',
        isCurrent && has('US25') ? button('Update Status', `/my-idps/${idp.idpId}/status`, { method: 'get' }) : '',
        has('US37') ? button('View Views', `/my-idps/${idp.idpId}?show=views`, { method: 'get' }) : '',
        has('US38') ? button('View Shortlists', `/my-idps/${idp.idpId}?show=shortlists`, { method: 'get' }) : '',
        (isCurrent ? has('US23') : has('US28')) ? button('Delete IDP', `/my-idps/${idp.idpId}/delete`, { fields: { step: 'ask' }, style: 'btn-danger' }) : '',
    ].join('');
    return page(session, idp.title, '/my-idps', `
<p class="crumbs"><a href="/my-idps">← My IDPs</a></p>
<section class="card wide">
  <h1>${esc(idp.title)}</h1>
  ${stat ? `<p class="stat">${esc(stat)}</p>` : ''}
  ${details([['Description', esc(idp.description)], ['Design style', esc(idp.designStyle)], ['Category', esc(catName)],
             ['Project status', status(idp.projectStatus)], ['Created', fmtDate(idp.createdAt)], ['Last updated', fmtDate(idp.updatedAt)],
             ...(idp.completedAt ? [['Completed', fmtDate(idp.completedAt)]] : [])])}
  <div class="actions left">${actions}</div>
</section>
${confirm ?? ''}`, b);
}

export const updateIDP = ({ session, idpId, categories, values = {}, banner: b, past }) =>
    formCard(session, past ? 'Update Past IDP' : 'Update Current IDP', `/my-idps/${idpId}/edit`,
        select('Category', 'categoryId', values, 'select your project category', categories.map(c => [c.categoryId, c.categoryName])) +
        input('Project title', 'title', values, 'enter your project title here') +
        area('Project description', 'description', values, 'enter your project description here') +
        input('Design style', 'designStyle', values, 'e.g. Scandinavian, Industrial'),
        b, { submit: 'Save Changes', cancel: `/my-idps/${idpId}` });

export const updateIDPStatus = ({ session, idp, banner: b }) =>
    formCard(session, 'Update IDP Status', `/my-idps/${idp.idpId}/status`,
        `<p class="muted">${esc(idp.title)} is currently <strong>${esc(idp.projectStatus)}</strong>.</p>` +
        select('New status', 'status', { status: 'Past' }, 'choose a status', [['Past', 'Past (project completed)'], ['Current', 'Current']]),
        b, { submit: 'Update Status', cancel: `/my-idps/${idp.idpId}` });

// ================= Interior Designer: company profile (US14-17) =================
export function companyProfile({ session, profile, banner: b, confirm }) {
    if (!profile) {
        return page(session, 'Company Profile', '/company', `
<section class="card wide center-text">
  <h1>Company Profile</h1>
  <p class="empty">No company profile is available.</p>
  <div class="actions centered">${button('Create Company Profile', '/company-profile/new', { method: 'get' })}</div>
</section>`, b);
    }
    const actions = [
        has('US15') ? button('Update Profile', '/company/edit', { method: 'get' }) : '',
        has('US16') ? button('Delete Company Profile', '/company/delete', { fields: { step: 'ask' }, style: 'btn-danger' }) : '',
    ].join('');
    return page(session, 'Company Profile', '/company', `
<section class="card wide">
  <h1>${esc(profile.companyName)}</h1>
  ${companyDetails(profile)}
  <div class="actions left">${actions}</div>
</section>
${confirm ?? ''}`, b);
}
const companyDetails = c => details([['Company name', esc(c.companyName)], ['Registration number', esc(c.registrationNumber)],
    ['Description', esc(c.companyDescription)], ['Contact email', esc(c.contactEmail)], ['Contact number', esc(c.contactNumber)]]);

export const updateCompanyProfile = ({ session, values = {}, banner: b, confirm }) =>
    formCard(session, 'Update Company Profile', '/company/edit', companyFields(values),
        b, { submit: 'Save Changes', cancel: '/company', hidden: { step: 'save' }, after: confirm ?? '' });

export function companySearch({ session, keyword, results, selected, banner: b }) {
    const rows = (results ?? []).map(c => [
        `<a href="/companies?q=${encodeURIComponent(keyword)}&amp;pick=${c.companyId}">${esc(c.companyName)}</a>`,
        esc(c.registrationNumber), esc(c.contactEmail)]);
    return page(session, 'Search Companies', '/companies', `
<h1>Search Company Profiles</h1>
${searchBar('/companies', 'q', keyword ?? '', 'Company name or keyword')}
${results ? table(['Company', 'Registration no.', 'Email'], rows, 'No matching company profile found') : ''}
${selected ? `<section class="card wide"><h1>${esc(selected.companyName)}</h1>${companyDetails(selected)}</section>` : ''}`, b);
}

// ================= Customer (US31-34) =================
export function idpView({ session, idp, categories, banner: b, back = '/dashboard', canSave }) {
    const catName = categories.find(c => c.categoryId === idp.categoryId)?.categoryName ?? '';
    return page(session, idp.title, back, `
<p class="crumbs"><a href="${back}">← Back</a></p>
<section class="card wide idp-view">
  <div class="thumb big" style="--h:${(idp.idpId * 47) % 360}" aria-hidden="true"></div>
  <h1>${esc(idp.title)}</h1>
  ${details([['Description', esc(idp.description)], ['Design style', esc(idp.designStyle)], ['Category', esc(catName)],
             ['Project status', status(idp.projectStatus)]])}
  ${canSave ? `<div class="actions left">${button('Save', `/idps/${idp.idpId}/save`, { style: 'btn-primary' })}</div>` : ''}
</section>`, b);
}

export function savedList({ session, idps, categories, search, banner: b }) {
    const catName = id => categories.find(c => c.categoryId === id)?.categoryName ?? '';
    const rows = idps.map(i => [`<a href="/saved/${i.idpId}">${esc(i.title)}</a>`, esc(catName(i.categoryId)), esc(i.designStyle)]);
    return page(session, 'Saved IDPs', '/saved', `
<h1>Saved IDPs</h1>
${searchBar('/saved', 'q', search ?? '', 'Search saved IDPs by title')}
${table(['Title', 'Category', 'Design style'], rows, search != null ? 'No results found' : 'You have not saved any IDPs yet')}`, b);
}

// ================= Platform Manager (US40-46) =================
export function categoryList({ session, categories, counts, search, banner: b }) {
    const rows = categories.map(c => [`<a href="/categories/${c.categoryId}">${esc(c.categoryName)}</a>`,
        esc(c.categoryDescription), String(counts[c.categoryId] ?? 0)]);
    return page(session, 'IDP Categories', '/categories', `
<div class="page-head"><h1>IDP Categories</h1>${button('+ New category', '/idp-categories/new', { method: 'get' })}</div>
${has('US43') ? searchBar('/categories', 'q', search ?? '', 'Search by category name or keyword') : ''}
${table(['Category', 'Description', 'IDPs'], rows, search != null ? 'No categories found.' : 'No categories yet')}`, b);
}

export function categoryDetail({ session, category, idpCount, banner: b, confirm }) {
    const actions = [
        has('US41') ? button('Update', `/categories/${category.categoryId}/edit`, { method: 'get' }) : '',
        has('US42') ? button('Delete', `/categories/${category.categoryId}/delete`, { fields: { step: 'ask' }, style: 'btn-danger' }) : '',
    ].join('');
    return page(session, 'IDP Category', '/categories', `
<p class="crumbs"><a href="/categories">← IDP Categories</a></p>
<section class="card wide">
  <h1>${esc(category.categoryName)}</h1>
  ${details([['Category name', esc(category.categoryName)], ['Description', esc(category.categoryDescription)],
             ['IDPs in this category', String(idpCount)], ['Created', fmtDate(category.createdAt)]])}
  <div class="actions left">${actions}</div>
</section>
${confirm ?? ''}`, b);
}

export const updateIDPCategory = ({ session, categoryId, values = {}, banner: b }) =>
    formCard(session, 'Update IDP Category', `/categories/${categoryId}/edit`,
        input('Category name', 'categoryName', values, 'enter your category name here') +
        area('Category description', 'categoryDescription', values, 'enter your category description here'),
        b, { submit: 'Update', cancel: `/categories/${categoryId}` });

export function reports({ session, type, values = {}, report, banner: b }) {
    const tab = (t, label) => `<a href="/reports?type=${t}"${type === t ? ' aria-current="page"' : ''}>${label}</a>`;
    const fieldFor = {
        daily: `<label>Report date <input type="date" name="reportDate" value="${esc(values.reportDate)}" required></label>`,
        weekly: `<label>Any day in the report week <input type="date" name="reportWeek" value="${esc(values.reportWeek)}" required></label>`,
        monthly: `<label>Report month <input type="month" name="reportMonth" value="${esc(values.reportMonth)}" required></label>`,
    }[type];
    const r = report && `
<section class="card wide report">
  <div class="report-head"><h2>${esc(report.title)}</h2>
    <div class="report-actions">
      <a class="btn" href="/reports/download?type=${type}&amp;${Object.entries(values).map(([k, val]) => `${k}=${encodeURIComponent(val)}`).join('&amp;')}">Download CSV</a>
      <button type="button" class="btn" onclick="window.print()">Print / Save as PDF</button>
    </div>
  </div>
  <p class="muted">${fmtDate(report.periodStart)}${report.periodEnd && fmtDate(report.periodEnd) !== fmtDate(report.periodStart) ? ` – ${fmtDate(report.periodEnd)}` : ''}</p>
  <p class="big-number">${report.totalActivities}<span>total activities</span></p>
  ${details([['New user accounts', String(report.breakdown.accountsCreated)], ['New IDPs', String(report.breakdown.idpsCreated)],
             ['IDP views', String(report.breakdown.idpViews)], ['IDPs saved', String(report.breakdown.idpsSaved)]])}
</section>`;
    return page(session, 'Reports', '/reports', `
<h1>Report Management</h1>
<nav class="tabs">${[has('US44') && tab('daily', 'Daily Report'), has('US45') && tab('weekly', 'Weekly Report'),
        has('US46') && tab('monthly', 'Monthly Report')].filter(Boolean).join('')}</nav>
<form class="card wide report-form" method="get" action="/reports">
  <input type="hidden" name="type" value="${type}">
  ${fieldFor}
  <div class="actions left"><button type="submit" class="btn btn-primary" name="generate" value="1">Generate Report</button></div>
</form>
${r ?? ''}`, b);
}

export { confirmModal };

// HTML for each screen (layout follows the Sprint 1 wireframes).
// Views only display data - no business logic here.
import { Role } from '../boundary/Session.js';

const esc = v => String(v ?? '').replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function layout(title, body) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} · ID Platform</title>
<link rel="stylesheet" href="/style.css">
</head>
<body>
${body}
</body>
</html>`;
}

function banner(b) {
    if (!b || !b.message || b.type === 'form') return '';
    const ok = b.type === 'success';
    return `<p class="banner ${ok ? 'banner-ok' : 'banner-err'}" role="${ok ? 'status' : 'alert'}">${ok ? '✓ ' : ''}${esc(b.message)}</p>`;
}

// The "+" create menu differs per role (wireframes)
const CREATE_MENU = {
    [Role.USER_ADMIN]: [['Create User Account', '/user-accounts/new'], ['Create User Profile', '/user-profiles/new']],
    [Role.INTERIOR_DESIGNER]: [['Create Company Profile', '/company-profile/new'], ['Create Current IDP', '/idps/new']],
    [Role.PLATFORM_MANAGER]: [['Create IDP Category', '/idp-categories/new']],
    [Role.CUSTOMER]: [],
};

function header(session, b) {
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
    return `<header class="topbar">
  <details class="menu">
    <summary class="avatar" aria-label="Account menu"><span aria-hidden="true">●</span></summary>
    <div class="menu-list"><form method="post" action="/logout"><button type="submit">Logout?</button></form></div>
  </details>
  <span class="welcome">Welcome, ${esc(session.fullName)}</span>
  <span class="topbar-msg">${banner(b)}</span>
  ${create}
</header>`;
}

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

export function dashboard({ session, banner: b, idps, categories }) {
    const catName = id => categories.find(c => c.categoryId === id)?.categoryName ?? '';
    const tiles = idps.length
        ? idps.map(i => `<article class="tile">
      <div class="thumb" style="--h:${(i.idpId * 47) % 360}" aria-hidden="true"></div>
      <h2>${esc(i.title)}</h2>
      <p>${esc(catName(i.categoryId))}</p>
    </article>`).join('')
        : '<p class="empty">No interior design projects yet.</p>';
    return layout('Dashboard', `${header(session, b)}
<main class="grid">${tiles}</main>`);
}

function formPage(session, title, action, fields, b, submit = 'Create') {
    return layout(title, `${header(session)}
<main class="center">
  <form class="card form" method="post" action="${action}">
    <h1>${esc(title)}</h1>
    ${banner(b)}
    ${fields}
    <div class="actions"><a href="/dashboard">Cancel</a><button type="submit">${submit}</button></div>
  </form>
</main>`);
}
const input = (label, name, values, ph, type = 'text', extra = '') =>
    `<label>${label} <input name="${name}" type="${type}" value="${type === 'password' ? '' : esc(values[name])}" placeholder="${ph}" ${extra}></label>`;
const area = (label, name, values, ph) =>
    `<label>${label} <textarea name="${name}" rows="4" placeholder="${ph}">${esc(values[name])}</textarea></label>`;
const select = (label, name, values, ph, options) => {
    const sel = String(values[name] ?? '');
    return `<label>${label} <select name="${name}" required>
      <option value="" disabled ${sel ? '' : 'selected'}>${ph}</option>
      ${options.map(([v, t]) => `<option value="${v}" ${String(v) === sel ? 'selected' : ''}>${esc(t)}</option>`).join('')}
    </select></label>`;
};

// US1
export const createUserAccount = ({ session, profiles, values = {}, banner: b }) =>
    formPage(session, 'Create User Account', '/user-accounts/new',
        input('Username', 'username', values, 'enter the username here') +
        input('Email', 'email', values, 'enter the email here', 'email') +
        input('Password', 'password', values, 'at least 6 characters', 'password', 'autocomplete="new-password"') +
        input('Full name', 'fullName', values, 'enter the full name here') +
        input('Contact number', 'contactNumber', values, 'enter the contact number here', 'tel') +
        select('User Profile', 'profileId', values, 'click to select user profile',
            profiles.map(p => [p.profileId, p.profileName])), b);

// US6
export const createUserProfile = ({ session, values = {}, banner: b }) =>
    formPage(session, 'Create User Profile', '/user-profiles/new',
        input('User Profile Name', 'profileName', values, 'enter user profile name here') +
        area('Description', 'description', values, 'enter description for this user profile'), b);

// US13
export const createCompanyProfile = ({ session, values = {}, banner: b }) =>
    formPage(session, 'Create Company Profile', '/company-profile/new',
        input('Company name', 'companyName', values, 'enter your company name here') +
        input('Company registration number', 'registrationNumber', values, 'enter your company registration no. here') +
        area('Company description', 'companyDescription', values, 'enter your company description here') +
        input('Company contact email', 'contactEmail', values, 'enter your company email here', 'email') +
        input('Company contact number', 'contactNumber', values, 'enter your company number here', 'tel'), b);

// US20
export const createCurrentIDP = ({ session, categories, values = {}, banner: b }) =>
    formPage(session, 'Create Current Interior Design Project', '/idps/new',
        select('Category', 'categoryId', values, 'select your project category',
            categories.map(c => [c.categoryId, c.categoryName])) +
        input('Project title', 'title', values, 'enter your project title here') +
        area('Project description', 'description', values, 'enter your project description here'), b);

// US39
export const createIDPCategory = ({ session, values = {}, banner: b }) =>
    formPage(session, 'Create IDP Category', '/idp-categories/new',
        input('Category name', 'categoryName', values, 'enter your category name here') +
        area('Category description', 'categoryDescription', values, 'enter your category description here'), b);

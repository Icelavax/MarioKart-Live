// TDD tests for UserAccount.login()  (US11 / US18 / US35 / US47)
// Written BEFORE login() was implemented (Red phase), then kept unchanged
// through the Green and Refactor phases. Run with:  npm run test:tdd
import test from 'node:test';
import assert from 'node:assert/strict';
import UserAccount, { AccountStatus } from '../entity/UserAccount.js';

const CUSTOMER = 3, USER_ADMIN = 1;

// Fresh test accounts before every test, so the tests never depend on each other
test.beforeEach(() => {
    UserAccount.accounts.length = 0;
    new UserAccount().createUserAccount('alice', 'alice@example.com', 'secret1', 'Alice Tan', '91234567', CUSTOMER);
    new UserAccount().createUserAccount('ben', 'ben@example.com', 'secret2', 'Ben Lim', '', CUSTOMER);
    UserAccount.accounts.find(a => a.username === 'ben').accountStatus = AccountStatus.SUSPENDED;
});

test('Normal flow: correct username, password and role -> returns the account', () => {
    const account = new UserAccount().login('alice', 'secret1', CUSTOMER);
    assert.ok(account, 'login should return the account');
    assert.equal(account.username, 'alice');
});

test('Alternate flow: unknown username -> returns null', () => {
    assert.equal(new UserAccount().login('nobody', 'secret1', CUSTOMER), null);
});

test('Alternate flow: wrong password -> returns null', () => {
    assert.equal(new UserAccount().login('alice', 'wrong-password', CUSTOMER), null);
});

test('Alternate flow: suspended account -> returns null', () => {
    assert.equal(new UserAccount().login('ben', 'secret2', CUSTOMER), null);
});

test('Alternate flow: wrong role (Customer using the User Admin login) -> returns null', () => {
    assert.equal(new UserAccount().login('alice', 'secret1', USER_ADMIN), null);
});

test('Security: the real password is never stored, only its hash', () => {
    const account = UserAccount.accounts.find(a => a.username === 'alice');
    assert.notEqual(account.passwordHash, 'secret1');
    assert.equal(account.passwordHash, UserAccount.hash('secret1'));
});

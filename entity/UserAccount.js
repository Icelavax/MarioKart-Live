import { createHash } from 'node:crypto';

export const AccountStatus = Object.freeze({ ACTIVE: 'Active', SUSPENDED: 'Suspended' });

// <<Entity>> UserAccount
// The ONLY class that stores user accounts. In-memory for now - when the
// database is added, only change the inside of these methods.
export default class UserAccount {
    static accounts = [];

    userId; username; email; passwordHash; fullName; contactNumber;
    profileId; accountStatus; createdAt;

    // US1 +createUserAccount(username: String, email: String, password: String,
    //                        fullName: String, contactNumber: String, profileId: Integer): Boolean
    // false if details are invalid, or the username / email is already registered
    createUserAccount(username, email, password, fullName, contactNumber, profileId) {
        if (typeof username !== 'string' || username.trim().length < 3) return false;
        if (!UserAccount.isEmail(email)) return false;
        if (typeof password !== 'string' || password.length < 6) return false;
        if (typeof fullName !== 'string' || fullName.trim() === '') return false;
        if (!Number.isInteger(profileId)) return false;
        const taken = UserAccount.accounts.some(a =>
            a.username.toLowerCase() === username.trim().toLowerCase() ||
            a.email.toLowerCase() === email.trim().toLowerCase());
        if (taken) return false;

        const account = new UserAccount();
        account.userId = UserAccount.accounts.length + 1;
        account.username = username.trim();
        account.email = email.trim();
        account.passwordHash = UserAccount.hash(password);
        account.fullName = fullName.trim();
        account.contactNumber = contactNumber ?? '';
        account.profileId = profileId;
        account.accountStatus = AccountStatus.ACTIVE;
        account.createdAt = new Date().toISOString();
        UserAccount.accounts.push(account);
        return true;
    }

    // US11 / US18 / US35 / US47
    // +login(username: String, password: String, userProfile: Integer): UserAccount
    // null if the password is wrong, the account is not active,
    // or the account does not belong to the role of the login page used
    login(username, password, userProfile) {
        const account = UserAccount.accounts.find(a => a.username === username);
        if (!account) return null;
        if (account.passwordHash !== UserAccount.hash(password)) return null;
        if (account.accountStatus !== AccountStatus.ACTIVE) return null;
        if (account.profileId !== userProfile) return null;
        return account;
    }

    // Helpers (not in the BCE): password hashing and email format check
    static hash(password) {
        return createHash('sha256').update(String(password)).digest('hex');
    }
    static isEmail(email) {
        return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    }
}

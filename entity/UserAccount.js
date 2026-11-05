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
    // Field formats are validated by the boundary (CreateUserAccountPage) before this is called.
    // The entity only rejects what needs the stored data: username / email already registered.
    createUserAccount(username, email, password, fullName, contactNumber, profileId) {
        const taken = UserAccount.accounts.some(a =>
            a.username.toLowerCase() === String(username).toLowerCase() ||
            a.email.toLowerCase() === String(email).toLowerCase());
        if (taken) return false;

        const account = new UserAccount();
        account.userId = UserAccount.accounts.length + 1;
        account.username = username;
        account.email = email;
        account.passwordHash = UserAccount.hash(password);
        account.fullName = fullName;
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

    // US2 +viewUserAccount(userId: Integer): UserAccount
    viewUserAccount(userId) {
        return UserAccount.accounts.find(a => a.userId === userId) ?? null;
    }

    // US3 +updateUserAccount(userId: Integer, fullName: String, email: String,
    //                        contactNumber: String): Boolean
    // Field formats are validated by the boundary (UpdateUserAccountPage).
    // false if the account does not exist or the new email belongs to another account
    updateUserAccount(userId, fullName, email, contactNumber) {
        const account = this.viewUserAccount(userId);
        if (!account) return false;
        const emailTaken = UserAccount.accounts.some(a =>
            a.userId !== userId && a.email.toLowerCase() === String(email).toLowerCase());
        if (emailTaken) return false;

        account.fullName = fullName;
        account.email = email;
        account.contactNumber = contactNumber ?? '';
        return true;
    }

    // US4 +suspendUserAccount(userId: Integer): Boolean
    // false if the account does not exist or is already suspended
    suspendUserAccount(userId) {
        const account = UserAccount.accounts.find(a => a.userId === userId);
        if (!account || account.accountStatus === AccountStatus.SUSPENDED) return false;
        account.accountStatus = AccountStatus.SUSPENDED;
        return true;
    }

    // US5 +searchUserAccount(keyword: String): List<UserAccount>
    // Matches full name or email (contains), or user ID (exact). Keyword is checked by the boundary.
    searchUserAccount(keyword) {
        const k = (keyword ?? '').trim().toLowerCase();
        return UserAccount.accounts.filter(a =>
            a.fullName.toLowerCase().includes(k) ||
            a.email.toLowerCase().includes(k) ||
            String(a.userId) === k);
    }

    // US9 +findByProfileId(profileId: Integer): List<UserAccount>
    findByProfileId(profileId) {
        return UserAccount.accounts.filter(a => a.profileId === profileId);
    }

    // Helper (not in the BCE): password hashing
    static hash(password) {
        return createHash('sha256').update(String(password)).digest('hex');
    }

    // UI support (not a user story): fills the account list screen
    static getAllAccounts() { return [...UserAccount.accounts]; }
}

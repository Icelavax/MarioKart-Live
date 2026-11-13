// ==========================================================================
// PRESENTATION NOTE
// <<Entity>> UserAccount
//
// Used by: US1, US2, US3, US11, US18, US35, US47.
// What to say: The entity holds the data and the business rules that need stored data (duplicate
//              checks, status checks, counts). Each user story calls its own method here through
//              its controller.
//
// Q: Where is the SQL? I do not see any queries here.
// A: The entity works on its in-memory list. database/db.js loads every table from Neon at
//    start-up and saves each change back in one transaction. This keeps the entity classes the
//    same as our BCE diagram and easy to unit test.
// ==========================================================================

// bring in Node's built-in crypto library (used to hash passwords)
import { createHash } from 'node:crypto';

// the two possible account statuses (frozen = cannot be changed by mistake)
export const AccountStatus = Object.freeze({ ACTIVE: 'Active', SUSPENDED: 'Suspended' });

// <<Entity>> UserAccount
// The ONLY class that stores user accounts. While the site runs they are kept in
// memory; database/db.js loads them from / saves them to PostgreSQL.
export default class UserAccount {
    // all user accounts are kept in this list (loaded from the database at start-up)
    static accounts = [];

    // the fields every account has...
    userId; username; email; passwordHash; fullName; contactNumber;
    // ...continued: role (profile), status and created date
    profileId; accountStatus; createdAt;

    // US1 +createUserAccount(username: String, email: String, password: String,
    //                        fullName: String, contactNumber: String, profileId: Integer): Boolean
    // Field formats are validated by the boundary (CreateUserAccountPage) before this is called.
    // The entity only rejects what needs the stored data: username / email already registered.
    createUserAccount(username, email, password, fullName, contactNumber, profileId) {
        // check if the username OR email is already used by another account...
        const taken = UserAccount.accounts.some(a =>
            // ...same username (ignoring upper/lower case), or
            a.username.toLowerCase() === String(username).toLowerCase() ||
            // ...same email (ignoring upper/lower case)
            a.email.toLowerCase() === String(email).toLowerCase());
        // already taken -> report failure
        if (taken) return false;

        // make a new, empty account object
        const account = new UserAccount();
        // new user ID = number of accounts + 1
        account.userId = UserAccount.accounts.length + 1;
        // save the username
        account.username = username;
        // save the email
        account.email = email;
        // save the password HASHED (never the real password)
        account.passwordHash = UserAccount.hash(password);
        // save the full name
        account.fullName = fullName;
        // save the contact number (blank if none)
        account.contactNumber = contactNumber ?? '';
        // save the role (user profile) this account belongs to
        account.profileId = profileId;
        // new accounts start as Active
        account.accountStatus = AccountStatus.ACTIVE;
        // remember when it was created
        account.createdAt = new Date().toISOString();
        // add it to the list of accounts (so it is stored)
        UserAccount.accounts.push(account);
        // success
        return true;
    }

    // US11 / US18 / US35 / US47
    // +login(username: String, password: String, userProfile: Integer): UserAccount
    // null if the password is wrong, the account is not active,
    // or the account does not belong to the role of the login page used
    login(username, password, userProfile) {
        // find the account with this username
        const account = UserAccount.accounts.find(a => a.username === username);
        // no such username -> login fails
        if (!account) return null;
        // hash the typed password and compare with the stored hash -> wrong password, login fails
        if (account.passwordHash !== UserAccount.hash(password)) return null;
        // suspended account -> login fails
        if (account.accountStatus !== AccountStatus.ACTIVE) return null;
        // the account is not in the role picked on the login screen -> login fails
        if (account.profileId !== userProfile) return null;
        // all checks passed -> return the account (logged in)
        return account;
    }

    // US2 +viewUserAccount(userId: Integer): UserAccount
    // BCE method viewUserAccount() (gets: userId): called by the controller
    viewUserAccount(userId) {
        // return the account with this ID, or null if there is none
        return UserAccount.accounts.find(a => a.userId === userId) ?? null;
    }

    // US3 +updateUserAccount(userId: Integer, fullName: String, email: String,
    //                        contactNumber: String): Boolean
    // Field formats are validated by the boundary (UpdateUserAccountPage).
    // false if the account does not exist or the new email belongs to another account
    updateUserAccount(userId, fullName, email, contactNumber) {
        // find the account to update
        const account = this.viewUserAccount(userId);
        // not found -> report failure
        if (!account) return false;
        // check if ANOTHER account already uses the new email...
        const emailTaken = UserAccount.accounts.some(a =>
            // ...(different user ID, same email ignoring case)
            a.userId !== userId && a.email.toLowerCase() === String(email).toLowerCase());
        // email taken -> report failure
        if (emailTaken) return false;

        // save the full name
        account.fullName = fullName;
        // save the email
        account.email = email;
        // save the contact number (blank if none)
        account.contactNumber = contactNumber ?? '';
        // success
        return true;
    }

    // Helper (not in the BCE): password hashing
    static hash(password) {
        // turn the password into a SHA-256 hash (a one-way code; the real password is never stored)
        return createHash('sha256').update(String(password)).digest('hex');
    }

    // UI support (not a user story): fills the account list screen
    // UI support: give a copy of all accounts (for the account list screen)
    static getAllAccounts() { return [...UserAccount.accounts]; }
}

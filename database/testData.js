// Sprint 1 test data - 25 of the team's 100 test accounts (including the default admin).
// Added IN CODE as part of TDD: test.js checks this data before any story test runs.
// The other 75 accounts (Sprint 2, 3 and 4 batches) are entered through the website's
// Create User Account form - see database/testData.csv.
//
// Accounts go in through the controller (BCE), not straight into the array.
// The admin password "admin" is shorter than the 6-character rule on the Create User Account
// form; that rule lives in the boundary, so code can still create this one demo account.
import CreateUserAccountController from '../control/CreateUserAccountController.js';
// bring in the UserAccount entity class (it holds and checks the user account data), plus AccountStatus
import UserAccount, { AccountStatus } from '../entity/UserAccount.js';

// profileId: 1 User Admin, 2 Interior Designer, 3 Customer, 4 Platform Manager
export const SPRINT1_ACCOUNTS = [
    { username: 'admin', email: 'admin@example.com', password: 'admin', fullName: 'Default Admin', contactNumber: '', profileId: 1 },  // userId 1
    { username: 'designer', email: 'designer@example.com', password: 'designer123', fullName: 'Default Designer', contactNumber: '', profileId: 2 },  // userId 2
    { username: 'customer', email: 'customer@example.com', password: 'customer123', fullName: 'Default Customer', contactNumber: '', profileId: 3 },  // userId 3
    { username: 'manager', email: 'manager@example.com', password: 'manager123', fullName: 'Default Manager', contactNumber: '', profileId: 4 },  // userId 4
    { username: 'suspended', email: 'suspended@example.com', password: 'suspended123', fullName: 'Suspended User', contactNumber: '', profileId: 3, suspended: true },  // userId 5
    { username: 'gerald.teo', email: 'gerald.teo@hotmail.com', password: 'Pass1234', fullName: 'Gerald Teo', contactNumber: '91085620', profileId: 3 },  // userId 6
    { username: 'suresh.pillai', email: 'suresh.pillai@gmail.com', password: 'Pass1234', fullName: 'Suresh Pillai', contactNumber: '90135337', profileId: 3 },  // userId 7
    { username: 'weiming.teo', email: 'weiming.teo@gmail.com', password: 'Pass1234', fullName: 'Wei Ming Teo', contactNumber: '95362583', profileId: 2 },  // userId 8
    { username: 'jiahui.low', email: 'jiahui.low@yahoo.com.sg', password: 'Pass1234', fullName: 'Jia Hui Low', contactNumber: '99832209', profileId: 3 },  // userId 9
    { username: 'russell.ng', email: 'russell.ng@outlook.com', password: 'Pass1234', fullName: 'Russell Ng', contactNumber: '95850773', profileId: 3 },  // userId 10
    { username: 'kavitha.menon', email: 'kavitha.menon@yahoo.com.sg', password: 'Pass1234', fullName: 'Kavitha Menon', contactNumber: '90788598', profileId: 3 },  // userId 11
    { username: 'gabriel.lim', email: 'gabriel.lim@yahoo.com.sg', password: 'Pass1234', fullName: 'Gabriel Lim', contactNumber: '95291853', profileId: 2 },  // userId 12
    { username: 'ravi.menon', email: 'ravi.menon@gmail.com', password: 'Pass1234', fullName: 'Ravi Menon', contactNumber: '95146933', profileId: 3 },  // userId 13
    { username: 'arjun.krishnan', email: 'arjun.krishnan@gmail.com', password: 'Pass1234', fullName: 'Arjun Krishnan', contactNumber: '98463771', profileId: 1 },  // userId 14
    { username: 'anjali.nair', email: 'anjali.nair@hotmail.com', password: 'Pass1234', fullName: 'Anjali Nair', contactNumber: '86204231', profileId: 4 },  // userId 15
    { username: 'anjali.menon', email: 'anjali.menon@hotmail.com', password: 'Pass1234', fullName: 'Anjali Menon', contactNumber: '84889706', profileId: 2 },  // userId 16
    { username: 'huimin.tan', email: 'huimin.tan@hotmail.com', password: 'Pass1234', fullName: 'Hui Min Tan', contactNumber: '83314428', profileId: 3 },  // userId 17
    { username: 'gerald.yeo', email: 'gerald.yeo@gmail.com', password: 'Pass1234', fullName: 'Gerald Yeo', contactNumber: '86532567', profileId: 3 },  // userId 18
    { username: 'glenn.fernandez', email: 'glenn.fernandez@yahoo.com.sg', password: 'Pass1234', fullName: 'Glenn Fernandez', contactNumber: '83886048', profileId: 3 },  // userId 19
    { username: 'nuraisyah.ibrahim', email: 'nuraisyah.ibrahim@hotmail.com', password: 'Pass1234', fullName: 'Nur Aisyah Ibrahim', contactNumber: '88662591', profileId: 2 },  // userId 20
    { username: 'wenjun.wong', email: 'wenjun.wong@hotmail.com', password: 'Pass1234', fullName: 'Wen Jun Wong', contactNumber: '84202206', profileId: 4 },  // userId 21
    { username: 'michelle.chua', email: 'michelle.chua@gmail.com', password: 'Pass1234', fullName: 'Michelle Chua', contactNumber: '91911273', profileId: 3 },  // userId 22
    { username: 'haziq.rahman', email: 'haziq.rahman@gmail.com', password: 'Pass1234', fullName: 'Haziq Rahman', contactNumber: '86945110', profileId: 2 },  // userId 23
    { username: 'xinyi.sim', email: 'xinyi.sim@hotmail.com', password: 'Pass1234', fullName: 'Xin Yi Sim', contactNumber: '81936932', profileId: 4 },  // userId 24
    { username: 'peishan.tay', email: 'peishan.tay@outlook.com', password: 'Pass1234', fullName: 'Pei Shan Tay', contactNumber: '91026049', profileId: 4 },  // userId 25
];

// adds the 25 test accounts
export function loadSprint1TestData() {
    // accounts are created through the real controller, the same way the website does it
    const control = new CreateUserAccountController();
    // for each test account...
    for (const a of SPRINT1_ACCOUNTS) {
        // ...create it (the password is hashed by the entity)
        control.createUserAccount(a.username, a.email, a.password, a.fullName, a.contactNumber, a.profileId);
        // if this test account should be suspended...
        if (a.suspended) {
            // ...find it and set its status to Suspended
            UserAccount.accounts.find(u => u.username === a.username).accountStatus = AccountStatus.SUSPENDED;
        }
    }
}

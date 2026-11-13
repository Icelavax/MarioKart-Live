// ==========================================================================
// PRESENTATION NOTE
// <<Entity>> ReportData
//
// What to say: Shared helper for the three reports. countActivity() counts the activity records
//              that fall inside a period; startOfWeek() makes every weekly report run Monday to
//              Sunday.
//
// Q: Where is the SQL? I do not see any queries here.
// A: The entity works on its in-memory list. database/db.js loads every table from Neon at
//    start-up and saves each change back in one transaction. This keeps the entity classes the
//    same as our BCE diagram and easy to unit test.
// ==========================================================================

// Not a BCE class: shared by DailyReport, WeeklyReport and MonthlyReport.
// "Platform activity" = accounts created + IDPs created + IDP views + IDPs saved,
// counted by the date each one happened. Read-only: never changes any data.
import UserAccount from './UserAccount.js';
// bring in IDP so we can count IDPs created
import IDP from './IDP.js';
// bring in IDPViewRecord so we can count IDP views
import IDPViewRecord from './IDPViewRecord.js';
// bring in SavedIDP so we can count IDPs saved
import SavedIDP from './SavedIDP.js';

export function countActivity(from, to) {          // from inclusive, to exclusive
    // small helper: is this date between "from" (included) and "to" (not included)?
    const inRange = iso => { const t = new Date(iso).getTime(); return t >= from.getTime() && t < to.getTime(); };
    // count each type of activity in the period:
    const breakdown = {
        // accounts created in the period
        accountsCreated: UserAccount.accounts.filter(a => inRange(a.createdAt)).length,
        // IDPs created in the period
        idpsCreated: IDP.idps.filter(i => inRange(i.createdAt)).length,
        // IDP views in the period
        idpViews: IDPViewRecord.records.filter(r => inRange(r.viewedAt)).length,
        // IDPs saved in the period
        idpsSaved: SavedIDP.saved.filter(s => inRange(s.savedDate)).length,
    };
    // add up all the counts to get the total
    const totalActivities = Object.values(breakdown).reduce((a, b) => a + b, 0);
    // give back the total and the counts per type
    return { totalActivities, breakdown };
}

// Start of a day / week (Monday) / month, local time
export const startOfDay = d => new Date(d.getFullYear(), d.getMonth(), d.getDate());
// helper: the Monday of that week (weeks run Monday to Sunday)
export const startOfWeek = d => { const s = startOfDay(d); s.setDate(s.getDate() - ((s.getDay() + 6) % 7)); return s; };
// helper: the 1st day of that month
export const startOfMonth = d => new Date(d.getFullYear(), d.getMonth(), 1);
// helper: the date n days later (n can be negative)
export const addDays = (d, n) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };

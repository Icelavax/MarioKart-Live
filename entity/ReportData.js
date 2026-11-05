// Not a BCE class: shared by DailyReport, WeeklyReport and MonthlyReport.
// "Platform activity" = accounts created + IDPs created + IDP views + IDPs saved,
// counted by the date each one happened. Read-only: never changes any data.
import UserAccount from './UserAccount.js';
import IDP from './IDP.js';
import IDPViewRecord from './IDPViewRecord.js';
import SavedIDP from './SavedIDP.js';

export function countActivity(from, to) {          // from inclusive, to exclusive
    const inRange = iso => { const t = new Date(iso).getTime(); return t >= from.getTime() && t < to.getTime(); };
    const breakdown = {
        accountsCreated: UserAccount.accounts.filter(a => inRange(a.createdAt)).length,
        idpsCreated: IDP.idps.filter(i => inRange(i.createdAt)).length,
        idpViews: IDPViewRecord.records.filter(r => inRange(r.viewedAt)).length,
        idpsSaved: SavedIDP.saved.filter(s => inRange(s.savedDate)).length,
    };
    const totalActivities = Object.values(breakdown).reduce((a, b) => a + b, 0);
    return { totalActivities, breakdown };
}

// Start of a day / week (Monday) / month, local time
export const startOfDay = d => new Date(d.getFullYear(), d.getMonth(), d.getDate());
export const startOfWeek = d => { const s = startOfDay(d); s.setDate(s.getDate() - ((s.getDay() + 6) % 7)); return s; };
export const startOfMonth = d => new Date(d.getFullYear(), d.getMonth(), 1);
export const addDays = (d, n) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };

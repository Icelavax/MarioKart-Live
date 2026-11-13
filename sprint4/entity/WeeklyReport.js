// ==========================================================================
// PRESENTATION NOTE
// <<Entity>> WeeklyReport - US45 Generate Weekly Report
//
// Used by: US45.
// What to say: The entity holds the data and the business rules that need stored data (duplicate
//              checks, status checks, counts). Each user story calls its own method here through
//              its controller.
//
// Q: Where is the SQL? I do not see any queries here.
// A: The entity works on its in-memory list. database/db.js loads every table from Neon at
//    start-up and saves each change back in one transaction. This keeps the entity classes the
//    same as our BCE diagram and easy to unit test.
// ==========================================================================

// bring in the shared counting and date helpers used by all three reports
import { countActivity, startOfWeek, addDays } from './ReportData.js';

// <<Entity>> WeeklyReport - US45 Generate Weekly Report
// ENTITY class WeeklyReport: holds the data and the business rules that need stored data
export default class WeeklyReport {
    // the fields of a weekly report
    reportWeek; totalActivities; breakdown; periodStart; periodEnd;

    // US45 +generateWeeklyReport(reportWeek: Date): WeeklyReport
    // null when there is no activity data for the selected week (A1)
    generateWeeklyReport(reportWeek) {
        // the Monday of the chosen week
        const from = startOfWeek(new Date(reportWeek));
        // end of the period = 7 days later (the next Monday)
        const to = addDays(from, 7);
        // count all platform activity between those two times
        const { totalActivities, breakdown } = countActivity(from, to);
        // nothing happened that day -> no report (the page shows "no data")
        if (totalActivities === 0) return null;
        // make a new WeeklyReport object
        const report = new WeeklyReport();
        // the week this report is for (its Monday)
        report.reportWeek = from;
        // period starts at the start of the day
        report.periodStart = from;
        // period ends on the same day (shown to the user)
        report.periodEnd = addDays(to, -1);
        // total number of activities in that day
        report.totalActivities = totalActivities;
        // the counts per activity type (accounts, IDPs, views, saves)
        report.breakdown = breakdown;
        // give the finished report back to the controller
        return report;
    }
}
